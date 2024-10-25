import { renderToString } from "preact-render-to-string";
import { html } from "htm/preact";
import { getYear } from "../models/queries/year.js";
import { getDay } from "../models/queries/day.js";
import { getMonth } from "../models/queries/month.js";
import { getEntry } from "../models/queries/entry.js";
import { getBlogEntryRoute } from "../routes/routes.js";
import { importEntry } from "../blog/blog-utils.js";

/** @typedef {import("../models/schemas.js").Blog} Blog*/

/**
 * @typedef {Object} WithChildren
 * @prop {import("preact").ComponentChildren} children
 */

/**
 * @typedef {Object} EntryView
 * @prop {number} year
 * @prop {number} month
 * @prop {number} day
 * @prop {string} slug
 * @prop {string} title
 */

/**
 * @typedef {Object} RSSItemView
 * @prop {string} description
 * @prop {URL} link
 * @prop {string} title
 */

/**
 * @typedef {Object} EntriesView
 * @prop {Array<EntryView>} entries
 */

/**
 * @typedef {Object} RSSItemsView
 * @prop {Array<RSSItemView>} items
 */

/**
 * @typedef {Object} PageView
 * @prop {string} blogTitle
 * @prop {string} blogDescription
 * @prop {string} pageHeading
 * @prop {string} pageTitle
 * @prop {string} [fingerprint]
 */

/**
 * @typedef {Object} RSSChannelView
 * @prop {string} blogTitle
 * @prop {string} blogDescription
 * @prop {URL} blogLink
 */

/**
 * @typedef {Omit<EntryView, "title"> & PageView & WithChildren} EntryPageView
 */

/**
 * Generic view that shows a page title and a list of entries.
 *
 * @typedef{PageView & EntriesView} EntryListView
 */

/**
 * @typedef {RSSChannelView & RSSItemsView} RSSView
 */

/**
 * @param {Blog} blog
 * @param {Object} [params]
 * @param {number} [params.max = 10]
 * @param {string} [params.fingerprint]
 * @returns {EntryListView}
 */
export function getRecentEntriesView(blog, params = {}) {
  const { fingerprint, max = 10 } = params;
  const pageHeading = "Recent Entries";
  const pageTitle = `${blog.title} - ${pageHeading}`;

  const recentEntries = blog.entities.entry.reverse().slice(0, max);

  /** @type {Array<EntryView>} */
  const entryViews = recentEntries.map((entry) => {
    const { slug, title, dayId, monthId, yearId } = entry;
    const { day } = getDay(blog, { id: dayId });
    const { month } = getMonth(blog, { id: monthId });
    const { year } = getYear(blog, { id: yearId });

    return { year, month, day, slug, title };
  });

  return {
    blogDescription: blog.description,
    blogTitle: blog.title,
    entries: entryViews,
    fingerprint,
    pageHeading,
    pageTitle,
  };
}

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {number} params.year
 * @param {string} [params.fingerprint]
 * @returns {EntryListView}
 */
export function getYearView(blog, params) {
  const { fingerprint, year } = params;
  const yearEntity = getYear(blog, { year });
  const pageHeading = `Entries from ${year}`;
  const pageTitle = `${blog.title} - ${pageHeading}`;

  const entryEntities = blog.entities.entry.filter(
    ({ yearId }) => yearEntity.id === yearId,
  );

  /** @type {Array<EntryView>} */
  const yearEntries = entryEntities.map((entry) => {
    const { slug, dayId, monthId, title } = entry;
    const { day } = getDay(blog, { id: dayId });
    const { month } = getMonth(blog, { id: monthId });

    return { year: yearEntity.year, month, day, slug, title };
  });

  return {
    blogDescription: blog.description,
    blogTitle: blog.title,
    entries: yearEntries,
    fingerprint,
    pageHeading,
    pageTitle,
  };
}

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {number} params.month
 * @param {number} params.year
 * @param {string} [params.fingerprint]
 * @returns {EntryListView}
 */
