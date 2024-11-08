import { describe, test } from "node:test";
import assert from "node:assert";
import { getEntityById } from "../../../../src/models/queries/entity.js";
import { BLOG_ENTRY } from "../../../../src/models/schemas.js";
import { mockBlog } from "../../../fixtures/mock-blog.js";

describe("getEntityByIdId()", () => {
  test("should return the expected entity type", () => {
    const entity = getEntityById(mockBlog, { type: BLOG_ENTRY, id: 1 });

    assert.equal(entity?.type, BLOG_ENTRY);
  });
});
