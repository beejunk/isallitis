import { html } from "htm/preact";
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { BlogEntry } from "../../../../src/blog/components/blog-entry.js";
import { getScreen } from "../../../test-utils.js";
import { renderToString } from "preact-render-to-string";
import { blogSignal } from "../../../../src/blog/components/signals.js";
import { mockBlog } from "../../../fixtures/mock-blog.js";

describe("<BlogEntry>", () => {
  blogSignal.value = mockBlog;
  const title = "Entry Title";
  const Page = () => html`
    <${BlogEntry} title=${title}>
      <p>This is a blog entry</p>
    </${BlogEntry}>
  `;
  const screen = getScreen(renderToString(html`<${Page} />`));

  test("should display entry title", () => {
    assert.ok(screen.getByText(/entry title/i));
  });

  test("should display site title", () => {
    assert.ok(screen.getByText(/test blog/i));
  });
});