export function getMonthView(blog, params) {
  const { fingerprint, month, year } = params;
  const monthEntity = getMonth(blog, { year, month });
  const yearEntity = getYear(blog, { year });

  const entries = blog.entities.entry.filter(
    ({ monthId }) => monthId === monthEntity.id,
  );

  const formattedMonth = `${yearEntity.year}-${monthEntity.month}`;
  const pageHeading = `Entries from ${formattedMonth}`;
  const pageTitle = `${blog.title} - ${formattedMonth}`;

  /** @type {Array<EntryView>} */
  const entryViews = entries.map((entry) => {
    const { slug, dayId, title } = entry;
    const { day } = getDay(blog, { id: dayId });

    return {
      year: yearEntity.year,
      month: monthEntity.month,
      day,
      slug,
      title,
    };
  });

  return {
    blogDescription: blog.description,
    blogTitle: blog.title,
    entries: entryViews,
    fingerprint,
    pageHeading,
    pageTitle,
  };
}

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {number} params.day
 * @param {number} params.month
 * @param {number} params.year
 * @param {string} [params.fingerprint]
 * @returns {EntryListView}
 */
export function getDayView(blog, params) {
  const { day, fingerprint, month, year } = params;
  const dayEntity = getDay(blog, { year, month, day });
  const monthEntity = getMonth(blog, { year, month });
  const yearEntity = getYear(blog, { year });

  const entries = blog.entities.entry.filter(
    ({ dayId }) => dayEntity.id === dayId,
  );

  const formattedDay = `${yearEntity.year}-${monthEntity.month}-${dayEntity.day}`;
  const pageHeading = `Entries from ${formattedDay}`;
  const pageTitle = `${blog.title} - ${formattedDay}`;

  /** @type {Array<EntryView>} */
  const entryViews = entries.map((entry) => {
    const { slug, title } = entry;

    return {
      fingerprint,
      year: yearEntity.year,
      month: monthEntity.month,
      day: dayEntity.day,
      slug,
      title,
    };
  });

  return {
    blogDescription: blog.description,
    blogTitle: blog.title,
    entries: entryViews,
    pageHeading,
    pageTitle,
  };
}

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {string} params.slug
 * @returns {PageView & Omit<EntryView, "title">}
 */
export function getEntryView(blog, params) {
  const { slug } = params;

  const { dayId, yearId, monthId, title } = getEntry(blog, { slug });
  const dayEntity = getDay(blog, { id: dayId });
  const monthEntity = getMonth(blog, { id: monthId });
  const yearEntity = getYear(blog, { id: yearId });

  const pageTitle = `${blog.title} - ${title}`;

  return {
    blogDescription: blog.description,
    blogTitle: blog.title,
    pageTitle,
    pageHeading: title,
    day: dayEntity.day,
    month: monthEntity.month,
    year: yearEntity.year,
    slug,
  };
}

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {string} params.hostname
 * @param {string} params.slug
 * @param {URL} [params.entriesBaseURL]
 * @returns {Promise<RSSItemView>}
 */
export async function getRSSItemView(blog, params) {
  const { entriesBaseURL, hostname, slug } = params;
  const { day, month, year, pageHeading } = getEntryView(blog, { slug });
  const path = getBlogEntryRoute({ year, month, day, slug });
  const link = new URL(path, hostname);

  const { body } = await importEntry({
    baseURL: entriesBaseURL,
    day,
    month,
    year,
    slug,
  });

  const description = renderToString(html`<${body} />`);

  return { description, link, title: pageHeading };
}

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {string} params.hostname
 * @param {URL} [params.entriesBaseURL]
 * @returns {Promise<RSSView>}
 */
export async function getRSSView(blog, params) {
  const { description, title } = blog;
  const { entriesBaseURL, hostname } = params;
  const blogLink = new URL(hostname);
  const items = await Promise.all(
    blog.entities.entry.map(({ slug }) =>
      getRSSItemView(blog, { entriesBaseURL, hostname, slug }),
    ),
  );

  return { blogTitle: title, blogDescription: description, blogLink, items };
}

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {string} params.slug
 * @param {string} [params.fingerprint]
 * @param {URL} [params.entriesBaseURL]
 * @returns {Promise<EntryPageView>}
 */
export async function getEntryPageView(blog, params) {
  const { entriesBaseURL, fingerprint, slug } = params;
  const { day, month, year, pageHeading, pageTitle } = getEntryView(
    blog,
    params,
  );
  const entryModule = await importEntry({
    baseURL: entriesBaseURL,
    day,
    month,
    year,
    slug,
  });

  return {
    blogTitle: blog.title,
    blogDescription: blog.description,
    children: entryModule.body,
    day,
    fingerprint,
    month,
    year,
    pageHeading,
    pageTitle,
    slug,
  };
}
