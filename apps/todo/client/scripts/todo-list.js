import { computed, effect, signal } from "@preact/signals-core";
import * as v from "valibot";
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
import { html, css } from "@isallitis/shared-components/utils.js";
import { TodoAppLayout, todoLinkCSS } from "./layout.js";
import {
  deleteTodo,
  getAllTodos,
  createTodo,
  getAllTodoTemplateLists,
  getTemplateListTodos,
  createTodoTemplateList,
  createTodoTemplate,
} from "./models.js";

/** @typedef {import("./models.js").Todo} Todo */
/** @typedef {import("./models.js").TodoTemplate} TodoTemplate */
/** @typedef {import("./models.js").TodoTemplateList} TodoTemplateList */

/**
 * @template T
 * @typedef {import("@preact/signals-core").Signal<T>} Signal
 */

// -----------------------------
// Signals for global app state.
// -----------------------------

/**
 * @type {Signal<Array<(Todo | TodoTemplate)>>} TodoSignal
 */
const todos = signal([]);

const todosById = computed(() => {
  /** @type {Record<number, Todo | TodoTemplate>} */
  const todosById = {};

  todos.value.forEach((todo) => {
    todosById[todo.id] = todo;
  });

  return todosById;
});

/**
 * @type {Signal<Array<TodoTemplateList>>}
 */
const templateLists = signal([]);

const templateListNames = computed(() => {
  return templateLists.value.map(({ name }) => name);
});

/** @type {Signal<TodoTemplateList | undefined>} */
const activeTemplateList = computed(() => {
  const searchParams = new URLSearchParams(window.location.search);
  const listId = searchParams.get("template");
  const activeList = templateLists.value.find(
    ({ id }) => id === Number(listId),
  );

  return activeList ?? templateLists.value[0];
});

// ----------------
// Route utilities.
// ----------------

const DEFAULT = "DEFAULT";

const TEMPLATES = "TEMPLATES";

const ViewSchema = v.enum({ DEFAULT, TEMPLATES });

/** @typedef {import("valibot").InferInput<typeof ViewSchema>} View */

/**
 * Maps the route to the corresponding app view.
 *
 * @type {Record<string, View>}
 */
const VIEW_MAP = {
  "/": DEFAULT,
  "/template-lists.html": TEMPLATES,
};

/**
 * Returns the view type based on the route. This will throw if the route is invalid.
 */
function getView() {
  return v.parse(ViewSchema, VIEW_MAP[window.location.pathname]);
}

// ------------------------------
// View initialization utilities.
// ------------------------------

async function initDefaultView() {
  const allTodos = await getAllTodos();
  todos.value = allTodos;
}

async function initTemplateView() {
  const allTemplateLists = await getAllTodoTemplateLists();
  templateLists.value = allTemplateLists;

  if (activeTemplateList.value) {
    const allTodos = await getTemplateListTodos(activeTemplateList.value.id);
    todos.value = allTodos;
  }
}

/**
 * Maps a view to the corresponding initialization function.
 *
 * @type {Record<string, () => Promise<void>>}
 * */
const INIT_MAP = {
  [DEFAULT]: initDefaultView,
  [TEMPLATES]: initTemplateView,
};

/**
 * Synchronizes the appropriate signals with IndexedDB based on the current app
 * view.
 */
function initView() {
  return INIT_MAP[getView()]();
}

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

CustomElement.define("todo-card", TodoCard);

const templateNavLinkCSS = createStyleSheet(css`
  a {
    display: block;
  }
`);

class TemplateNavLink extends CustomElement {
  static styles = [defaultSheet, todoLinkCSS, templateNavLinkCSS];

  get active() {
    const link = this.getElement(HTMLAnchorElement, "a");
    return link.classList.contains("active");
  }

  /**
   * @param {boolean} isActive
   */
  set active(isActive) {
    const link = this.getElement(HTMLAnchorElement, "a");

    if (isActive) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  }

  get href() {
    return this.getAttribute("href");
  }

  /**
   * @param {(string | null)} url
   */
  set href(url) {
    if (url) {
      this.setAttribute("href", url);
    }
  }

  render() {
    return html`<a href=${this.href}><slot></slot></a>`;
  }
}

CustomElement.define("template-nav-link", TemplateNavLink);

