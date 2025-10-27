import * as v from "valibot";

// ------------------------
// To-do database meta data
// ------------------------

const TODO_DB_NAME = "todo_db";

const VERSION = 1;

// --------------
// Object stores.
// --------------

const TODOS = "todos";
const TODO_TEMPLATES = "todo_templates";
const TODO_TEMPLATE_LISTS = "todo_template_lists";

// -------
// Schemas
// -------

const ToDoStateSchema = v.union([v.literal("ACTIVE"), v.literal("COMPLETE")]);

/**
 * @typedef {import("valibot").InferOutput<typeof ToDoStateSchema>} ToDoState
 */

const ToDoTemplateSchema = v.object({
  id: v.number(),
  name: v.string(),
  description: v.string(),
  type: v.literal("todo-template"),
});

/**
 * @typedef {import("valibot").InferOutput<typeof ToDoTemplateSchema>} ToDoTemplate
 */

const ToDoSchema = v.object({
  id: v.number(),
  description: v.string(),
  state: ToDoStateSchema,
  type: v.literal("todo"),
  templateId: v.nullish(v.number()),
});

/**
 * @typedef {import("valibot").InferOutput<typeof ToDoSchema>} ToDo
 */

const IncomingToDoSchema = v.omit(ToDoSchema, ["id"]);

/**
 * @typedef {import("valibot").InferOutput<typeof IncomingToDoSchema>} IncomingToDo
 */

const IncomingToDoTemplateSchema = v.omit(ToDoTemplateSchema, ["id"]);

/**
 * @typedef {import("valibot").InferOutput<typeof IncomingToDoTemplateSchema>} IncomingToDoTemplate
 */

const TodoTemplateListSchema = v.object({
  id: v.number(),
  name: v.string(),
  description: v.string(),
  type: v.literal("todo-template-list"),
  templateIds: v.array(v.number()),
});

/**
 * @typedef {import("valibot").InferOutput<typeof TodoTemplateListSchema>} TodoTemplateList
 */

const IncomingTodoTemplateListSchema = v.omit(TodoTemplateListSchema, ["id"]);

/**
 * @typedef {import("valibot").InferOutput<typeof IncomingTodoTemplateListSchema>} IncomingTodoTemplateList
 */

const IDBRequestWithTodoSchema = v.object({
  result: ToDoSchema,
});

const IDBRequestWithTodosArraySchema = v.object({
  result: v.array(ToDoSchema),
});

const IDBRequestWithTodoTemplateSchema = v.object({
  result: ToDoTemplateSchema,
});

const IDBRequestWithTodoTemplateListSchema = v.object({
  result: TodoTemplateListSchema,
});

const IDBRequestWithTodoTemplateListsArraySchema = v.object({
  result: v.array(TodoTemplateListSchema),
});

const IDBRequestWithTodoTemplatesArraySchema = v.object({
  result: v.array(ToDoTemplateSchema),
});

const IDBRequestWithDBResultSchema = v.object({
  result: v.instance(IDBDatabase),
});

const IDBRequestWithIDResultSchema = v.object({ result: v.number() });

/**
 * @param {Pick<ToDo, "description">} todo
 * @returns {Omit<ToDo, "id">}
 */
export function createTodo({ description }) {
  return {
    type: "todo",
    description,
    state: "ACTIVE",
    templateId: null,
  };
}

// ------
// Errors
// ------

class DBTransactionError extends Error {
  /**
   * @param {Event} event
   */
  constructor(event) {
    super(event.toString());
  }
}

class DBRequestError extends DBTransactionError {}

// -----
// Utils
// -----

/**
 * Creates a wrapper for an IndexedDB event handler that abstracts away the boilerplate
 * of needing to catch and reject errors. Useful due to the need to run assertions
 * against IndexedDB events in order to read event values in a type safe manner.
 *
 * @param {(err: any) => void} reject
 * @returns {(handler: (e: Event) => void) => (e: Event) => void}
 */
