import * as v from "valibot";
import {
  deleteModel,
  readAllModels,
  readModel,
  saveModel,
  TODO_TEMPLATE_LISTS,
  TODO_TEMPLATES,
  TODOS,
} from "./db.js";

// ----
// Todo
// ----

const TodoStateSchema = v.union([v.literal("ACTIVE"), v.literal("COMPLETE")]);

/**
 * @typedef {import("valibot").InferOutput<typeof TodoStateSchema>} TodoState
 */

const ToDoSchema = v.object({
  id: v.number(),
  description: v.string(),
  state: TodoStateSchema,
  type: v.literal("todo"),
  templateId: v.nullish(v.number()),
});

/**
 * @typedef {import("valibot").InferOutput<typeof ToDoSchema>} ToDo
 */

/**
 * @typedef {Omit<ToDo, "id" | "type" | "state">} IncomingTodo
 */

/**
 * @param {IncomingTodo} todo
 */
export async function createTodo(todo) {
  const newTodo = {
    ...todo,
    type: "todo",
    state: "ACTIVE",
    templateId: null,
  };

  return saveModel(TODOS, newTodo, v.omit(ToDoSchema, ["id"]));
}

/**
 * @param {number} id
 * @returns {Promise<ToDo>}
 */
export async function getTodo(id) {
  return readModel(TODOS, id, ToDoSchema);
}

/**
 * @returns {Promise<Array<ToDo>>}
 */
export async function getAllTodos() {
  return readAllModels(TODOS, ToDoSchema);
}

/**
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteTodo(id) {
  return deleteModel(TODOS, id);
}

// ------------
// TodoTemplate
// ------------

const TodoTemplateSchema = v.object({
  id: v.number(),
  name: v.string(),
  description: v.string(),
  type: v.literal("todo-template"),
  templateListId: v.number(),
});

/**
 * @typedef {import("valibot").InferOutput<typeof TodoTemplateSchema>} TodoTemplate
 */

/**
 * @typedef {Omit<TodoTemplate, "id" | "type">} IncomingToDoTemplate
 */

/**
 * @param {IncomingToDoTemplate} template
 * @returns {Promise<TodoTemplate>}
 */
export async function createTodoTemplate(template) {
  // Confirm the corresponding template list exists. If it does not, this request
  // will reject.
  await getTodoTemplateList(template.templateListId);

  const newTemplate = {
    ...template,
    type: "todo-template",
  };

  return saveModel(
    TODO_TEMPLATES,
    newTemplate,
    v.omit(TodoTemplateSchema, ["id"]),
  );
}

/**
 * @returns {Promise<Array<TodoTemplate>>}
 */
export async function getAllTodoTemplates() {
  return readAllModels(TODO_TEMPLATES, TodoTemplateSchema);
}

/**
 * @param {number} id
 * @returns {Promise<TodoTemplate>}
 */
export async function getTodoTemplate(id) {
  return readModel(TODO_TEMPLATES, id, TodoTemplateSchema);
}

/**
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteTodoTemplate(id) {
  return deleteModel(TODO_TEMPLATES, id);
}

// ----------------
// TodoTemplateList
// ----------------

const TodoTemplateListSchema = v.object({
  id: v.number(),
  name: v.string(),
  description: v.string(),
  type: v.literal("todo-template-list"),
});

/**
 * @typedef {import("valibot").InferOutput<typeof TodoTemplateListSchema>} TodoTemplateList
 */

/**
 * @typedef {Omit<TodoTemplateList, "id" | "type">} IncomingTodoTemplateList
 */

/**
 * @param {IncomingTodoTemplateList} list
 * @returns {Promise<TodoTemplateList>}
 */
export async function createTodoTemplateList(list) {
  const newList = {
    ...list,
    type: "todo-template-list",
  };

  return saveModel(
    TODO_TEMPLATE_LISTS,
    newList,
    v.omit(TodoTemplateListSchema, ["id"]),
  );
}

/**
 * @param {number} id
 * @returns {Promise<TodoTemplateList>}
 */
export async function getTodoTemplateList(id) {
  return readModel(TODO_TEMPLATE_LISTS, id, TodoTemplateListSchema);
}

/**
 * @returns {Promise<Array<TodoTemplateList>>}
 */
export async function getAllTodoTemplateLists() {
  return readAllModels(TODO_TEMPLATE_LISTS, TodoTemplateSchema);
}

/**
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteTodoTemplateList(id) {
  return deleteModel(TODO_TEMPLATE_LISTS, id);
}

/**
 * @param {number} key
 * @returns {Promise<Array<TodoTemplate>>}
 */
export async function getTemplateListTodos(key) {
  const todoTemplates = await getAllTodoTemplates();
  return todoTemplates.filter(({ templateListId }) => templateListId === key);
}
