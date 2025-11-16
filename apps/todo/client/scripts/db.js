import * as v from "valibot";

// ---------
// Meta data
// ---------

const TODO_DB_NAME = "todo_db";

const VERSION = 1;

// --------------
// Object stores.
// --------------

export const TODOS = "todos";
export const TODO_TEMPLATES = "todo_templates";
export const TODO_TEMPLATE_LISTS = "todo_template_lists";

// -------
// Schemas
// -------

const IDBRequestWithDBResultSchema = v.object({
  result: v.instance(IDBDatabase),
});

const IDBRequestWithIDResultSchema = v.object({ result: v.number() });

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
function withReject(reject) {
  return function withHandler(handler) {
    return function wrappedHandler(event) {
      try {
        handler(event);
      } catch (err) {
        reject(err);
      }
    };
  };
}

/**
 * @param {import("valibot").GenericSchema} schema
 */
function createIDBResultSchema(schema) {
  return v.object({
    result: schema,
  });
}

/**
 * @param {import("valibot").GenericSchema} schema
 */
function createIDBArrayResultScheme(schema) {
  return v.object({
    result: v.array(schema),
  });
}

// ------------
// Database API
// ------------

/**
 * @returns {Promise<IDBDatabase>}
 */
export async function getDB() {
  const request = window.indexedDB.open(TODO_DB_NAME, VERSION);

  return new Promise((resolve, reject) => {
    const tryHandler = withReject(reject);

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

      db.createObjectStore(TODO_TEMPLATE_LISTS, {
        keyPath: "id",
        autoIncrement: true,
      });
    });
  });
}

/**
 * @template Model
 *
 * @param {string} storeId
 * @param {Model} model
 * @param {import("valibot").GenericSchema} schema
 */
export async function saveModel(storeId, model, schema) {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    const parsedModel = v.parse(schema, model);
    const tryHandler = withReject(reject);
    const transaction = db.transaction([storeId], "readwrite");

    const store = transaction.objectStore(storeId);
    const request = store.add(parsedModel);

    transaction.onerror = (event) => {
      reject(new DBTransactionError(event));
    };

    request.onsuccess = tryHandler((event) => {
      if (typeof parsedModel !== "object") {
        // TODO Better error message
        throw new Error("Cannot store non-object models.");
      } else {
        const { result: id } = v.parse(
          IDBRequestWithIDResultSchema,
          event.target,
        );
        resolve({ ...parsedModel, id });
      }
    });
  });
}

/**
 * @param {string} storeId
 * @param {number} id
 * @param {import("valibot").GenericSchema} schema
 */
export async function readModel(storeId, id, schema) {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    const tryHandler = withReject(reject);
    const transaction = db.transaction([storeId], "readonly");

    const store = transaction.objectStore(storeId);
    const request = store.get(id);

    transaction.onerror = (event) => {
      reject(new DBTransactionError(event));
    };

    request.onsuccess = tryHandler((event) => {
      const { result } = v.parse(createIDBResultSchema(schema), event.target);
      resolve(result);
    });
  });
}

/**
 * @param {string} storeId
 * @param {import("valibot").GenericSchema} schema
 */
export async function readAllModels(storeId, schema) {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    const tryHandler = withReject(reject);
    const transaction = db.transaction([storeId], "readonly");

    transaction.onerror = (event) => {
      reject(new DBTransactionError(event));
    };

    const store = transaction.objectStore(storeId);
    const request = store.getAll();

    request.onsuccess = tryHandler((event) => {
      const { result } = v.parse(
        createIDBArrayResultScheme(schema),
        event.target,
      );
      resolve(result);
    });
  });
}

/**
 * @param {string} storeId
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteModel(storeId, id) {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeId], "readwrite");

    transaction.onerror = (event) => {
      // TODO Make error class
      reject(new Error(`[TO_DO_TRANSACTION_ERROR] ${event}`));
    };

    const store = transaction.objectStore(storeId);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };
  });
}
