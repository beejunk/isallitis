import { describe, test } from "node:test";
import assert from "node:assert";
import { getEntityById } from "../../../../src/models/queries/entity.js";
import {
  BLOG_DAY,
  BLOG_ENTRY,
  BLOG_MONTH,
  BLOG_YEAR,
} from "../../../../src/models/schemas.js";
import { mockBlog } from "../../../fixtures/mock-blog.js";

describe("getEntityByIdId()", () => {
  test("should return the expected entities", () => {
    [BLOG_ENTRY, BLOG_DAY, BLOG_MONTH, BLOG_YEAR].forEach((type) => {
      const entity = getEntityById(mockBlog, { type, id: 1 });

      assert.equal(entity?.type, type);
    });
  });
});
