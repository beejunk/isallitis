import { html } from "htm/preact";
import { BlogEntry } from "../../src/blog/pages/blog-entry.js";
import { renderStatic } from "../test-utils.js";

/**
 * @param {import("../../src/views/views.js").EntryPageView} entry
 */
export function blogEntryFixture(entry) {
  const Page = () => html`<${BlogEntry} ...${entry} />`;

  return renderStatic(html`<${Page} />`);
}
