import { getDay } from "../models/queries/day.js";
import { getMonth } from "../models/queries/month.js";
import { getYear } from "../models/queries/year.js";
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
    const dayEntity = getDay(blog, { day, month, year });
    const monthEntity = getMonth(blog, { id: dayEntity.monthId });
    const yearEntity = getYear(blog, { id: dayEntity.yearId });

    return (entryEntity) =>
      entryEntity.dayId === dayEntity.id &&
      entryEntity.monthId === monthEntity.id &&
      entryEntity.yearId === yearEntity.id;
  }

  if (month && year) {
    const monthEntity = getMonth(blog, { month, year });
    const yearEntity = getYear(blog, { id: monthEntity.yearId });

    return (entryEntity) =>
      entryEntity.monthId === monthEntity.id &&
      entryEntity.yearId === yearEntity.id;
  }

  if (year) {
    const yearEntity = getYear(blog, { year });

    return (entryEntity) => entryEntity.yearId === yearEntity.id;
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
    const { slug, title, dayId, monthId, yearId } = entryEntity;
    const { day } = getDay(blog, { id: dayId });
    const { month } = getMonth(blog, { id: monthId });
    const { year } = getYear(blog, { id: yearId });

    return { year, month, day, slug, title };
  });

  return {
    ...getBasePageView(blog, { pageHeading, fingerprint }),
    entries: entryViews,
  };
}
