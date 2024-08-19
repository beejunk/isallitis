import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { catalogue } from "../../blog/catalogue.js";
import { Blog } from "../../blog/blog.js";

/** @typedef {[number, number, number, number, number]} DateArgs */

const blog = Blog(catalogue);

describe("getBlogEntry()", () => {
  test("returns the blog entry with the expected hour", () => {
    const entry = blog.getEntry(2024, 8, 18, 11, 52);

    assert.equal(entry?.hour, 11);
  });
});
