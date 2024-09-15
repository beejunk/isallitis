/**
 * @typedef {Object} EntryData
 * @property {number} year
 * @property {number} month
 * @property {number} day
 * @property {number} hour
 * @property {number} minute
 * @property {string} slug
 * @property {string} body
 * @property {string} title
 */

/**
 * @param {Object} dateInfo
 * @param {number} dateInfo.year
 * @param {number} dateInfo.month
 * @param {number} dateInfo.day
 */
function withDateInfo(dateInfo) {
  /**
   * @param {Array<EntryData>} entryDataArr
   * @param {import("../blog/blog.js").BlogEntry} entry
   */
  return function mergeEntry(entryDataArr, entry) {
    const { body, slug, title, hour, minute } = entry;

    return [...entryDataArr, { ...dateInfo, body, slug, title, hour, minute }];
  };
}

/**
 * @param {Pick<EntryData, "year" | "month">} yearAndMonth
 */
function withYearAndMonth(yearAndMonth) {
  /**
   * @param {Array<EntryData>} entryDataArr
   * @param {import("../blog/blog.js").BlogDay} blogDay
   */
  return function mergeDay(entryDataArr, blogDay) {
    const { day, entries } = blogDay;
    const mergeEntry = withDateInfo({ ...yearAndMonth, day });

    return Object.values(entries).reduce(mergeEntry, entryDataArr);
  };
}

/**
 * @param {number} year
 */
function withYear(year) {
  /**
   * @param {Array<EntryData>} entryDataArr
   * @param {import("../blog/blog.js").BlogMonth} blogMonth
   */
  return function mergeMonth(entryDataArr, blogMonth) {
    const { month, days } = blogMonth;
    const mergeDay = withYearAndMonth({ year, month });

    return Object.values(days).reduce(mergeDay, entryDataArr);
  };
}

/**
 * @param {Array<EntryData>} entryDataArr
 * @param {import("../blog/blog.js").BlogYear} blogYear
 */
function toFlattenedEntryData(entryDataArr, blogYear) {
  const { year, months } = blogYear;
  const mergeMonth = withYear(year);

  return Object.values(months).reduce(mergeMonth, entryDataArr);
}

/**
 * @param {import("../blog/blog.js").Blog} blog
 * @return {Array<EntryData>}
 */
export function reduceToEntryData(blog) {
  /** @type {Array<EntryData>} */
  const entryDataArr = [];

  return Object.values(blog.years).reduce(toFlattenedEntryData, entryDataArr);
}
