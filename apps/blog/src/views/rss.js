import { renderToString } from "preact-render-to-string";
import { html } from "htm/preact";
import { importEntry } from "../utils/blog-utils.js";
import { getBlogEntryRoute } from "../routes/routes.js";
import { getEntryDateParams } from "../utils/date-utils.js";

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
  const { createdAt, slug, title } = entry;
  const { day, month, year } = getEntryDateParams(createdAt);

  const { body } = await importEntry({
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
