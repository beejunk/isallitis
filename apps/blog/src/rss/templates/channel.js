import { item } from "./item.js";

/** @typedef {import("./item.js").RSSItemProps} RSSItemProps */

/**
 * @param {string} feedTitle
 * @returns {string}
 */
function title(feedTitle) {
  return `<title>${feedTitle}</title>`;
}

/**
 * @param {URL} feedURL
 * @returns {string}
 */
function link(feedURL) {
  return `<link>${feedURL}</link>`;
}

/**
 * @param {string} feedDescription
 * @returns {string}
 */
function description(feedDescription) {
  return `<description>${feedDescription}</description>`;
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
 * @returns {string}
 */
export function channel(props) {
  const items = props.items ?? [];
  const itemStr = items.map(item).join("");

  return `<channel>${title(props.title)}${link(props.link)}${description(props.description)}${itemStr}</channel>`;
}
