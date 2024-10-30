import { getEntryListPageView } from "./entry-list-page.js";

/** @typedef {import("../models/schemas.js").Blog} Blog*/

/**
 * @typedef {Object} MonthPageViewParams
 * @prop {number} month
 * @prop {number} year
 * @prop {string} [fingerprint]
 */

/**
 * @param {Blog} blog
 * @param {MonthPageViewParams} params
 */
export function getMonthPageView(blog, params) {
  const { year, month } = params;
  const pageHeading = `Entries for ${year}-${month}`;

  return getEntryListPageView(blog, {
    ...params,
    pageHeading,
    year,
  });
}
