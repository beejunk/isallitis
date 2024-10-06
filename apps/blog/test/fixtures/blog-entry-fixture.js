import { blogSignal } from "../../src/blog/signals/signals.js";
import { mockBlog } from "./mock-blog.js";
import { html } from "htm/preact";
import { BlogEntry } from "../../src/blog/pages/blog-entry.js";
import { getScreen } from "../test-utils.js";
import { renderToString } from "preact-render-to-string";

/**
 * @param {import("../../src/blog/blog-utils.js").EntryData} entry
 */
export function blogEntryFixture(entry) {
  blogSignal.value = mockBlog;

  const Page = () => html`<${BlogEntry} entry=${entry} />`;

  return getScreen(renderToString(html`<${Page} />`));
}
