/** @typedef {import("./blog.js").BlogPathParams} BlogPathParams */

/**
 * @param {BlogPathParams} blogPathParams - Date params with entry slug.
 */
export function getBlogPath(blogPathParams) {
  const { year, month, day, slug } = blogPathParams;
  return `/years/${year}/months/${month}/days/${day}/entries/${slug}`;
}

const re = new RegExp(/\n\s*|\s\s+/, "g");

/**
 * @param {TemplateStringsArray} strings
 * @param {Array<string | number>} expressions
 * @return {string}
 */
export function html(strings, ...expressions) {
  return strings
    .map((str, idx) => `${str.replaceAll(re, " ")}${expressions[idx] ?? ""}`)
    .join("")
    .trim();
}
