import { describe, test } from "node:test";
import assert from "node:assert";
import { BLOG_YEAR } from "../../../../src/models/schemas.js";
import { mockBlog } from "../../../fixtures/mock-blog.js";
import { getYear } from "../../../../src/models/queries/year.js";

describe("getYear()", () => {
  test("should support querying by ID", () => {
    const entity = getYear(mockBlog, { id: 1 });

    assert.equal(entity.type, BLOG_YEAR);
  });

  test("should throw if there are any other params along with an ID", () => {
    assert.throws(() => {
      getYear(mockBlog, { id: 1, year: 2024 });
    });
  });

  test("should support querying using the `year` param", () => {
    const entity = getYear(mockBlog, { year: 2024 });

    assert.equal(entity.id, 1);
  });
});
