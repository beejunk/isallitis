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
 * @param {HTMLChildren} children
 * @returns {function(string, number): string}
 */
const joinWithChild = (children) => (text, idx) => {
  const child = children[idx] ?? "";
  const childStr = Array.isArray(child) ? child.join("") : child;

  return `${text}${childStr}`;
};

/**
 * Tagged template for HTML. All it does is join the literal into a single string.
 * I use this mostly because having an `html` tagged template will trigger IDE
 * syntax highlighting and Prettier formatting. It does provide some type constraints
 * for what expressions can be used for HTML, too.
 *
 * @param {TemplateStringsArray} strings
 * @param {HTMLChildren} children
 * @return {string}
 */
export function html(strings, ...children) {
  return strings.map(joinWithChild(children)).join("");
}

/**
 * @param {string} html
 * @return {string}
 */
export function condenseWhitespace(html) {
  return html.trim().replaceAll(HTML_WHITESPACE_RE, " ");
}
