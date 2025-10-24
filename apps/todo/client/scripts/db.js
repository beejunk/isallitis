import * as v from "valibot";

const NAME = "todo_db";

const VERSION = 1;

const TODOS = "todos";

// -------
// Schemas
// -------

const ToDoStateSchema = v.union([v.literal("ACTIVE"), v.literal("COMPLETE")]);

/**
 * @typedef {import("valibot").InferOutput<typeof ToDoStateSchema>} ToDoState
 */

const ToDoSchema = v.object({
  id: v.number(),
  description: v.string(),
  state: ToDoStateSchema,
  type: v.literal("todo"),
});

/**
 * @typedef {import("valibot").InferOutput<typeof ToDoSchema>} ToDo
 */

const IncomingToDoSchema = v.omit(ToDoSchema, ["id"]);

/**
 * @typedef {import("valibot").InferOutput<typeof IncomingToDoSchema>} IncomingToDo
 */

const IDBRequestWithTodosArraySchema = v.object({
  result: v.array(ToDoSchema),
});

const IDBRequestWithTodoSchema = v.object({
  result: ToDoSchema,
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
  const request = window.indexedDB.open(NAME, VERSION);

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