const templateNavCSS = createStyleSheet(css`
  :host {
    align-items: center;
    display: flex;
    max-width: 600px;
    width: 100vw;
    border-top: 2px dotted var(--color-primary);
    border-bottom: 2px dotted var(--color-primary);
  }

  nav {
    margin-left: var(--space-m);
    width: 70%;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  li {
    list-style-type: none;
  }

  #template-links {
    display: flex;
    gap: var(--space-s);
    overflow: auto;
    padding-top: var(--space-s);
    padding-bottom: var(--space-s);
  }

  #template-links > li {
    white-space: nowrap;
  }

  #template-menu {
    border-left: 2px dotted var(--color-primary);
    display: flex;
    flex-grow: 1;
    justify-content: flex-end;
    margin-right: var(--space-m);
    padding-left: var(--space-s);
    padding-top: calc(var(--space-s) / 2);
    padding-bottom: calc(var(--space-s) / 2);
  }
`);

class TemplateNav extends CustomElement {
  static styles = [defaultSheet, templateNavCSS];

  constructor() {
    super();

    this.appendTemplateLinks = this.appendTemplateLinks.bind(this);
    this.handleTemplateAddButtonClick =
      this.handleTemplateAddButtonClick.bind(this);
    this.setActiveTemplateLink = this.setActiveTemplateLink.bind(this);
  }

  get nav() {
    return this.getSelector("nav");
  }

  get templateLinks() {
    return this.getSelector("#template-links");
  }

  get templateMenu() {
    return this.getSelector("#template-menu");
  }

  get templateAddButton() {
    return this.getCustomElement(Button);
  }

  get templateAddDialog() {
    return this.getCustomElement(TemplateAddDialog);
  }

  appendTemplateLinks() {
    /** @type {Array<HTMLElement>} */
    const links = [];

    for (const { id, name } of templateLists.value) {
      if (!this.hasTemplateLink(name)) {
        const listItem = document.createElement("li");
        const link = new TemplateNavLink();
        const templateUrl = new URL(window.location.href);

        templateUrl.searchParams.set("template", String(id));
        link.innerHTML = name;
        link.href = `${templateUrl.pathname}?${templateUrl.searchParams}`;
        listItem.append(link);

        links.push(listItem);
      }
    }

    if (links.length) {
      this.templateLinks.append(...links);
    }
  }

  async connectedCallback() {
    super.connectedCallback();

    this.templateAddButton.addEventListener(
      "click",
      this.handleTemplateAddButtonClick,
    );

    effect(this.appendTemplateLinks);
    effect(this.setActiveTemplateLink);
  }

  /**
   * @param {string} name
   * @returns {TemplateNavLink}
   */
  getTemplateLink(name) {
    for (const listItem of this.templateLinks.children) {
      const link = listItem.firstChild;

      if (link instanceof TemplateNavLink && link.innerHTML === name) {
        return link;
      }
    }

    throw new Error(`Unable to find TemplateNavLink with text ${name}`);
  }

  handleTemplateAddButtonClick() {
    this.templateAddDialog.dialog.showModal();
  }

  /**
   * @param {string} name
   */
  hasTemplateLink(name) {
    for (const listItem of this.templateLinks.children) {
      const link = listItem.firstElementChild;

      if (link?.innerHTML === name) {
        return true;
      }
    }

    return false;
  }

  setActiveTemplateLink() {
    if (activeTemplateList.value) {
      const link = this.getTemplateLink(activeTemplateList.value.name);

      if (!link.active) {
        link.active = true;
      }
    }
  }

  render() {
    return html`
      <nav>
        <ul id="template-links"></ul>
      </nav>
      
      <ul id="template-menu">
        <li>
          <${Button} radius="round" variation="icon">
            <${PenToSquare} width="16">Add to-do</${PenToSquare}>
          </${Button}>
        </li>
      </ul>
      
      <${TemplateAddDialog}></${TemplateAddDialog}>
    `;
  }
}

CustomElement.define("template-nav", TemplateNav);

const templateHeadingCSS = createStyleSheet(css`
  :host {
    width: 100%;
  }

  h2 {
    margin: 0;
  }
`);

class TemplateHeading extends CustomElement {
  static styles = [defaultSheet, templateHeadingCSS];

  static defaultHeader = "No templates.";

  static defaultDescription =
    "To create a template, press the create button above.";

  constructor() {
    super();

    this.handleHeaderChange = this.handleHeaderChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
  }

  get header() {
    return this.getSelector("h2");
  }

  get description() {
    const pEl = this.shadowRoot?.querySelector("p");

    return pEl ?? null;
  }

  createDescription() {
    const description =
      activeTemplateList.value?.description ??
      TemplateHeading.defaultDescription;
    const parEl = document.createElement("p");
    parEl.innerHTML = description;
    this.shadowRoot?.appendChild(parEl);
  }

  deleteDescription() {
    const parEl = this.getSelector("p");
    parEl.remove();
  }

  updateDescription() {
    const description =
      activeTemplateList.value?.description ??
      TemplateHeading.defaultDescription;
    const parEl = this.getSelector("p");
    parEl.innerHTML = description;
  }

