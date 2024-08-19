import { getBlogPath } from "./utils.js";
import { blogEntryTemplate } from "../templates/blog-entry.js";

/**
 * @param {import("./catalogue.js").BlogCatalogue} catalogue
 * @return {Map<string, string>}
 */
export function createHTMLMap(catalogue) {
  const htmlMap = new Map();

  catalogue.years.forEach(({ year, months }) => {
    months.forEach(({ month, days }) => {
      days.forEach(({ day, entries }) => {
        entries.forEach(({ hour, minute, body, title }) => {
          const path = getBlogPath(year, month, day, hour, minute);
          htmlMap.set(path, blogEntryTemplate({ body, title }));
        });
      });
    });
  });

  return htmlMap;
}
