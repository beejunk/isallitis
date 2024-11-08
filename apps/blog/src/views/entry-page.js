import { getEntry } from "../models/queries/entry.js";
import { importEntry } from "../utils/blog-utils.js";
import { getBasePageView } from "./base-page.js";
import { getEntryDateParams } from "../utils/date-utils.js";

/** @typedef {import("../models/schemas.js").Blog} Blog*/
/** @typedef {import("./base-page.js").BasePageView} BasePageView */
/** @typedef {import("preact").FunctionComponent} FunctionComponent */

/**
 * @typedef {Object} EntryView
 * @prop {number} year
 * @prop {number} month
 * @prop {number} day
 * @prop {string} slug
 * @prop {FunctionComponent} body
 */

/**
 * @typedef {BasePageView & EntryView} EntryPageView
 */

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {string} params.slug
 * @param {string} [params.fingerprint]
 * @param {URL} [params.entriesBaseURL]
 * @returns {Promise<EntryPageView>}
 */
export async function getEntryPageView(blog, params) {
  const { entriesBaseURL, fingerprint, slug } = params;

  const { createdAt, title } = getEntry(blog, { slug });
  const { day, month, year } = getEntryDateParams(createdAt);

  const entryModule = await importEntry({
    baseURL: entriesBaseURL,
    day,
    month,
    year,
    slug,
  });

  return {
    ...getBasePageView(blog, { fingerprint, pageHeading: title }),
    body: entryModule.body,
    day,
    month,
    year,
    slug,
  };
}
