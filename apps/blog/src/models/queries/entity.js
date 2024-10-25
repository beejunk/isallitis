/** @typedef {import("../schemas.js").Blog} Blog */
/** @typedef {import("../schemas.js").BlogEntityType} BlogEntityType */
/** @typedef {import("../schemas.js").BlogEntity} BlogEntity */

/**
 * @param {Blog} blog
 * @param {Object} params
 * @param {BlogEntityType} params.type
 * @param {number} params.id
 * @returns {BlogEntity | undefined}
 */
export function getEntityById(blog, params) {
  const { id, type } = params;
  const entity = blog.entities[type]?.find((entity) => entity.id === id);

  return entity;
}
