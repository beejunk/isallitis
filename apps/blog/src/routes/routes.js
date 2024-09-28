import { blogEntry } from "../blog/templates/blog-entry.js";
import { index } from "../blog/templates/index.js";
import {
  condenseWhitespace,
  reduceBlogToEntryData,
} from "../blog/blog-utils.js";
import { rss, toRSSItem } from "../rss/rss.js";

const HTML_EXT = "html";
const HTML_MIME = "text/html";
const RSS_EXT = "xml";
const RSS_MIME = "application/rss+xml";

/**
 * @typedef {Object} RouteParams
 * @property {number} year
 * @property {number} month
 * @property {number} day
 * @property {string} slug
 */

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
 * @typedef {Object} RouteData
 * @prop {string} content
 * @prop {string} ext
 * @prop {string} mime
 * @prop {string} slug
 */

/**
 * @param {RouteParams} routeParams
 */
export function getBlogRoute(routeParams) {
  const { year, month, day, slug } = routeParams;
  return `/years/${year}/months/${month}/days/${day}/entries/${slug}`;
}

/**
 * @param {Array<EntryData>} entryData
 * @param {string} [fingerprint]
 * @return {Map<string, RouteData>}
 */
function mapEntryDataToRoutes(entryData, fingerprint) {
  /** @type {Map<string, RouteData>} */
  const routeMap = new Map();

  entryData.forEach((entry) => {
    const { year, month, day, slug, body, title } = entry;
    const path = getBlogRoute({ year, month, day, slug });
    const html = condenseWhitespace(blogEntry({ body, fingerprint, title }));

    routeMap.set(path, {
      content: html,
      ext: HTML_EXT,
      mime: HTML_MIME,
      slug,
    });
  });

  return routeMap;
}

/**
 * Creates a `Map` where the keys are blog routes and the values are the HTML for
 * that route.
 *
 * @param {import("../blog/blog.js").Blog} blog
 * @param {Object} options
 * @param {string} options.hostname
 * @param {string} [options.fingerprint]
 * @return {Map<string, RouteData>}
 */
export function createRouteMap(blog, options) {
  const { fingerprint, hostname } = options;

  const entryData = reduceBlogToEntryData(blog);
  const rssItems = entryData.map(toRSSItem(hostname));
  const routeMap = mapEntryDataToRoutes(entryData, fingerprint);

  routeMap.set("/index", {
    content: condenseWhitespace(index({ blog, fingerprint })),
    ext: HTML_EXT,
    mime: HTML_MIME,
    slug: "index",
  });

  routeMap.set("/rss-feed", {
    content: rss({
      title: blog.title,
      link: new URL(hostname),
      description: blog.description,
      items: rssItems,
    }),
    ext: RSS_EXT,
    mime: RSS_MIME,
    slug: "rss-feed",
  });

  return routeMap;
}
