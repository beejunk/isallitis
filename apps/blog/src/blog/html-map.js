import { condenseWhitespace, getBlogPath } from "./utils.js";
import { blogEntry } from "../templates/blog-entry.js";
import { index } from "../templates/index.js";

/**
 * @param {import("./blog.js").Blog} blog
 * @return {Map<string, string>}
 */
export function createHTMLMap(blog) {
  const htmlMap = new Map();

  htmlMap.set("/index", index(blog).trim());

  Object.values(blog.years).forEach(({ year, months }) => {
    Object.values(months).forEach(({ month, days }) => {
      Object.values(days).forEach(({ day, entries }) => {
        Object.values(entries).forEach(({ body, slug, title }) => {
          const path = getBlogPath({ year, month, day, slug });
          const html = condenseWhitespace(blogEntry({ body, title }));
          htmlMap.set(path, html);
        });
      });
    });
  });

  return htmlMap;
}
