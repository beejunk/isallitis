import { renderToString } from "preact-render-to-string";
import { html } from "htm/preact";
import { BlogEntry } from "../blog/components/blog-entry.js";
import { Index } from "../blog/components/index.js";
import { reduceBlogToEntryData } from "../blog/blog-utils.js";
import { rss, toRSSItem } from "../rss/rss.js";

/** @typedef {import("preact").FunctionComponent} FunctionComponent */

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
 * @typedef {Object} EntryData
 * @property {number} year
 * @property {number} month
 * @property {number} day
 * @property {number} hour
 * @property {number} minute
 * @property {string} slug
 * @property {FunctionComponent} body
 * @property {string} title
 */

/**
 * @typedef {Object} RouteData
 * @prop {string} content
 * @prop {RouteExtension} ext
 * @prop {MimeType} mime
 * @prop {string} slug
 */

/**
 * @param {Array<EntryData>} entryData
 * @param {string} [fingerprint]
 * @return {Map<string, RouteData>}
 */
function entryDataToRouteMap(entryData, fingerprint) {
  /** @type {Map<string, RouteData>} */
  const routeMap = new Map();

  entryData.forEach((entry) => {
    const { year, month, day, slug, body, title } = entry;
    const path = getBlogEntryRoute({ year, month, day, slug });
    const content = withDoctype(
      renderToString(html`
        <${BlogEntry} fingerprint=${fingerprint} title=${title}>
          <${body} />
        </BlogEntry>
      `),
    );

    routeMap.set(path, {
      content,
      ext: HTML_EXT,
      mime: HTML_MIME,
      slug,
    });
  });

  return routeMap;
}

/**
 * Returns the route path for the related blog entry.
 *
 * @param {RouteParams} routeParams
 */
export function getBlogEntryRoute(routeParams) {
  const { year, month, day, slug } = routeParams;
  return `/year/${year}/month/${month}/day/${day}/entry/${slug}`;
}

/**
 * Creates a `Map` where the keys are blog routes and the values are `RouteData`
 * objects containing the content and meta-data for that route.
 *
 * @param {import("../blog/blog.js").Blog} blog
 * @param {Object} options
 * @param {string} options.hostname
 * @param {string} [options.fingerprint]
 * @return {Map<string, RouteData>}
 */
export function compileRouteMap(blog, options) {
  const { fingerprint, hostname } = options;

  const entryData = reduceBlogToEntryData(blog);
  const rssItems = entryData.map(toRSSItem(hostname));
  const routeMap = entryDataToRouteMap(entryData, fingerprint);

  routeMap.set("/index", {
    content: withDoctype(
      renderToString(html`<${Index} fingerprint=${fingerprint} />`),
    ),
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
