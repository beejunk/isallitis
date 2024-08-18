import { years } from "./years.js";

/**
 * @typedef {Object} BlogEntry
 * @property {string} body
 * @property {number} hour
 * @property {number} minute
 * @property {string} title
 */

/**
 * @typedef {Object} BlogDay
 * @property {number} day
 * @property {Array<BlogEntry>} entries
 */

/**
 * @typedef {Object} BlogMonth
 * @property {number} month
 * @property {Array<BlogDay>} days
 */

/**
 * @typedef {Object} BlogYear
 * @property {number} year
 * @property {Array<BlogMonth>} months
 */

/**
 * @typedef {Object} BlogCatalogue
 * @property {Array<BlogYear>} years
 */

/** @type {BlogCatalogue} */
export const catalogue = { years };
