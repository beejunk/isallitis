export const SEP = "/";

/** @typedef {import("./blog.js").BlogPathParams} BlogParams */

/**
 * @param {BlogParams} blogParams - Date params with entry slug.
 */
export function getBlogPath(...blogParams) {
  return blogParams.join(SEP);
}
