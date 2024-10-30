import { getEntryListPageView } from "./entry-list-page.js";

/** @typedef {import("../models/schemas.js").Blog} Blog*/
/** @typedef {import("./entry-list-page.js").EntryListPageViewParams} EntryListPageViewParams */

const HEADING = "Recent Entries";

const MAX = 10;

/**
 * @param {Blog} blog
 * @param {Omit<EntryListPageViewParams, "pageHeading" | "order">} [params]
 */
export function getRecentEntriesPageView(blog, params = {}) {
  return getEntryListPageView(blog, {
    ...params,
    max: MAX,
    pageHeading: HEADING,
    sort: "desc",
  });
}
