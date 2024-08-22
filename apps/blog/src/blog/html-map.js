import { getBlogPath } from "./utils.js";
import { blogEntry } from "../templates/blog-entry.js";
import { index } from "../templates/index.js";

/**
 * @param {import("./blog.js").Blog} blog
 * @return {Map<string, string>}
 */
export function createHTMLMap(blog) {
  const htmlMap = new Map();

  htmlMap.set("/", index(blog));

  Object.values(blog.years).forEach(({ year, months }) => {
    Object.values(months).forEach(({ month, days }) => {
      Object.values(days).forEach(({ day, entries }) => {
        Object.values(entries).forEach(({ body, slug, title }) => {
          const path = getBlogPath({ year, month, day, slug });
          htmlMap.set(path, blogEntry({ body, title }));
        });
      });
    });
  });

  return htmlMap;
}
