import { BLOG_ENTRY, BlogEntrySchema } from "../schemas.js";
import { getEntityById } from "./entity.js";

/** @typedef {import("../schemas.js").Blog} Blog */
/** @typedef {import("../schemas.js").BlogDay} BlogDay */
/** @typedef {import("../schemas.js").BlogQueryParams} BlogQueryParams */

/**
 * @param {Blog} blog
 * @param {number} id
 */
function getEntryById(blog, id) {
  return BlogEntrySchema.parse(getEntityById(blog, { id, type: BLOG_ENTRY }));
}

/**
 * @param {Blog} blog
 * @param {string} slug
 */
export function getEntryBySlug(blog, slug) {
  return BlogEntrySchema.parse(
    blog.entities.entry.find((entryEntity) => entryEntity.slug === slug),
  );
}

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {number} [params.id]
 * @param {string} [params.slug]
 */
export function getEntry(blog, params) {
  const { id, slug } = params;

  if (typeof id === "number" && slug) {
    throw new Error(
      "Use only one of `id` or `slug` when querying for entries.",
    );
  }

  if (typeof id === "number") {
    return getEntryById(blog, id);
  }

  if (slug) {
    return getEntryBySlug(blog, slug);
  }

  throw new Error(
    "One of `slug` or `id` must be provided when querying for entries.",
  );
}
