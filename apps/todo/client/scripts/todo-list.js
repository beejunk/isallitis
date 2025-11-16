import { computed, effect, signal } from "@preact/signals-core";
import { Button } from "@isallitis/shared-components/button/custom-element.js";
import { Card } from "@isallitis/shared-components/card/custom-element.js";
import { CircleXMark } from "@isallitis/shared-components/circle-xmark/custom-element.js";
import {
  CustomElement,
  createStyleSheet,
} from "@isallitis/shared-components/custom-element.js";
import { Dialog } from "@isallitis/shared-components/dialog/custom-element.js";
import { PenToSquare } from "@isallitis/shared-components/pen-to-square/custom-element.js";
import { defaultSheet } from "@isallitis/shared-components/styles/style-sheets.js";
import { tag, html, css } from "@isallitis/shared-components/utils.js";
import { TodoAppLayout } from "./layout.js";
import { deleteTodo, getAllTodos, createTodo } from "./models.js";

/** @typedef {import("./models.js").ToDo} ToDo */

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
    align-items: center;
  }

  p {
    flex-grow: 1;
  }
`);

class TodoCard extends CustomElement {
  static styles = [defaultSheet, todoCardCSS];

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

      await deleteTodo(todoId);
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
            <${CircleXMark} fill="primary">Delete to-do</${CircleXMark}>
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

    const allTodos = await getAllTodos();
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
      <${Button} radius="round" variation="icon">
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
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
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
    this.dialog.addDialogOpenListener(this.handleDialogOpen);
  }

  async createToDo() {
    const description = this.input.value;

    try {
      const newTodo = await createTodo({ description });
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

  handleDialogOpen() {
    this.input.focus();
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

/**
 * Main ToDo list.
 */
class TodoListView extends CustomElement {
  static styles = [defaultSheet];

  constructor() {
    super();

    this.handleAddTodoButtonClick = this.handleAddTodoButtonClick.bind(this);
  }

  get todoList() {
    return this.getCustomElement(TodoList);
  }

  get todoAddDialog() {
    return this.getCustomElement(TodoAddDialog);
  }

  get todoAddButton() {
    return this.getCustomElement(TodoAddButton);
  }

  async handleAddTodoButtonClick() {
    this.todoAddDialog.dialog.showModal();
  }

  async connectedCallback() {
    super.connectedCallback();

    this.todoAddButton.button.addClickEventListener(
      this.handleAddTodoButtonClick,
    );
  }

  render() {
    return html`
      <${TodoAppLayout}>
        <${TodoList} slot="list"></${TodoList}>
        <${TodoAddDialog} slot="dialog"></${TodoAddDialog}>
        <${TodoAddButton} slot="add-button"></${TodoAddButton}>
      </${TodoAppLayout}>
    `;
  }
}

CustomElement.define(tag`todo-list-view`, TodoListView);
