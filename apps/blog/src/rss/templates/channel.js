import { html } from "htm/preact";
import { Item } from "./item.js";

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

/**
 * @typedef {Object} RSSChannelProps
 * @prop {string} title
 * @prop {URL} link
 * @prop {string} description
 * @prop {Array<RSSItemProps>} [items = []]
 */

/**
 * @param {RSSChannelProps} props
 */
export function Channel(props) {
  const items = props.items ?? [];

  return html`
    <channel>
      <${Title}>${props.title}</${Title}>
      <${Link}>${props.link}</${Link}>
      <${Description}>${props.description}</${Description}>
      ${items.map((item) => html`<${Item} ...${item} />`)}
    </channel>
  `;
}