function handlerFactory(reject) {
  return function tryHandler(handler) {
    return function wrappedHandler(event) {
      try {
        handler(event);
      } catch (err) {
        reject(err);
      }
    };
  };
}

// ------------------
// To-do database API
// ------------------

/**
 * @returns {Promise<IDBDatabase>}
 */
export async function getDB() {
  const request = window.indexedDB.open(TODO_DB_NAME, VERSION);

  return new Promise((resolve, reject) => {
    const tryHandler = handlerFactory(reject);

    request.onerror = (event) => {
      reject(new DBRequestError(event));
    };

    request.onsuccess = tryHandler((event) => {
      const { result } = v.parse(IDBRequestWithDBResultSchema, event.target);
      resolve(result);
    });

    request.onupgradeneeded = tryHandler((event) => {
      const { result: db } = v.parse(
        IDBRequestWithDBResultSchema,
        event.target,
      );

      db.createObjectStore(TODOS, {
        keyPath: "id",
        autoIncrement: true,
      });

      db.createObjectStore(TODO_TEMPLATES, {
        keyPath: "id",
        autoIncrement: true,
      });
    });
  });
}

/**
 * @param {IncomingToDo} todo
 * @returns {Promise<ToDo>}
 */
export async function saveToDo(todo) {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    const parsedTodo = v.parse(IncomingToDoSchema, todo);
    const tryHandler = handlerFactory(reject);
    const transaction = db.transaction([TODOS], "readwrite");

    const store = transaction.objectStore(TODOS);
    const request = store.add(parsedTodo);

    transaction.onerror = (event) => {
      reject(new DBTransactionError(event));
    };

    request.onsuccess = tryHandler((event) => {
      const { result: id } = v.parse(
        IDBRequestWithIDResultSchema,
        event.target,
      );
      resolve({ ...todo, id });
    });
  });
}

/**
 * @param {IncomingToDoTemplate} template
 * @returns {Promise<ToDoTemplate>}
 */
export async function saveToDoTemplate(template) {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    const parsedTemplate = v.parse(IncomingToDoTemplateSchema, template);
    const tryHandler = handlerFactory(reject);
    const transaction = db.transaction([TODO_TEMPLATES], "readwrite");

    const store = transaction.objectStore(TODO_TEMPLATES);
    const request = store.add(parsedTemplate);

    transaction.onerror = (event) => {
      reject(new DBTransactionError(event));
    };

    request.onsuccess = tryHandler((event) => {
      const { result: id } = v.parse(
        IDBRequestWithIDResultSchema,
        event.target,
      );
      resolve({ ...template, id });
      /**
       * @returns {Promise<Array<ToDoTemplate>>}
       */
    });
  });
}

/**
 * @param {number} key
 * @returns {Promise<void>}
 */
export async function deleteToDo(key) {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TODOS], "readwrite");

    transaction.onerror = (event) => {
      // TODO Make error class
      reject(new Error(`[TO_DO_TRANSACTION_ERROR] ${event}`));
    };

    const store = transaction.objectStore(TODOS);
    const request = store.delete(key);

    request.onsuccess = () => {
      resolve();
    };
  });
}

/**
 * @returns {Promise<Array<ToDo>>}
 */
export async function getAllToDos() {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    const tryHandler = handlerFactory(reject);
    const transaction = db.transaction([TODOS], "readonly");

    transaction.onerror = (event) => {
      reject(new DBTransactionError(event));
    };

    const store = transaction.objectStore(TODOS);
    const request = store.getAll();

    request.onsuccess = tryHandler((event) => {
      const { result } = v.parse(IDBRequestWithTodosArraySchema, event.target);
      resolve(result);
    });
  });
}

/**
 * @returns {Promise<Array<ToDoTemplate>>}
 */
export async function getAllToDoTemplates() {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    const tryHandler = handlerFactory(reject);
    const transaction = db.transaction([TODO_TEMPLATES], "readonly");

    transaction.onerror = (event) => {
      reject(new DBTransactionError(event));
    };

    const store = transaction.objectStore(TODO_TEMPLATES);
    const request = store.getAll();

    request.onsuccess = tryHandler((event) => {
      const { result } = v.parse(
        IDBRequestWithTodoTemplatesArraySchema,
        event.target,
      );
      resolve(result);
    });
  });
}

