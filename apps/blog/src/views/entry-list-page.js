import { getBasePageView } from "./base-page.js";

/** @typedef {import("../models/schemas.js").Blog} Blog*/
/** @typedef {import("../models/schemas.js").BlogEntry} BlogEntry */
/** @typedef {import("./base-page.js").BasePageView} BasePageView */

/**
 * @typedef {Object} EntrySummaryView
 * @prop {number} year
 * @prop {number} month
 * @prop {number} day
 * @prop {string} slug
 * @prop {string} title
 */

/**
 * @typedef {Object} EntryListView
 * @prop {Array<EntrySummaryView>} entries
 */

/**
 * Abstract view that shows a page title and a list of entries.
 *
 * @typedef{BasePageView & EntryListView} EntryListPageView
 */

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {number} [params.day]
 * @param {number} [params.month]
 * @param {number} [params.year]
 * @returns {function(BlogEntry): boolean}
 */
function getEntryFilterFromDateParams(blog, params) {
  const { day, month, year } = params;

  if (day && month && year) {
    return (entryEntity) => {
      const entryDate = new Date(entryEntity.createdAt);
      const entryYear = entryDate.getFullYear();
      const entryMonth = entryDate.getMonth() + 1;
      const entryDay = entryDate.getDate();

      return entryYear === year && entryMonth === month && entryDay === day;
    };
  }

  if (month && year) {
    return (entryEntity) => {
      const entryDate = new Date(entryEntity.createdAt);
      const entryYear = entryDate.getFullYear();
      const entryMonth = entryDate.getMonth() + 1;

      return entryYear === year && entryMonth === month;
    };
  }

  if (year) {
    return (entryEntity) => {
      const entryDate = new Date(entryEntity.createdAt);
      const entryYear = entryDate.getFullYear();

      return entryYear === year;
    };
  }

  throw new Error(
    `Invalid entry filters: year=${year}, month=${month}, day=${day}`,
  );
}

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {number} [params.day]
 * @param {number} [params.month]
 * @param {number} [params.year]
 * @returns {Array<BlogEntry>}
 */
function filterEntries(blog, params) {
  const { day, month, year } = params;

  if (day || month || year) {
    return blog.entities.entry.filter(
      getEntryFilterFromDateParams(blog, { day, month, year }),
    );
  }

  return blog.entities.entry;
}

/**
 * @typedef {Object} EntryListPageViewParams
 * @prop {string} pageHeading
 * @prop {number} [day]
 * @prop {number} [month]
 * @prop {number} [year]
 * @prop {("asc" | "desc")} [sort = "asc"]
 * @prop {(number | null)} [max = null]
 * @prop {string} [fingerprint]
 */

/**
 * @param {Blog} blog
 * @param {EntryListPageViewParams} params
 * @returns {EntryListPageView}
 */
export function getEntryListPageView(blog, params) {
  const {
    day,
    fingerprint,
    max = null,
    month,
    sort = "asc",
    pageHeading,
    year,
  } = params;
  let entryEntities = filterEntries(blog, { day, month, year });

  if (sort === "desc") {
    entryEntities = entryEntities.reverse();
  }

  if (max) {
    entryEntities = entryEntities.slice(0, max);
  }

  /** @type {Array<EntrySummaryView>} */
  const entryViews = entryEntities.map((entryEntity) => {
    const { slug, title, createdAt } = entryEntity;
    const entryDate = new Date(createdAt);
    const entryYear = entryDate.getFullYear();
    const entryMonth = entryDate.getMonth() + 1;
    const entryDay = entryDate.getDate();

    return { year: entryYear, month: entryMonth, day: entryDay, slug, title };
  });

  return {
    ...getBasePageView(blog, { pageHeading, fingerprint }),
    entries: entryViews,
  };
}
