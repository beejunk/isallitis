import { renderToString } from "preact-render-to-string";
import { html } from "htm/preact";
import { BlogEntry } from "../components/pages/blog-entry.js";
import { RSS } from "../components/rss/rss.js";
import { HOST_NAME } from "../constants.js";
import { EntryListPage } from "../components/pages/entry-list-page.js";
import { getRecentEntriesPageView } from "../views/recent-entries-page.js";
import { getYearPageView } from "../views/year-page.js";
import { getMonthPageView } from "../views/month-page.js";
import { getDayPageView } from "../views/day-page.js";
import { getEntryPageView } from "../views/entry-page.js";
import { getRSSView } from "../views/rss.js";
import { getBlogDates } from "../models/queries/entry.js";

/** @typedef {import("preact").FunctionComponent} FunctionComponent */
/** @typedef {import("../models/schemas.js").Blog} Blog */
/** @typedef {import("../models/queries/entry.js").BlogDates} BlogDates */

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
  const recentEntriesView = getRecentEntriesPageView(blog, { fingerprint });

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
 * @param {BlogDates["days"]} params.days
 * @param {string} [params.fingerprint]
 * @returns {Array<[string, RouteData]>}
 */
function createDayRoutes(blog, params) {
  const { days, fingerprint } = params;

  return Object.values(days).map(({ day, month, year }) => {
    const dayView = getDayPageView(blog, { fingerprint, day, month, year });
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
 * @param {BlogDates["months"]} params.months
 * @param {string} [params.fingerprint]
 * @returns {Array<[string, RouteData]>}
 */
function createMonthRoutes(blog, params) {
  const { months, fingerprint } = params;

  return Object.values(months).map(({ month, year }) => {
    const monthView = getMonthPageView(blog, { fingerprint, month, year });
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
 * @param {BlogDates["years"]} params.years
 * @param {string} [params.fingerprint]
 * @returns {Array<[string, RouteData]>}
 */
function createYearRoutes(blog, params) {
  const { fingerprint, years } = params;

  return Object.values(years).map(({ year }) => {
    const yearView = getYearPageView(blog, { fingerprint, year });
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
  const { years, months, days } = getBlogDates(blog);

  const entryRoutes = await createAllEntryRoutes(blog, {
    entriesBaseURL,
    fingerprint,
  });
  const indexRoute = createIndexRoute(blog, { fingerprint });
  const dayRoutes = createDayRoutes(blog, { fingerprint, days });
  const monthRoutes = createMonthRoutes(blog, { fingerprint, months });
  const yearRoutes = createYearRoutes(blog, { fingerprint, years });
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
