import { year2024 } from "./2024/year2024.js";

/**
 * @typedef {Object} BlogEntry
 * @property {string} body
 * @property {number} hour
 * @property {number} minute
 * @property {string} slug
 * @property {string} title
 */

/**
 * @typedef {Object} BlogDay
 * @property {number} day
 * @property {Record<string, BlogEntry>} entries
 */

/**
 * @typedef {Object} BlogMonth
 * @property {number} month
 * @property {Record<string, BlogDay>} days
 */

/**
 * @typedef {Object} BlogYear
 * @property {number} year
 * @property {Record<string, BlogMonth>} months
 */

/**
 * @typedef {Object} BlogCatalogue
 * @property {string} title
 * @property {Record<string, BlogYear>} years
 */

/** @typedef {[number, number, number, string]} BlogPathParams */

/** @type {BlogCatalogue} */
export const blog = {
  title: "A Blog Is All It Is",

  years: {
    [year2024.year]: year2024,
  },
};
