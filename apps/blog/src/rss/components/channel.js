import { html } from "htm/preact";
import { Item } from "./item.js";
import { blogData, blogSignal } from "../../blog/signals/signals.js";
import { toRSSItem } from "../rss-utils.js";
import { HOST_NAME } from "../../constants.js";

/** @typedef {import("./item.js").RSSItemProps} RSSItemProps */

/**
 * @param {Object} props
 * @param {string} [props.children]
 */
function Title({ children }) {
  return html`<title>${children}</title>`;
}

/**
 * @param {Object} props
 * @param {URL} props.children
 */
function Link({ children }) {
  return html`<link>${children.toString()}</link>`;
}

/**
 * @param {Object} props
 * @param {string} [props.children]
 */
function Description({ children }) {
  return html`<description>${children}</description>`;
}

export function Channel() {
  const items = blogData.value.sortedEntries.map(toRSSItem(HOST_NAME));
  const link = new URL(HOST_NAME);
  const { title, description } = blogSignal.value;

  return html`
    <channel>
      <${Title}>${title}</${Title}>
      <${Link}>${link}</${Link}>
      <${Description}>${description}</${Description}>
      ${items.map((item) => html`<${Item} ...${item} />`)}
    </channel>
  `;
}
