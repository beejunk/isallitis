import { BLOG_ENTRY, BlogEntrySchema } from "../schemas.js";
import { getEntityById } from "./entity.js";
import { getEntryDateParams } from "../../utils/date-utils.js";

/** @typedef {import("../schemas.js").Blog} Blog */
/** @typedef {import("../schemas.js").BlogQueryParams} BlogQueryParams */
/** @typedef {import("../schemas.js").BlogEntry} BlogEntry */

/**
 * @param {Blog} blog
 * @param {number} id
 */
function getEntryById(blog, id) {
  return BlogEntrySchema.parse(getEntityById(blog, { id, type: BLOG_ENTRY }));
}

/**
 * @param {Blog} blog
 * @param {string} slug
 */
export function getEntryBySlug(blog, slug) {
  return BlogEntrySchema.parse(
    blog.entities.entry.find((entryEntity) => entryEntity.slug === slug),
  );
}

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {number} [params.id]
 * @param {string} [params.slug]
 */
export function getEntry(blog, params) {
  const { id, slug } = params;

  if (typeof id === "number" && slug) {
    throw new Error(
      "Use only one of `id` or `slug` when querying for entries.",
    );
  }

  if (typeof id === "number") {
    return getEntryById(blog, id);
  }

  if (slug) {
    return getEntryBySlug(blog, slug);
  }

  throw new Error(
    "One of `slug` or `id` must be provided when querying for entries.",
  );
}

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {number} params.year
 * @returns {Array<BlogEntry>}
 */
export function getEntriesForYear(blog, params) {
  const { year } = params;

  return blog.entities.entry.filter((entryEntity) => {
    const { year: entryYear } = getEntryDateParams(entryEntity.createdAt);

    return entryYear === year;
  });
}

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {number} params.year
 * @param {number} params.month
 * @returns {Array<BlogEntry>}
 */
export function getEntriesForMonth(blog, params) {
  const { year, month } = params;

  return blog.entities.entry.filter((entryEntity) => {
    const { year: entryYear, month: entryMonth } = getEntryDateParams(
      entryEntity.createdAt,
    );

    return entryYear === year && entryMonth === month;
  });
}

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {number} params.year
 * @param {number} params.month
 * @param {number} params.day
 * @returns {Array<BlogEntry>}
 */
export function getEntriesForDay(blog, params) {
  const { year, month, day } = params;

  return blog.entities.entry.filter((entryEntity) => {
    const {
      year: entryYear,
      month: entryMonth,
      day: entryDay,
    } = getEntryDateParams(entryEntity.createdAt);

    return entryYear === year && entryMonth === month && entryDay === day;
  });
}

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {number} [params.year]
 * @param {number} [params.month]
 * @param {number} [params.day]
 * @returns {Array<BlogEntry>}
 */
export function getEntriesForDate(blog, params) {
  const { year, month, day } = params;

  if (year && month && day) {
    return getEntriesForDay(blog, { year, month, day });
  }

  if (year && month) {
    return getEntriesForMonth(blog, { year, month });
  }

  if (year) {
    return getEntriesForYear(blog, { year });
  }

  throw new Error(
    `Invalid date parameters: year=${year}, month=${month}, day=${day}`,
  );
}

/**
 * @typedef {Object} BlogYear
 * @prop {number} year
 */

/**
 * @typedef {Object} BlogMonth
 * @prop {number} year
 * @prop {number} month
 */

/**
 * @typedef {Object} BlogDay
 * @prop {number} year
 * @prop {number} month
 * @prop {number} day
 */

/**
 * @typedef {Object} BlogDates
 * @prop {Record<string, BlogYear>} years
 * @prop {Record<string, BlogMonth>} months
 * @prop {Record<string, BlogDay>} days
 */

/**
 * @param {Blog} blog
 * @returns {BlogDates}
 */
export function getBlogDates(blog) {
  /** @type {BlogDates} */
  const blogDates = { years: {}, months: {}, days: {} };

  return blog.entities.entry.reduce((years, entry) => {
    const entryDate = new Date(entry.createdAt);
    const entryYear = entryDate.getFullYear();
    const entryMonth = entryDate.getMonth() + 1;
    const entryDay = entryDate.getDate();
    const monthKey = `${entryYear}-${entryMonth}`;
    const dayKey = `${entryYear}-${entryMonth}-${entryDay}`;

    if (!blogDates.years[entryYear]) {
      blogDates.years[entryYear] = { year: entryYear };
    }

    if (!blogDates.months[monthKey]) {
      blogDates.months[monthKey] = { year: entryYear, month: entryMonth };
    }

    if (!blogDates.days[dayKey]) {
      blogDates.days[dayKey] = {
        year: entryYear,
        month: entryMonth,
        day: entryDay,
      };
    }

    return years;
  }, blogDates);
}
