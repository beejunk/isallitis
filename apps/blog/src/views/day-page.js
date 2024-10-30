import { getEntryListPageView } from "./entry-list-page.js";

/** @typedef {import("../models/schemas.js").Blog} Blog*/

/**
 * @typedef {Object} DayPageViewParams
 * @prop {number} day
 * @prop {number} month
 * @prop {number} year
 * @prop {string} [fingerprint]
 */

/**
 * @param {Blog} blog
 * @param {DayPageViewParams} params
 */
export function getDayPageView(blog, params) {
  const { year, month, day } = params;
  const pageHeading = `Entries for ${year}-${month}-${day}`;

  return getEntryListPageView(blog, {
    ...params,
    pageHeading,
    year,
  });
}
