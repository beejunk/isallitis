import { renderToString } from "preact-render-to-string";
import { html } from "htm/preact";
import { channel } from "./templates/channel.js";

import { getBlogEntryRoute } from "../routes/routes.js";

/** @typedef {import("./templates/channel.js").RSSChannelProps} RSSChannelProps */
/** @typedef {import("./templates/item.js").RSSItemProps} RSSItemProps */
/** @typedef {import("../blog/blog-utils.js").EntryData} EntryData

/**
 * @param {RSSChannelProps} props
 * @returns {string}
 */
export function rss(props) {
  return `<rss version="2.0">${channel(props)}</rss>`;
}

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
