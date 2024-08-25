import { condenseWhitespace, getBlogPath } from "./utils.js";
import { blogEntry } from "../templates/blog-entry.js";
import { index } from "../templates/index.js";

/**
 * @param {import("./blog.js").Blog} blog
 * @param {Object} [options = {}]
 * @param {string} [options.fingerprint]
 * @return {Map<string, string>}
 */
export function createHTMLMap(blog, options = {}) {
  const htmlMap = new Map();
  const { fingerprint } = options;

  htmlMap.set("/index", condenseWhitespace(index({ blog, fingerprint })));

  Object.values(blog.years).forEach(({ year, months }) => {
    Object.values(months).forEach(({ month, days }) => {
      Object.values(days).forEach(({ day, entries }) => {
        Object.values(entries).forEach(({ body, slug, title }) => {
          const path = getBlogPath({ year, month, day, slug });
          const html = condenseWhitespace(
            blogEntry({ body, fingerprint, title }),
          );
          htmlMap.set(path, html);
        });
      });
    });
  });

  return htmlMap;
}
