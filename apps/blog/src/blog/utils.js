/** @typedef {import("./blog.js").BlogPathParams} BlogPathParams */

/**
 * @param {BlogPathParams} blogPathParams - Date params with entry slug.
 */
export function getBlogPath(blogPathParams) {
  const { year, month, day, slug } = blogPathParams;
  return `/years/${year}/months/${month}/days/${day}/entries/${slug}`;
}
