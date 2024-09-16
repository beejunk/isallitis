import { channel } from "./templates/channel.js";
import { getBlogPath } from "../blog/html-utils.js";

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
    const path = getBlogPath({ year, month, day, slug });

    return {
      title,
      description: body,
      link: new URL(path, hostname),
    };
  };
}
