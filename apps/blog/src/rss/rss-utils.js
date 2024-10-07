import { renderToString } from "preact-render-to-string";
import { html } from "htm/preact";

import { getBlogEntryRoute } from "../routes/routes.js";

/** @typedef {import("../blog/blog-utils.js").EntryData} EntryData */

/**
 * @param {string} hostname
 */
export function toRSSItem(hostname) {
  /**
   * @param {EntryData} entry
   */
  return function withHostname(entry) {
    const { year, month, day, slug, title, body } = entry;
    const path = getBlogEntryRoute({ year, month, day, slug });

    return {
      title,
      description: renderToString(html`<${body}></${body}>`),
      link: new URL(path, hostname),
    };
  };
}
