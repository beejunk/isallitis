import {
  BLOG_DAY,
  BlogDaySchema,
  IdParamSchema,
  DayParamsSchema,
} from "../schemas.js";
import { getEntityById } from "./entity.js";
import { getMonthByYear } from "./month.js";

/** @typedef {import("../schemas.js").Blog} Blog */
/** @typedef {import("../schemas.js").BlogDay} BlogDay */
/** @typedef {import("../schemas.js").BlogQueryParams} BlogQueryParams */

/**
 * @param {Blog} blog
 * @param {number} id
 */
function getDayById(blog, id) {
  return BlogDaySchema.parse(getEntityById(blog, { id, type: BLOG_DAY }));
}

/**
 * @param {Blog} blog
 * @param {number} year
 * @param {number} month
 * @param {number} day
 */
export function getDayByDate(blog, year, month, day) {
  const monthEntity = getMonthByYear(blog, year, month);

  return BlogDaySchema.parse(
    blog.entities.day.find(
      (dayEntity) => monthEntity.month === month && dayEntity.day === day,
    ),
  );
}

/**
 * @param {Blog} blog
 * @param {BlogQueryParams} params
 * @returns {BlogDay}
 */
export function getDay(blog, params) {
  const idParamResult = IdParamSchema.safeParse(params);

  if (idParamResult.success) {
    return getDayById(blog, idParamResult.data.id);
  } else if (params.id !== undefined) {
    throw idParamResult.error;
  }

  const { year, month, day } = DayParamsSchema.parse(params);

  return getDayByDate(blog, year, month, day);
}
