import { renderToString } from "preact-render-to-string";
import { html } from "htm/preact";
import { getDay } from "../models/queries/day.js";
import { getMonth } from "../models/queries/month.js";
import { getYear } from "../models/queries/year.js";
import { importEntry } from "../utils/blog-utils.js";
import { getBlogEntryRoute } from "../routes/routes.js";

/** @typedef {import("../models/schemas.js").Blog} Blog */
/** @typedef {import("../models/schemas.js").BlogEntry} BlogEntry */

/**
 * @typedef {Object} RSSItemView
 * @prop {string} description
 * @prop {URL} link
 * @prop {string} title
 */

/**
 * @typedef {Object} RSSItemsView
 * @prop {Array<RSSItemView>} items
 */

/**
 * @typedef {Object} RSSChannelView
 * @prop {string} blogTitle
 * @prop {string} blogDescription
 * @prop {URL} blogLink
 */

/**
 * @typedef {RSSChannelView & RSSItemsView} RSSView
 */

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {BlogEntry} params.entry
 * @param {URL} [params.entriesBaseURL]
 * @param {string} params.hostname
 * @returns {Promise<RSSItemView>}
 */
async function getRSSItemView(blog, params) {
  const { entriesBaseURL, entry, hostname } = params;
  const { dayId, monthId, yearId, slug } = entry;

  const { day } = getDay(blog, { id: dayId });
  const { month } = getMonth(blog, { id: monthId });
  const { year } = getYear(blog, { id: yearId });

  const { body, title } = await importEntry({
    baseURL: entriesBaseURL,
    day,
    month,
    year,
    slug,
  });

  const description = renderToString(html`<${body} />`);
  const route = getBlogEntryRoute({ day, month, year, slug });
  const link = new URL(route, hostname);

  return {
    description,
    link,
    title,
  };
}

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {string} params.hostname
 * @param {URL} [params.entriesBaseURL]
 * @returns {Promise<RSSView>}
 */
export async function getRSSView(blog, params) {
  const { hostname } = params;
  const items = await Promise.all(
    blog.entities.entry.map((entry) =>
      getRSSItemView(blog, { ...params, entry }),
    ),
  );

  const blogLink = new URL(hostname);

  return {
    blogTitle: blog.title,
    blogDescription: blog.description,
    blogLink,
    items,
  };
}
