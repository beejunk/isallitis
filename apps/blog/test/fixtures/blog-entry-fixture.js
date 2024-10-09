import { blogSignal } from "../../src/blog/signals/signals.js";
import { mockBlog } from "./mock-blog.js";
import { html } from "htm/preact";
import { BlogEntry } from "../../src/blog/pages/blog-entry.js";
import { renderStatic } from "../test-utils.js";

/**
 * @param {import("../../src/blog/blog-utils.js").EntryData} entry
 */
export function blogEntryFixture(entry) {
  blogSignal.value = mockBlog;

  const Page = () => html`<${BlogEntry} entry=${entry} />`;

  return renderStatic(html`<${Page} />`);
}
