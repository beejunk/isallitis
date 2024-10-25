import { renderToString } from "preact-render-to-string";
import { html } from "htm/preact";
import { BlogEntry } from "../blog/pages/blog-entry.js";
import { RSS } from "../rss/components/rss.js";
import {
  getDayView,
  getEntryPageView,
  getMonthView,
  getRecentEntriesView,
  getRSSView,
  getYearView,
} from "../views/views.js";
import { HOST_NAME } from "../constants.js";
import { getMonth } from "../models/queries/month.js";
import { getYear } from "../models/queries/year.js";
import { EntryListPage } from "../blog/pages/entry-list-page.js";

/** @typedef {import("preact").FunctionComponent} FunctionComponent */
/** @typedef {import("../models/schemas.js").Blog} Blog */

/** @type {"html"} */
const HTML_EXT = "html";

/** @type {"text/html"} */
const HTML_MIME = "text/html";

/** @type {"xml"} */
const RSS_EXT = "xml";

/** @type {"application/rss+xml"} */
const RSS_MIME = "application/rss+xml";

/** @type {"<!DOCTYPE html>"} */
const DOCTYPE = "<!DOCTYPE html>";

/** @typedef {(typeof RSS_MIME | typeof HTML_MIME)} MimeType */

/** @typedef {(typeof RSS_EXT | typeof HTML_EXT)} RouteExtension */

/**
 * @param {string} html
 * @returns {string}
 */
function withDoctype(html) {
  return `${DOCTYPE}${html}`;
}

/**
 * @typedef {Object} RouteParams
 * @property {number} year
 * @property {number} month
 * @property {number} day
 * @property {string} slug
 */

/**
 * @typedef {Object} RouteData
 * @prop {string} content
 * @prop {RouteExtension} ext
 * @prop {MimeType} mime
 * @prop {string} slug
 */

/**
 * Returns the route path for the related blog entry.
 *
 * @param {RouteParams} routeParams
 */
export function getBlogEntryRoute(routeParams) {
  const { year, month, day, slug } = routeParams;
  return `/year/${year}/month/${month}/day/${day}/${slug}`;
}

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {string} params.slug
 * @param {string} [params.fingerprint]
 * @param {URL} [params.entriesBaseURL]
 * @returns {Promise<[string, RouteData]>}
 */
async function createEntryRoute(blog, { entriesBaseURL, fingerprint, slug }) {
  const entryPageView = await getEntryPageView(blog, {
    entriesBaseURL,
    fingerprint,
    slug,
  });
  const path = getBlogEntryRoute(entryPageView);

  const content = withDoctype(
    renderToString(html`<${BlogEntry} ...${entryPageView} />`),
  );

  return [
    path,
    {
      content,
      ext: HTML_EXT,
      mime: HTML_MIME,
      slug,
    },
  ];
}

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {string} [params.fingerprint]
 * @param {URL} [params.entriesBaseURL]
 * @return {Promise<Array<[string, RouteData]>>}
 */
async function createAllEntryRoutes(blog, { entriesBaseURL, fingerprint }) {
  const routes = await Promise.all(
    blog.entities.entry.map(({ slug }) =>
      createEntryRoute(blog, { entriesBaseURL, fingerprint, slug }),
    ),
  );

  return routes;
}

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {string} params.hostname
 * @param {URL} [params.entriesBaseURL]
 * @return {Promise<[string, RouteData]>}
 */
async function createRSSRoute(blog, params) {
  const rssView = await getRSSView(blog, params);

  return [
    "/rss-feed",
    {
      content: renderToString(html`<${RSS} ...${rssView} />`),
      ext: RSS_EXT,
      mime: RSS_MIME,
      slug: "rss-feed",
    },
  ];
}

/**
 * @param {Blog} blog
 * @param {Object} [params]
 * @param {string} [params.fingerprint]
 * @returns {[string, RouteData]}
 */
function createIndexRoute(blog, params = {}) {
  const { fingerprint } = params;
  const recentEntriesView = getRecentEntriesView(blog, { fingerprint });

  return [
    "/index",
    {
      content: withDoctype(
        renderToString(html`<${EntryListPage} ...${recentEntriesView} />`),
      ),
      ext: HTML_EXT,
      mime: HTML_MIME,
      slug: "index",
    },
  ];
}

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {string} [params.fingerprint]
 * @returns {Array<[string, RouteData]>}
 */
function createDayRoutes(blog, params = {}) {
  const { fingerprint } = params;

  return blog.entities.day.map(({ day, monthId, yearId }) => {
    const { month } = getMonth(blog, { id: monthId });
    const { year } = getYear(blog, { id: yearId });
    const dayView = getDayView(blog, { fingerprint, day, month, year });
    const path = `/year/${year}/month/${month}/day/${day}`;

    return [
      path,
      {
        content: withDoctype(
          renderToString(html`<${EntryListPage} ...${dayView} />`),
        ),
        ext: HTML_EXT,
        mime: HTML_MIME,
        slug: day.toString(),
      },
    ];
  });
}

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {string} [params.fingerprint]
 * @returns {Array<[string, RouteData]>}
 */
function createMonthRoutes(blog, params = {}) {
  const { fingerprint } = params;

  return blog.entities.month.map(({ month, yearId }) => {
    const { year } = getYear(blog, { id: yearId });
    const monthView = getMonthView(blog, { fingerprint, month, year });
    const path = `/year/${year}/month/${month}`;

    return [
      path,
      {
        content: withDoctype(
          renderToString(html`<${EntryListPage} ...${monthView} />`),
        ),
        ext: HTML_EXT,
        mime: HTML_MIME,
        slug: month.toString(),
      },
    ];
  });
}

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {string} [params.fingerprint]
 * @returns {Array<[string, RouteData]>}
 */
function createYearRoutes(blog, params = {}) {
  const { fingerprint } = params;

  return blog.entities.year.map(({ year }) => {
    const yearView = getYearView(blog, { fingerprint, year });
    const path = `/year/${year}`;

    return [
      path,
      {
        content: withDoctype(
          renderToString(html`<${EntryListPage} ...${yearView} />`),
        ),
        ext: HTML_EXT,
        mime: HTML_MIME,
        slug: year.toString(),
      },
    ];
  });
}

/**
 * Creates a `Map` where the keys are blog routes and the values are `RouteData`
 * objects containing the content and meta-data for that route.
 *
 * @param {Blog} blog
 * @param {Object} [params]
 * @param {string} [params.fingerprint]
 * @param {URL} [params.entriesBaseURL]
 * @return {Promise<Map<string, RouteData>>}
 */
export async function compileRouteMap(blog, params) {
  const { entriesBaseURL, fingerprint } = params ?? {};

  const entryRoutes = await createAllEntryRoutes(blog, {
    entriesBaseURL,
    fingerprint,
  });
  const indexRoute = createIndexRoute(blog, { fingerprint });
  const dayRoutes = createDayRoutes(blog, { fingerprint });
  const monthRoutes = createMonthRoutes(blog, { fingerprint });
  const yearRoutes = createYearRoutes(blog, { fingerprint });
  const rssRoute = await createRSSRoute(blog, {
    entriesBaseURL,
    hostname: HOST_NAME,
  });

  return new Map([
    ...entryRoutes,
    ...dayRoutes,
    ...monthRoutes,
    ...yearRoutes,
    indexRoute,
    rssRoute,
  ]);
}
