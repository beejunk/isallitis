/** @typedef {import("../blog/blog.js").BlogPathParams} BlogPathParams */

const HTML_WHITESPACE_RE = new RegExp(/\n\s*|\s\s+/, "g");

/**
 * @param {BlogPathParams} blogPathParams - Date params with entry slug.
 */
export function getBlogPath(blogPathParams) {
  const { year, month, day, slug } = blogPathParams;
  return `/years/${year}/months/${month}/days/${day}/entries/${slug}`;
}

/** @typedef {string | number} HTMLChildElement */

/** @typedef {Array<HTMLChildElement>} HTMLChildArray */

/** @typedef {HTMLChildElement | HTMLChildArray} HTMLChild */

/** @typedef {Array<HTMLChild>} HTMLChildren */

/**
 * @param {HTMLChildren} children
 */
function createSegmentMapper(children) {
  /**
   * @param text {string}
   * @param idx {number}
   */
  function segmentToString(text, idx) {
    const child = children[idx] ?? "";
    const childStr = Array.isArray(child) ? child.join("") : child;

    return `${text}${childStr}`;
  }

  return segmentToString;
}

/**
 * @param {TemplateStringsArray} strings
 * @param {HTMLChildren} children
 * @return {string}
 */
export function html(strings, ...children) {
  const segmentToString = createSegmentMapper(children);
  return strings.map(segmentToString).join("");
}

/**
 * @param {string} html
 * @return {string}
 */
export function condenseWhitespace(html) {
  return html.trim().replaceAll(HTML_WHITESPACE_RE, " ");
}
