import {
  Button,
  Card,
  CircleXMark,
  CustomElement,
  Dialog,
  PenToSquare,
} from "@isallitis/shared-components/components.js";
import { tag, html, css } from "@isallitis/shared-components/utils.js";
import { saveToDo, deleteToDo, createTodo, getAllToDos } from "./db.js";
import { computed, effect, signal } from "@preact/signals-core";

/** @typedef {import("./db.js").ToDo} ToDo */

/**
 * @template T
 * @typedef {import("@preact/signals-core").Signal<T>} Signal
 */

// -----------------------------
// Signals for global app state.
// -----------------------------

/**
 * @type {Signal<Array<ToDo>>} ToDoSignal
 */
const todos = signal([]);

const todosById = computed(() => {
  /** @type {Record<number, ToDo>} */
  const todosById = {};

  todos.value.forEach((todo) => {
    todosById[todo.id] = todo;
  });

  return todosById;
});

// ---------------
// Custom Elements
// ---------------

const todoCardCSS = css`
  :host {
    width: 100%;
  }

  .todo-card-body {
    display: flex;
    justify-content: space-between;
  }
`;

class TodoCard extends CustomElement {
  styles = new CSSStyleSheet();

  #todoSignal = computed(() => {
    const id = this.todoId.value;

    return id ? todosById.value[id] : null;
  });

  /**
   * @type {Signal<null | number>}
   */
  todoId = signal(null);

  constructor() {
    super();
    this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
  }

  get todo() {
    return this.#todoSignal.value;
  }
  get deleteButton() {
    return this.getCustomElement(Button);
  }

  async handleDeleteButtonClick() {
    const todoId = this.todo?.id;

    if (todoId) {
      const nextToDos = todos.value.filter(({ id }) => id !== todoId);

      await deleteToDo(todoId);
      todos.value = nextToDos;
      this.remove();
    }
  }

  connectedCallback() {
    super.connectedCallback();

    this.deleteButton.addClickEventListener(this.handleDeleteButtonClick);
  }

  render() {
    this.styles.replaceSync(todoCardCSS);

    if (!this.todo) {
      return null;
    }

    return html`
      <${Card}>
        <div class="todo-card-body">
          <p>${this.todo.description}</p>
          
          <${Button} variation="icon">
            <${CircleXMark} fill="white">Delete to-do</${CircleXMark}>
          </${Button}>
        </div>
      </${Card}>
    `;
  }
}

CustomElement.define(tag`todo-card`, TodoCard);

const todoListCSS = css`
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: calc(var(--base-size) * 2);
  }
`;

class TodoList extends CustomElement {
  styles = new CSSStyleSheet();

  constructor() {
    super();

    this.appendTodoCard = this.appendTodoCard.bind(this);
    this.handleTodoListUpdate = this.handleTodoListUpdate.bind(this);
  }

  /**
   * @param {number} id
   * @returns {(TodoCard | null)}
   */
  queryTodoCardById(id) {
    const shadowRoot = this.shadowRoot;

    if (!shadowRoot) {
      throw new Error("Unexpected missing `shadowRoot`.");
    }

    const cards = shadowRoot.querySelectorAll(`${TodoCard}`);

    for (const card of cards) {
      if (card instanceof TodoCard && card.todoId.value === id) {
        return card;
      }
    }

    return null;
  }

  /**
   * Appends <ToDo> cards for any to-do that is not associated with an existing
   * card.
   *
   * This does not need to handle card deletions. Cards delete themselves, and
   * will no longer be in the `todos` signal when the effect runs.
   */
  handleTodoListUpdate() {
    for (const todo of todos.value) {
      if (!this.queryTodoCardById(todo.id)) {
        this.appendTodoCard(todo);
      }
    }
  }

