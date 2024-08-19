/** @typedef {import("./catalogue.js").BlogEntry} BlogEntry */
/** @typedef {import("./catalogue.js").BlogDay} BlogDay */
/** @typedef {import("./catalogue.js").BlogMonth} BlogMonth */
/** @typedef {import("./catalogue.js").BlogYear} BlogYear */
/** @typedef {import("./catalogue.js").BlogCatalogue} BlogCatalogue */

/** @typedef {Omit<BlogEntry, "hour" | "minute">} BlogContent */

/**
 * @typedef {Object} BlogDate
 * @property {Date} date
 */

/** @typedef {BlogContent & BlogDate} MergedBlogEntry */

/** @typedef {[number, number, number, number, number]} DateParams */

/**
 * @template T
 * @param {function(T): boolean} fn
 * @return {function(T): boolean}
 */
export function trace(fn) {
  return (el) => {
    console.log(JSON.stringify(el, null, 2));
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
 * @param {import("./catalogue.js").BlogCatalogue} catalogue
 */
export function Blog(catalogue) {
  return {
    /**
     * @param {DateParams} args
     * @return {BlogEntry}
     */
    getEntry(...args) {
      const [year, month, day, hour, minute] = args;
      const entry = catalogue.years
        .find(isYear(year))
        ?.months.find(isMonth(month))
        ?.days.find(isDay(day))
        ?.entries.find(isEntry(hour, minute));

      if (!entry) {
        throw new Error(`Unable to find blog entry.`);
      }

      return entry;
    },
  };
}
