import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { blog } from "../../blog/blog.js";
import { createHTMLMap } from "../../blog/html-map.js";
import { getBlogPath } from "../../blog/utils.js";

const htmlMap = createHTMLMap(blog);

describe("createHTMLMap", () => {
  test("it should return an entry for the provided path", () => {
    const path = getBlogPath(2024, 8, 18, "a-blog-is-all-it-is");
    const entry = htmlMap.get(path);

    assert.ok(entry);
  });
});
