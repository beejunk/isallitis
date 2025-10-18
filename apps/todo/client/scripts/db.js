const NAME = "todo_db";

const VERSION = 1;

const TODOS = "todos";

// ------
// Models
// ------

/**
 * @typedef {("ACTIVE" | "COMPLETE")} ToDoState
 */

/**
 * @typedef {Object} ToDo
 * @prop {number} id
 * @prop {string} description
 * @prop {ToDoState} state
 * @prop {"todo"} type
 */

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

class DBAssertionError extends Error {
  /**
   * @param {string} className
   */
  constructor(className) {
    super(`Event target is not an instance of ${className}.`);
  }
}

class DBTransactionError extends Error {
  /**
   * @param {Event} event
   */
  constructor(event) {
    super(event.toString());
  }
}

class DBRequestError extends DBTransactionError {}

// ---------------
// Type assertions
// ---------------

/**
 * @param {unknown} target
 * @returns {asserts target is IDBRequest}
 */
function assertIDBRequest(target) {
  if (!(target instanceof IDBRequest)) {
    throw new DBAssertionError("IDBRequest");
  }
}

/**
 * @param {unknown }target
 * @returns {asserts target is IDBRequest<IDBDatabase>}
 */
function assertIDBRequestWithDBResult(target) {
  assertIDBRequest(target);

  if (!(target.result instanceof IDBDatabase)) {
    throw new DBAssertionError("IDBDatabase");
  }
}

/**
 * @param {unknown} target
 * @returns {asserts target is IDBRequest<number>}
 */
function assertIDBRequestWithIDResult(target) {
  assertIDBRequest(target);

  if (!(target instanceof IDBRequest && typeof target.result === "number")) {
    throw new DBAssertionError("number");
  }
}

/**
 * @param {unknown} target
 * @returns {asserts target is IDBRequest<Array<ToDo>>}
 */
function assertIDBRequestWithToDoArrayResult(target) {
  assertIDBRequest(target);

  if (!(target instanceof IDBRequest && Array.isArray(target.result))) {
    throw new DBAssertionError("Array<ToDo>");
  }
}

/**
 * @param {unknown} target
 * @returns {asserts target is IDBRequest<ToDo>}
 */
function assertIDBRequestWithToDoResult(target) {
  assertIDBRequest(target);

  if (!(target instanceof IDBRequest && target.result.type === "todo")) {
    throw new DBAssertionError("ToDo");
  }
}

// -----
// Utils
// -----

/**
 * Creates a wrapper for an IndexedDB event handler that abstracts away the boilerplate
 * of needing to catch and reject errors. Particular useful due to the need to run
 * assertions against IndexedDB events in order to read event values in a type safe
 * manner.
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
      assertIDBRequestWithDBResult(event.target);
      resolve(event.target.result);
    });

    request.onupgradeneeded = tryHandler((event) => {
      assertIDBRequestWithDBResult(event.currentTarget);
      const db = event.currentTarget.result;

      db.createObjectStore(TODOS, {
        keyPath: "id",
        autoIncrement: true,
      });
    });
  });
}

/**
 * @param {Omit<ToDo, "id">} todo
 * @returns {Promise<ToDo>}
 */
export async function saveToDo(todo) {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    const tryHandler = handlerFactory(reject);
    const transaction = db.transaction([TODOS], "readwrite");

    const store = transaction.objectStore(TODOS);
    const request = store.add(todo);

    transaction.onerror = (event) => {
      reject(new DBTransactionError(event));
    };

    request.onsuccess = tryHandler((event) => {
      assertIDBRequestWithIDResult(event.target);
      resolve({ ...todo, id: event.target.result });
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
      assertIDBRequestWithToDoArrayResult(event.target);
      resolve(event.target.result);
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
      assertIDBRequestWithToDoResult(event.target);
      resolve(event.target.result);
    });
  });
}
