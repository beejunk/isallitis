import { describe, test } from "node:test";
import assert from "node:assert";
import { BLOG_MONTH } from "../../../../src/models/schemas.js";
import { mockBlog } from "../../../fixtures/mock-blog.js";
import { getMonth } from "../../../../src/models/queries/month.js";

describe("getMonth()", () => {
  test("should support querying by ID", () => {
    const entity = getMonth(mockBlog, { id: 1 });

    assert.equal(entity.type, BLOG_MONTH);
  });

  test("should throw if there are any other params along with an ID", () => {
    assert.throws(() => {
      getMonth(mockBlog, { id: 1, year: 2024 });
    });
  });

  test("should support querying using the `year` and `month` params", () => {
    const entity = getMonth(mockBlog, { year: 2024, month: 10 });

    assert.equal(entity.id, 1);
  });

  test("should throw if not all necessary date params are set", () => {
    assert.throws(() => {
      getMonth(mockBlog, { year: 2024 });
    });

    assert.throws(() => {
      getMonth(mockBlog, { month: 8 });
    });
  });
});
