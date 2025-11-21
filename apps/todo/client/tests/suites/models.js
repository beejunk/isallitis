import { ValiError } from "valibot";
import { assert, expect } from "chai";
import * as models from "../../scripts/models.js";

describe("models.js", () => {
  describe("Todo", () => {
    const description = "New to-do";

    async function createTestTodo() {
      return models.createTodo({ description });
    }

    it("should create a new to-do object", async () => {
      const newTodo = await createTestTodo();

      await models.deleteTodo(newTodo.id);

      expect(newTodo.description).to.equal(description);
    });

    it("should read a to-do object by its id", async () => {
      const { id } = await createTestTodo();

      const newTodo = await models.getTodo(id);

      await models.deleteTodo(id);

      expect(newTodo.description).to.equal(description);
    });

    it("should delete a to-do object by its id", async () => {
      const { id } = await createTestTodo();

      await models.deleteTodo(id);

      let err;

      try {
        await models.getTodo(id);
      } catch (e) {
        err = e;
      }

      assert.instanceOf(err, ValiError);
      expect(err.message).to.match(/received undefined/i);
    });
  });

  describe("TodoTemplate and TodoTemplateList", () => {
    const templateName = "Test Template";
    const templateDescription = "A test template description";

    async function createTestTemplateList() {
      return models.createTodoTemplateList({
        name: templateName,
        description: templateDescription,
      });
    }

    /**
     * @param {number} templateListId
     */
    async function createTestTemplate(templateListId) {
      return models.createTodoTemplate({
        description: templateDescription,
        templateListId,
      });
    }

    it("should create a new to-do template object", async () => {
      const templateList = await createTestTemplateList();
      const newTemplate = await createTestTemplate(templateList.id);

      await models.deleteTodoTemplate(newTemplate.id);
      await models.deleteTodoTemplateList(templateList.id);

      expect(newTemplate.description).to.equal(templateDescription);
      expect(newTemplate.templateListId).to.equal(templateList.id);
      expect(newTemplate.type).to.equal("todo-template");
    });

    it("should reject if the target template-list does not exist", async () => {
      let err;

      try {
        await createTestTemplate(99999999);
      } catch (e) {
        err = e;
      }

      assert.instanceOf(err, ValiError);
      expect(err.message).to.match(/received undefined/i);
    });

    it("should read a to-do template object by its id", async () => {
      const templateList = await createTestTemplateList();
      const { id } = await createTestTemplate(templateList.id);

      const newTemplate = await models.getTodoTemplate(id);

      await models.deleteTodoTemplate(id);
      await models.deleteTodoTemplateList(templateList.id);

      expect(newTemplate.description).to.equal(templateDescription);
      expect(newTemplate.templateListId).to.equal(templateList.id);
    });

    it("should get all to-do templates", async () => {
      const templateList = await createTestTemplateList();

      const [templateA, templateB] = await Promise.all([
        createTestTemplate(templateList.id),
        createTestTemplate(templateList.id),
      ]);

      const templates = await models.getAllTodoTemplates();

      await Promise.all([
        models.deleteTodoTemplate(templateA.id),
        models.deleteTodoTemplate(templateB.id),
      ]);
      await models.deleteTodoTemplateList(templateList.id);

      expect(templates.length).to.equal(2);
      expect(templates.some(({ id }) => id === templateA.id)).to.equal(true);
      expect(templates.some(({ id }) => id === templateB.id)).to.equal(true);
    });

    it("should delete a to-do template by its id", async () => {
      const templateList = await createTestTemplateList();
      const { id } = await createTestTemplate(templateList.id);

      await models.deleteTodoTemplate(id);
      await models.deleteTodoTemplateList(templateList.id);

      let err;

      try {
        await models.getTodoTemplate(id);
      } catch (e) {
        err = e;
      }

      assert.instanceOf(err, ValiError);
      expect(err.message).to.match(/received undefined/i);
    });

    it("should get all to-do templates for the specified template list.", async () => {
      const templateList = await createTestTemplateList();

      const [templateA, templateB] = await Promise.all([
        createTestTemplate(templateList.id),
        createTestTemplate(templateList.id),
      ]);

      const templates = await models.getTemplateListTodos(templateList.id);

      await Promise.all([
        models.deleteTodoTemplate(templateA.id),
        models.deleteTodoTemplate(templateB.id),
      ]);
      await models.deleteTodoTemplateList(templateList.id);

      expect(templates.length).to.equal(2);
      expect(templates.some(({ id }) => id === templateA.id)).to.equal(true);
      expect(templates.some(({ id }) => id === templateB.id)).to.equal(true);
    });
  });
});