  handleDescriptionChange() {
    const hasTemplate = activeTemplateList.value !== undefined;
    const hasDescription =
      activeTemplateList.value !== undefined &&
      activeTemplateList.value.description !== "";
    const hasParEl = this.description !== null;

    const shouldUpdateDefaultDescription = !hasTemplate && hasParEl;
    const shouldUpdateNewDescription =
      hasTemplate && hasParEl && hasDescription;
    const shouldUpdateDescription =
      shouldUpdateDefaultDescription || shouldUpdateNewDescription;

    const shouldCreateDefaultDescription = !hasTemplate && !hasParEl;
    const shouldCreateNewDescription = hasDescription && !hasParEl;
    const shouldCreateDescription =
      shouldCreateDefaultDescription || shouldCreateNewDescription;

    const shouldDeleteDescription = hasTemplate && hasParEl && !hasDescription;

    if (shouldUpdateDescription) {
      this.updateDescription();
    } else if (shouldCreateDescription) {
      this.createDescription();
    } else if (shouldDeleteDescription) {
      this.deleteDescription();
    }
  }

  handleHeaderChange() {
    const activeName = activeTemplateList.value?.name;
    this.header.innerHTML = activeName ?? TemplateHeading.defaultHeader;
  }

  connectedCallback() {
    super.connectedCallback();

    effect(this.handleHeaderChange);
    effect(this.handleDescriptionChange);
  }

  render() {
    return html`<h2></h2>`;
  }
}

CustomElement.define("template-heading", TemplateHeading);

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
    this.handleTemplateUpdate = this.handleTemplateUpdate.bind(this);
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

  handleTemplateUpdate() {
    const nav = this.queryCustomElement(TemplateNav);

    if (templateListNames.value.length && !nav) {
      const nav = new TemplateNav();
      this.getShadowRoot().prepend(nav);
    }
  }

  /**
   * @param {(Todo | TodoTemplate)} todo
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
    effect(this.handleTemplateUpdate);
  }

  render() {
    // NOTE: Card elements are appended in the `handleTodoListUpdate` method that
    // gets triggered by changes in the `todos` signal.
    const view = getView();

    if (view === "TEMPLATES") {
      return html`
        <${TemplateNav}></${TemplateNav}>
        <${TemplateHeading}></${TemplateHeading}>
      `;
    }

    return null;
  }
}

CustomElement.define("todo-list", TodoList);

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

CustomElement.define("todo-add-button", TodoAddButton);

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
    return this.getElement(HTMLInputElement, "input");
  }

  connectedCallback() {
    super.connectedCallback();

    this.createButton.addClickEventListener(this.handleCreateButtonClicked);
    this.input.addEventListener("keydown", this.handleInputKeypress);
    this.dialog.addDialogOpenListener(this.handleDialogOpen);
  }

  async createToDo() {
    const description = this.input.value;
    const templateListId = activeTemplateList.value?.id;
    const newTodoPromise = templateListId
      ? createTodoTemplate({
          description,
          templateListId,
        })
      : createTodo({ description });

    try {
      const newTodo = await newTodoPromise;
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

CustomElement.define("todo-add-dialog", TodoAddDialog);

class TemplateAddDialog extends CustomElement {
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

  get descriptionInput() {
    return this.getElement(HTMLInputElement, "input#description");
  }

  get nameInput() {
    return this.getElement(HTMLInputElement, "input#name");
  }

  connectedCallback() {
    super.connectedCallback();

    this.createButton.addClickEventListener(this.handleCreateButtonClicked);
    this.nameInput.addEventListener("keydown", this.handleInputKeypress);
    this.descriptionInput.addEventListener("keydown", this.handleInputKeypress);
    this.dialog.addDialogOpenListener(this.handleDialogOpen);
  }

  async createTemplate() {
    const name = this.nameInput.value;
    const description = this.descriptionInput.value;

    try {
      const newTemplate = await createTodoTemplateList({ description, name });
      this.dialog.handleCloseButtonClick();
      this.nameInput.value = "";
      templateLists.value = [...templateLists.value, newTemplate];
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
      this.createTemplate();
    }
  }

  /**
   * @param {Event} event
   */
  handleCreateButtonClicked(event) {
    event.preventDefault();
    this.createTemplate();
  }

  handleDialogOpen() {
    this.nameInput.focus();
  }

  render() {
    return html`
      <${Dialog}>
        <form>
          <h2>New Template</h2>
          
          <fieldset>
            <label for="name">Name</label>
            <input type="text" id="name" />
          </fieldset>

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

CustomElement.define("template-add-dialog", TemplateAddDialog);

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

    await initView();
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

CustomElement.define("todo-list-view", TodoListView);
