import {
  BLOG_YEAR,
  BlogYearSchema,
  IdParamSchema,
  YearParamsSchema,
} from "../schemas.js";
import { getEntityById } from "./entity.js";

/** @typedef {import("../schemas.js").Blog} Blog */
/** @typedef {import("../schemas.js").BlogYear} BlogYear */
/** @typedef {import("../schemas.js").BlogQueryParams} BlogQueryParams */

/**
 * @param {Blog} blog
 * @param {number} id
 */
export function getYearById(blog, id) {
  return BlogYearSchema.parse(getEntityById(blog, { id, type: BLOG_YEAR }));
}

/**
 * @param {Blog} blog
 * @param {number} year
 */
export function getYearByDate(blog, year) {
  return BlogYearSchema.parse(
    blog.entities.year.find((yearEntity) => yearEntity.year === year),
  );
}

/**
 * @param {Blog} blog
 * @param {Pick<BlogQueryParams, "id" | "year">} params
 * @returns {BlogYear}
 */
export function getYear(blog, params) {
  const idOnlyParams = IdParamSchema.safeParse(params);

  if (idOnlyParams.success) {
    return getYearById(blog, idOnlyParams.data.id);
  } else if (params.id !== undefined) {
    throw idOnlyParams.error;
  }

  const { year } = YearParamsSchema.parse(params);

  return getYearByDate(blog, year);
}
