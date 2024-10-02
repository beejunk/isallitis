/** @typedef {import("../routes/routes.js").EntryData} EntryData */
/** @typedef {import("../routes/routes.js").RouteParams} RoutePathParams */
/** @typedef {import("./blog.js").BlogEntry} BlogEntry */
/** @typedef {import("./blog.js").BlogDay} BlogDay */
/** @typedef {import("./blog.js").BlogMonth} BlogMonth */
/** @typedef {import("./blog.js").BlogYear} BlogYear */

/** @typedef {string | number} HTMLChildElement */

/** @typedef {Array<HTMLChildElement>} HTMLChildArray */

/** @typedef {HTMLChildElement | HTMLChildArray} HTMLChild */

/** @typedef {Array<HTMLChild>} HTMLChildren */

const HTML_WHITESPACE_RE = new RegExp(/\n\s*|\s\s+/, "g");

/**
 * @param {Object} dateInfo
 * @param {number} dateInfo.year
 * @param {number} dateInfo.month
 * @param {number} dateInfo.day
 * @returns {function(Array<EntryData>, BlogEntry): Array<EntryData>}
 */
const reduceEntry = (dateInfo) => (entryDataArr, entry) => {
  const { body, slug, title, hour, minute } = entry;

  return [...entryDataArr, { ...dateInfo, body, slug, title, hour, minute }];
};

/**
 * @param {Pick<EntryData, "year" | "month">} yearAndMonth
 * @returns {function(Array<EntryData>, BlogDay): Array<EntryData>}
 */
const reduceDay = (yearAndMonth) => (entryDataArr, blogDay) => {
  const { day, entries } = blogDay;

  return Object.values(entries).reduce(
    reduceEntry({ ...yearAndMonth, day }),
    entryDataArr,
  );
};

/**
 * @param {number} year
 * @returns {function(Array<EntryData>, BlogMonth): Array<EntryData>}
 */
const reduceMonth = (year) => (entryDataArr, blogMonth) => {
  const { month, days } = blogMonth;

  return Object.values(days).reduce(reduceDay({ year, month }), entryDataArr);
};

/**
 * @param {Array<EntryData>} entryDataArr
 * @param {import("./blog.js").BlogYear} blogYear
 */
const reduceYear = (entryDataArr, blogYear) => {
  const { year, months } = blogYear;

  return Object.values(months).reduce(reduceMonth(year), entryDataArr);
};

/**
 * @param {import("./blog.js").Blog} blog
 * @return {Array<EntryData>}
 */
export function reduceBlogToEntryData(blog) {
  return Object.values(blog.years).reduce(reduceYear, []);
}

/**
 * @param {string} html
 * @return {string}
 */
export function condenseWhitespace(html) {
  return html.trim().replaceAll(HTML_WHITESPACE_RE, " ");
}
