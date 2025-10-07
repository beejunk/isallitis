import { computed, effect, signal } from "@preact/signals-core";
import {
  Button,
  Card,
  CircleXMark,
  CustomElement,
  Dialog,
  PenToSquare,
} from "@isallitis/shared-components/components.js";
import { defaultSheet } from "@isallitis/shared-components/style-sheets.js";
import {
  createStyleSheet,
  tag,
  html,
  css,
} from "@isallitis/shared-components/utils.js";
import { saveToDo, deleteToDo, createTodo, getAllToDos } from "./db.js";
import { register } from "./register.js";

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

const todoCardCSS = createStyleSheet(css`
  :host {
    width: 100%;
  }

  .todo-card-body {
    display: flex;
    justify-content: space-between;
  }
`);

class TodoCard extends CustomElement {
  styles = [todoCardCSS];

  #todo = computed(() => {
    const id = this.todoId;

    return id ? todosById.value[id] : null;
  });

  /**
   * @type {Signal<null | number>}
   */
  #todoId = signal(null);

  constructor() {
    super();
    this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
  }

  get todo() {
    return this.#todo.value;
  }

  get todoId() {
    return this.#todoId.value;
  }

  /**
   * @param {(number | null)} id
   */
  set todoId(id) {
    this.#todoId.value = id;
  }

  get deleteButton() {
    return this.getCustomElement(Button);
  }

  async handleDeleteButtonClick() {
    const todoId = this.todoId;

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

const todoListCSS = createStyleSheet(css`
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: var(--space-m);
  }

  ${TodoCard} {
    width: 100%;
  }
`);

class TodoList extends CustomElement {
  static styles = [todoListCSS];

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
      if (card instanceof TodoCard && card.todoId === id) {
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
    const todoCard = CustomElement.createElement(TodoCard);

    todoCard.todoId = todo.id;

    this.getShadowRoot().appendChild(todoCard);
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

const todoDialogCSS = createStyleSheet(css`
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
`);

class TodoAddDialog extends CustomElement {
  styles = [todoDialogCSS];

  constructor() {
    super();

    this.handleCreateButtonClicked = this.handleCreateButtonClicked.bind(this);
    this.handleInputKeypress = this.handleInputKeypress.bind(this);
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
    this.input.addEventListener("keydown", this.handleInputKeypress);
  }

  async createToDo() {
    // TODO Some kind of validation
    const description = this.input.value;

    try {
      const newTodo = await saveToDo(createTodo({ description }));
      this.dialog.handleCloseButtonClick();
      this.input.value = "";
      todos.value = [...todos.value, newTodo];
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  handleInputKeypress(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.createToDo();
    }
  }

  /**
   * @param {Event} event
   */
  handleCreateButtonClicked(event) {
    event.preventDefault();
    this.createToDo();
  }

  render() {
    return html`
      <${Dialog}>
        <form>
          <h2>To-Do</h2>
          
          <fieldset>
            <label for="description">Description</label>
            <input type="text" id="description" />
          </fieldset>
          
          <${Button}>Create</${Button}>
        </form>
      </${Dialog}>
    `;
  }
}

CustomElement.define(tag`todo-add-dialog`, TodoAddDialog);

const todoAppCSS = createStyleSheet(css`
  :host {
    display: flex;
    flex-direction: column;
    gap: calc(var(--base-size) * 2);
    align-content: center;
    min-height: 100vh;
  }

  .content {
    flex-grow: 1;
    margin: 0 auto;
    max-width: 600px;
    width: 100%;
  }

  .content header {
    align-items: center;
    display: flex;
    gap: 16px;
    padding: 16px 0;
  }

  .content header h1,
  .content header p {
    margin: 0;
  }

  ${TodoAddButton} {
    align-self: flex-end;
    bottom: 0;
    padding-bottom: calc(var(--base-size) * 4);
    padding-right: calc(var(--base-size) * 2);
    position: sticky;
    right: 0;
  }
`);

/**
 * Main ToDo app container component.
 */
class TodoApp extends CustomElement {
  static styles = [defaultSheet, todoAppCSS];

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

  async connectedCallback() {
    super.connectedCallback();

    await register();

    this.todoAddButton.button.addClickEventListener(
      this.handleAddTodoButtonClick,
    );
  }

  render() {
    return html`
      <div class="content">
        <header>
          <h1>To-Do</h1>
          <p><em>Is All It Is</em></p>
        </header>

        <${TodoList}></${TodoList}>
      </div>

      <${TodoAddButton}></${TodoAddButton}>

      <${TodoAddDialog}></${TodoAddDialog}>
    `;
  }
}

CustomElement.define(tag`todo-app`, TodoApp);
