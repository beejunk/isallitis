import { html } from "htm/preact";
import { Item } from "./item.js";

/** @typedef {import("../../views/views.js").RSSView} RSSView */

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
 * @param {RSSView} props
 */
export function Channel(props) {
  const { blogDescription, blogLink, blogTitle, items } = props;

  return html`
    <channel>
      <${Title}>${blogTitle}</${Title}>
      <${Link}>${blogLink}</${Link}>
      <${Description}>${blogDescription}</${Description}>
      ${items.map((item) => html`<${Item} ...${item} />`)}
    </channel>
  `;
}
