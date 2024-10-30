import { getEntryListPageView } from "./entry-list-page.js";

/** @typedef {import("../models/schemas.js").Blog} Blog*/

/**
 * @typedef {Object} YearPageViewParams
 * @prop {number} year
 * @prop {string} [fingerprint]
 */

/**
 * @param {Blog} blog
 * @param {YearPageViewParams} params
 */
export function getYearPageView(blog, params) {
  const { year } = params;
  const pageHeading = `Entries for ${year}`;

  return getEntryListPageView(blog, {
    ...params,
    pageHeading,
    year,
  });
}
