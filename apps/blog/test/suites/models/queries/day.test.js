import { describe, test } from "node:test";
import assert from "node:assert";
import { BLOG_DAY } from "../../../../src/models/schemas.js";
import { mockBlog } from "../../../fixtures/mock-blog.js";
import { getDay } from "../../../../src/models/queries/day.js";

describe("getDay()", () => {
  test("should support querying by ID", () => {
    const entity = getDay(mockBlog, { id: 1 });

    assert.equal(entity.type, BLOG_DAY);
  });

  test("should throw if there are any other params along with an ID", () => {
    assert.throws(() => {
      getDay(mockBlog, { id: 1, year: 2024 });
    });
  });

  test("should support querying using the `year`, `month` and `day` params", () => {
    const entity = getDay(mockBlog, { year: 2024, month: 10, day: 12 });

    assert.equal(entity.id, 1);
  });

  test("should throw if not all necessary date params are set", () => {
    [
      { year: 2024 },
      { year: 2024, month: 10 },
      { year: 2024, day: 12 },
      { month: 10 },
      { month: 10, day: 12 },
    ].forEach((params) => {
      assert.throws(() => {
        getDay(mockBlog, params);
      });
    });
  });
});
