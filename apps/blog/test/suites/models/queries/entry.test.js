import { describe, test } from "node:test";
import assert from "node:assert";
import { BLOG_ENTRY } from "../../../../src/models/schemas.js";
import { mockBlog } from "../../../fixtures/mock-blog.js";
import { getEntry } from "../../../../src/models/queries/entry.js";

describe("getEntry()", () => {
  test("should support querying by ID", () => {
    const entity = getEntry(mockBlog, { id: 1 });

    assert.equal(entity.type, BLOG_ENTRY);
  });

  test("should support querying by slug", () => {
    const entity = getEntry(mockBlog, { slug: "test-entry-1" });

    assert.equal(entity.slug, "test-entry-1");
  });

  test("should throw if both a `slug` and `id` is provided", () => {
    assert.throws(() => {
      getEntry(mockBlog, { id: 1, slug: "test-slug" });
    });
  });
});
