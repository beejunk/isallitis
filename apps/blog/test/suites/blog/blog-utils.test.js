import { renderToString } from "preact-render-to-string";
import { html } from "htm/preact";
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { mockBlog } from "../../fixtures/mock-blog.js";
import { reduceBlogToEntryData } from "../../../src/blog/blog-utils.js";

describe("reduceToEntryData()", () => {
  test("should create an array with an element for each blog entry", () => {
    const entryData = reduceBlogToEntryData(mockBlog);

    assert.equal(entryData.length, 2);
  });

  test("should create entries in the expected data format", () => {
    const [actual] = reduceBlogToEntryData(mockBlog);

    assert.equal(actual.year, 2024);
    assert.equal(actual.month, 8);
    assert.equal(actual.day, 18);
    assert.equal(actual.hour, 18);
    assert.equal(actual.minute, 20);
    assert.equal(actual.slug, "a-test-is-all-it-is");
    assert.equal(actual.title, "A Test Is All It Is");
    assert.equal(
      renderToString(html`<${actual.body} />`),
      "<p>A test is all it is</p>",
    );
  });
});