  /**
   * @param {ToDo} todo
   */
  appendTodoCard(todo) {
    // TODO This could be useful as a utility.
    const todoCard = document.createElement(`${TodoCard}`);

    if (todoCard instanceof TodoCard && this.shadowRoot) {
      todoCard.todoId.value = todo.id;
      this.shadowRoot.appendChild(todoCard);
    }
  }

  async connectedCallback() {
    super.connectedCallback();

    // The `TodoList` is never disconnected, so there is no need to managed unsubscribing
    // from this effect.
    effect(this.handleTodoListUpdate);

    const allTodos = await getAllToDos();
    todos.value = allTodos;
  }

  render() {
    this.styles.replaceSync(todoListCSS);

    // Card elements are appended in the `handleTodoListUpdate` method that gets
    // triggered by changes in the `todos` signal.
    return null;
  }
}

CustomElement.define(tag`todo-list`, TodoList);

class TodoAddButton extends CustomElement {
  get button() {
    return this.getCustomElement(Button);
  }

  render() {
    return html`
      <${Button} radius="round">
        <${PenToSquare} width="35">Add to-do</${PenToSquare}>
      </${Button}>
    `;
  }
}

CustomElement.define(tag`todo-add-button`, TodoAddButton);

const todoDialogCSS = css`
  form {
    display: flex;
    flex-direction: column;
    gap: calc(var(--base-size) * 2);
    width: 85vw;
    min-height: 50vh;
    max-width: 530px;
  }

  fieldset {
    border: none;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 0;
  }

  label {
    padding-bottom: calc(var(--base-size) * 2);
  }

  ${Button} {
    align-self: flex-end;
  }
`;

class TodoAddDialog extends CustomElement {
  styles = new CSSStyleSheet();

  constructor() {
    super();

    this.handleCreateButtonClicked = this.handleCreateButtonClicked.bind(this);
  }

  get createButton() {
    return this.getCustomElement(Button, `form ${Button}`);
  }

  get dialog() {
    return this.getCustomElement(Dialog);
  }

  get input() {
    const inputEl = this.getShadowRoot().querySelector("input");

    if (!(inputEl instanceof HTMLInputElement)) {
      throw new Error("Unable to find form input in to-do dialog.");
    }

    return inputEl;
  }

  connectedCallback() {
    super.connectedCallback();

    this.createButton.addClickEventListener(this.handleCreateButtonClicked);
  }

  /**
   * @param {Event} event
   * @returns {Promise<void>}
   */
  async handleCreateButtonClicked(event) {
    event.preventDefault();

    // TODO Some kind of validation
    const description = this.input.value;

    try {
      const newTodo = await saveToDo(createTodo({ description }));
      this.dialog.handleCloseButtonClick();
      todos.value = [...todos.value, newTodo];
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    this.styles.replaceSync(todoDialogCSS);

    return html`
      <${Dialog}>
        <form>
          <h2>To-Do</h2>
          
          <fieldset>
            <label for="description">Description</label>
            <input type="text" id="description" />
          </fieldset>
          
          <${Button}>Create</Button>
        </form>
      </${Button}>
    `;
  }
}

CustomElement.define(tag`todo-add-dialog`, TodoAddDialog);

/**
 * Main ToDo app container component.
 */
class TodoApp extends CustomElement {
  constructor() {
    super();

    this.handleAddTodoButtonClick = this.handleAddTodoButtonClick.bind(this);
  }

  get todoAddButton() {
    return this.getCustomElement(TodoAddButton);
  }

  get todoList() {
    return this.getCustomElement(TodoList);
  }

  get todoAddDialog() {
    return this.getCustomElement(TodoAddDialog);
  }

  async handleAddTodoButtonClick() {
    this.todoAddDialog.dialog.showModal();
  }

  connectedCallback() {
    super.connectedCallback();

    this.todoAddButton.button.addClickEventListener(
      this.handleAddTodoButtonClick,
    );
  }
}

CustomElement.define(tag`todo-app`, TodoApp);
