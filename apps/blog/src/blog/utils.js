import { catalogue } from "./catalogue.js";

/** @typedef {import("./catalogue.js").BlogEntry} BlogEntry */
/** @typedef {import("./catalogue.js").BlogDay} BlogDay */
/** @typedef {import("./catalogue.js").BlogMonth} BlogMonth */
/** @typedef {import("./catalogue.js").BlogYear} BlogYear */

/** @typedef {Omit<BlogEntry, "hour" | "minute">} BlogContent */

/**
 * @typedef {Object} BlogDate
 * @property {Date} date
 */

/** @typedef {BlogContent & BlogDate} MergedBlogEntry */

/**
 * @template T
 * @param {function(T): boolean} fn
 * @return {function(T): boolean}
 */
export function trace(fn) {
  return (el) => {
    console.log(el);
    return fn(el);
  };
}

/**
 * @param {number} hour
 * @param {number} minute
 * @return {function(BlogEntry): boolean}
 */
function isEntry(hour, minute) {
  return (blogEntry) => blogEntry.hour === hour && blogEntry.minute === minute;
}

/**
 * @param {number} day
 * @return {function(BlogDay): boolean}
 */
function isDay(day) {
  return (blogDay) => blogDay.day === day;
}

/**
 * @param {number} month
 * @return {function(BlogMonth): boolean}
 */
function isMonth(month) {
  return (blogMonth) => blogMonth.month === month;
}

/**
 * @param {number} year
 * @return {function(BlogYear): boolean}
 */
function isYear(year) {
  return (blogYear) => blogYear.year === year;
}

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @param {number} hour
 * @param {number} minute
 * @return {MergedBlogEntry | undefined}
 */
export function getBlogEntry(year, month, day, hour, minute) {
  const entry = catalogue.years
    .find(isYear(year))
    ?.months.find(isMonth(month))
    ?.days.find(isDay(day))
    ?.entries.find(isEntry(hour, minute));

  if (entry) {
    return {
      body: entry.body,
      date: new Date(year, month, day, hour, minute),
      title: entry.title,
    };
  }
}
