import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { blogEntry } from "../../../../src/blog/templates/blog-entry.js";
import { getScreen } from "../../../test-utils.js";
import { html } from "../../../../src/blog/blog-utils.js";

describe("blogEntry()", () => {
  const title = "Entry Title";
  const body = html`<p>This is a blog entry</p>`;
  const screen = getScreen(blogEntry({ body, title }));

  test("should display entry title", () => {
    assert.ok(screen.getByText(/entry title/i));
  });

  test("should display site title", () => {
    assert.ok(screen.getByText(/a blog is all it is/i));
  });
});