/**
 * @param {number} id
 * @returns {Promise<ToDo>}
 */
export async function getToDo(id) {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    const tryHandler = handlerFactory(reject);
    const transaction = db.transaction([TODOS], "readonly");

    const store = transaction.objectStore(TODOS);
    const request = store.get(id);

    transaction.onerror = (event) => {
      reject(new DBTransactionError(event));
    };

    request.onsuccess = tryHandler((event) => {
      const { result } = v.parse(IDBRequestWithTodoSchema, event.target);
      resolve(result);
    });
  });
}

/**
 * @param {IncomingTodoTemplateList} list
 * @returns {Promise<TodoTemplateList>}
 */
export async function saveTodoTemplateList(list) {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    const parsedList = v.parse(IncomingTodoTemplateListSchema, list);
    const tryHandler = handlerFactory(reject);
    const transaction = db.transaction([TODO_TEMPLATE_LISTS], "readwrite");

    const store = transaction.objectStore(TODO_TEMPLATE_LISTS);
    const request = store.add(parsedList);

    transaction.onerror = (event) => {
      reject(new DBTransactionError(event));
    };

    request.onsuccess = tryHandler((event) => {
      const { result: id } = v.parse(
        IDBRequestWithIDResultSchema,
        event.target,
      );
      resolve({ ...parsedList, id });
    });
  });
}

/**
 * @param {number} id
 * @returns {Promise<ToDoTemplate>}
 */
async function getTodoTemplate(id) {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    const tryHandler = handlerFactory(reject);
    const transaction = db.transaction([TODO_TEMPLATES], "readonly");

    const store = transaction.objectStore(TODO_TEMPLATES);
    const request = store.get(id);

    transaction.onerror = (event) => {
      reject(new DBTransactionError(event));
    };

    request.onsuccess = tryHandler((event) => {
      const { result } = v.parse(
        IDBRequestWithTodoTemplateSchema,
        event.target,
      );
      resolve(result);
    });
  });
}

/**
 * @returns {Promise<Array<TodoTemplateList>>}
 */
export async function getAllTodoTemplateLists() {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    const tryHandler = handlerFactory(reject);
    const transaction = db.transaction([TODO_TEMPLATE_LISTS], "readonly");

    transaction.onerror = (event) => {
      reject(new DBTransactionError(event));
    };

    const store = transaction.objectStore(TODO_TEMPLATE_LISTS);
    const request = store.getAll();

    request.onsuccess = tryHandler((event) => {
      const { result } = v.parse(
        IDBRequestWithTodoTemplateListsArraySchema,
        event.target,
      );
      resolve(result);
    });
  });
}

/**
 * @param {number} id
 * @returns {Promise<TodoTemplateList>}
 */
export async function getTodoTemplateList(id) {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    const tryHandler = handlerFactory(reject);
    const transaction = db.transaction([TODO_TEMPLATE_LISTS], "readonly");

    const store = transaction.objectStore(TODO_TEMPLATE_LISTS);
    const request = store.get(id);

    transaction.onerror = (event) => {
      reject(new DBTransactionError(event));
    };

    request.onsuccess = tryHandler((event) => {
      const { result } = v.parse(
        IDBRequestWithTodoTemplateListSchema,
        event.target,
      );
      resolve(result);
    });
  });
}

/**
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteTodoTemplateList(id) {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TODO_TEMPLATE_LISTS], "readwrite");

    transaction.onerror = (event) => {
      reject(new DBTransactionError(event));
    };

    const store = transaction.objectStore(TODO_TEMPLATE_LISTS);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };
  });
}

/**
 * @param {number} key
 * @returns {Promise<Array<ToDoTemplate>>}
 */
export async function getTemplateListTodos(key) {
  const list = await getTodoTemplateList(key);
  return Promise.all(list.templateIds.map((id) => getTodoTemplate(id)));
}
