import {
  BLOG_MONTH,
  BlogMonthSchema,
  IdParamSchema,
  MonthParamsSchema,
} from "../schemas.js";
import { getEntityById } from "./entity.js";
import { getYearByDate } from "./year.js";

/** @typedef {import("../schemas.js").Blog} Blog */
/** @typedef {import("../schemas.js").BlogMonth} BlogMonth */
/** @typedef {import("../schemas.js").BlogQueryParams} BlogQueryParams */

/**
 * @param {Blog} blog
 * @param {number} id
 */
function getMonthById(blog, id) {
  return BlogMonthSchema.parse(getEntityById(blog, { id, type: BLOG_MONTH }));
}

/**
 * @param {Blog} blog
 * @param {number} year
 * @param {number} month
 */
export function getMonthByYear(blog, year, month) {
  const yearEntity = getYearByDate(blog, year);

  return BlogMonthSchema.parse(
    blog.entities.month.find(
      (monthEntity) =>
        monthEntity.month === month && monthEntity.yearId === yearEntity.id,
    ),
  );
}

/**
 * @param {Blog} blog
 * @param {Pick<BlogQueryParams, "id" | "month" | "year">} params
 * @returns {BlogMonth}
 */
export function getMonth(blog, params) {
  const idParamResult = IdParamSchema.safeParse(params);

  if (idParamResult.success) {
    return getMonthById(blog, idParamResult.data.id);
  } else if (params.id !== undefined) {
    throw idParamResult.error;
  }

  const { year, month } = MonthParamsSchema.parse(params);

  return getMonthByYear(blog, year, month);
}
