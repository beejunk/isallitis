import path from "node:path";
import fs from "node:fs/promises";
import { BlogSchema } from "../models/schemas.js";

export async function loadBlog() {
  const blogUrl = new URL("./blog.json", import.meta.url);
  const blogFile = await fs.readFile(blogUrl, "utf8");
  const blogJSON = JSON.parse(blogFile);

  return BlogSchema.parse(blogJSON);
}

/**
 * @param {Object} params
 * @param {string} params.slug
 * @param {number} params.day
 * @param {number} params.month
 * @param {number} params.year
 * @param {URL} [params.baseURL]
 */
export async function importEntry(params) {
  const { baseURL, slug, day, month, year } = params;

  const moduleName = `${year}-${month}-${day}-${slug}.js`;
  const moduleURL = new URL(
    path.join("entries", moduleName),
    baseURL ?? import.meta.url,
  );

  const entryModule = await import(moduleURL.pathname);

  // TODO Validate module with schema
  return entryModule;
}
