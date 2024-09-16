import { years } from "./years/years.js";

/**
 * @typedef {Object} BlogEntry
 * @property {string} body
 * @property {number} hour
 * @property {number} minute
 * @property {string} slug
 * @property {string} title
 */

/**
 * @typedef {Record<string, BlogEntry>} BlogEntries
 */

/**
 * @typedef {Object} BlogDay
 * @property {number} day
 * @property {BlogEntries} entries
 */

/**
 * @typedef {Record<string, BlogDay>} BlogDays
 */

/**
 * @typedef {Object} BlogMonth
 * @property {number} month
 * @property {BlogDays} days
 */

/**
 * @typedef {Record<string, BlogMonth>} BlogMonths
 */

/**
 * @typedef {Object} BlogYear
 * @property {number} year
 * @property {BlogMonths} months
 */

/**
 * @typedef {Record<string, BlogYear>} BlogYears
 */

/**
 * @typedef {Object} Blog
 * @property {string} title
 * @property {string} description
 * @property {BlogYears} years
 */

/**
 * @typedef {Object} BlogPathParams
 * @property {number} year
 * @property {number} month
 * @property {number} day
 * @property {string} slug
 */

/** @type {Blog} */
export const blog = {
  title: "A Blog Is All It Is",

  description: "Brian David's web development blog.",

  years,
};
