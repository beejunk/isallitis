/** @typedef {import("../models/schemas.js").Blog} Blog*/

/**
 * @typedef {Object} BasePageView
 * @prop {string} blogTitle
 * @prop {string} blogDescription
 * @prop {string} pageHeading
 * @prop {string} pageTitle
 * @prop {string} [fingerprint]
 */

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {string} params.pageHeading
 * @param {string} [params.fingerprint]
 * @return {BasePageView}
 */
export function getBasePageView(blog, params) {
  const { fingerprint, pageHeading } = params;
  const pageTitle = `${blog.title} - ${pageHeading}`;

  return {
    blogTitle: blog.title,
    blogDescription: blog.description,
    pageHeading,
    pageTitle,
    fingerprint,
  };
}
