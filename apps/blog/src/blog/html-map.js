import { getBlogPath } from "./utils.js";
import { blogEntryTemplate } from "../templates/blog-entry.js";

/**
 * @param {import("./blog.js").BlogCatalogue} catalogue
 * @return {Map<string, string>}
 */
export function createHTMLMap(catalogue) {
  const htmlMap = new Map();

  Object.values(catalogue.years).forEach(({ year, months }) => {
    Object.values(months).forEach(({ month, days }) => {
      Object.values(days).forEach(({ day, entries }) => {
        Object.values(entries).forEach(({ body, slug, title }) => {
          const path = getBlogPath(year, month, day, slug);
          htmlMap.set(path, blogEntryTemplate({ body, title }));
        });
      });
    });
  });

  return htmlMap;
}
