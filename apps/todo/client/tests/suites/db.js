import { ValiError } from "valibot";
import * as db from "../../scripts/db.js";
import { assert, expect } from "chai";

describe("db.js", () => {
  describe("ToDo", () => {
    const description = "New to-do";

    async function createTodo() {
      return db.saveToDo(db.createTodo({ description }));
    }

    it("should create a new to-do object", async () => {
      const newTodo = await createTodo();

      await db.deleteToDo(newTodo.id);

      expect(newTodo.description).to.equal(description);
    });

    it("should read a to-do object by its id", async () => {
      const { id } = await createTodo();

      const newTodo = await db.getToDo(id);

      await db.deleteToDo(id);

      expect(newTodo.description).to.equal(description);
    });

    it("should delete a to-do object by its id", async () => {
      const { id } = await createTodo();

      await db.deleteToDo(id);

      let err;

      try {
        await db.getToDo(id);
      } catch (e) {
        err = e;
      }

      assert.instanceOf(err, ValiError);
      expect(err.message).to.match(/received undefined/i);
    });
  });
});
