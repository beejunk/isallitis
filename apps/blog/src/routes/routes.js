import { condenseWhitespace, getBlogPath } from "../utils/html-utils.js";
import { blogEntry } from "../templates/blog-entry.js";
import { index } from "../templates/index.js";
import { reduceToEntryData } from "../utils/blog-utils.js";

/** @typedef {import("../utils/blog-utils.js").EntryData} EntryData */

/**
 * @param {Array<EntryData>} entryData
 * @param {string} [fingerprint]
 * @return {Map<string, string>}
 */
function mapEntryDataToRoutes(entryData, fingerprint) {
  const routeMap = new Map();

  entryData.forEach((entry) => {
    const { year, month, day, slug, body, title } = entry;
    const path = getBlogPath({ year, month, day, slug });
    const html = condenseWhitespace(blogEntry({ body, fingerprint, title }));

    routeMap.set(path, html);
  });

  return routeMap;
}

/**
 * Creates a `Map` where the keys are blog routes and the values are the HTML for
 * that route.
 *
 * @param {import("../blog/blog.js").Blog} blog
 * @param {Object} [options = {}]
 * @param {string} [options.fingerprint]
 * @return {Map<string, string>}
 */
export function createRouteMap(blog, options = {}) {
  const { fingerprint } = options;

  const entryData = reduceToEntryData(blog);
  const routeMap = mapEntryDataToRoutes(entryData, fingerprint);

  routeMap.set("/index", condenseWhitespace(index({ blog, fingerprint })));

  return routeMap;
}
