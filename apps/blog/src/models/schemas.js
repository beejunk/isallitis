import { z } from "zod";

/** @type {"entry"} */
export const BLOG_ENTRY = "entry";

/** @type {"day"} */
export const BLOG_DAY = "day";

/** @type {"month"} */
export const BLOG_MONTH = "month";

/** @type {"year"} */
export const BLOG_YEAR = "year";

/** @typedef {(
 *   | typeof BLOG_YEAR
 *   | typeof BLOG_MONTH
 *   | typeof BLOG_DAY
 *   | typeof BLOG_ENTRY
 * )} BlogEntityType
 */

export const BlogEntrySchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  dayId: z.number(),
  monthId: z.number(),
  yearId: z.number(),
  type: z.literal(BLOG_ENTRY),
});

/** @typedef {z.infer<typeof BlogEntrySchema>} BlogEntry */

export const BlogDaySchema = z.object({
  id: z.number(),
  day: z.number(),
  monthId: z.number(),
  yearId: z.number(),
  type: z.literal(BLOG_DAY),
});

/** @typedef {z.infer<typeof BlogDaySchema>} BlogDay */

export const BlogMonthSchema = z.object({
  id: z.number(),
  month: z.number(),
  yearId: z.number(),
  type: z.literal(BLOG_MONTH),
});

/** @typedef {z.infer<typeof BlogMonthSchema>} BlogMonth */

export const BlogYearSchema = z.object({
  id: z.number(),
  year: z.number(),
  type: z.literal(BLOG_YEAR),
});

/** @typedef {z.infer<typeof BlogYearSchema>} BlogYear */

export const BlogSchema = z.object({
  description: z.string(),
  title: z.string(),
  entities: z.object({
    year: z.array(BlogYearSchema),
    month: z.array(BlogMonthSchema),
    day: z.array(BlogDaySchema),
    entry: z.array(BlogEntrySchema),
  }),
});

/** @typedef {z.infer<typeof BlogSchema>} Blog */

/**
 * Used to validate that no other params are set in queries that use an `id`.
 */
export const IdParamSchema = z.object({
  id: z.number(),
  year: z.undefined(),
  month: z.undefined(),
  day: z.undefined(),
});

export const YearParamsSchema = z.object({
  year: z.number(),
});

export const MonthParamsSchema = YearParamsSchema.and(
  z.object({
    month: z.number(),
  }),
);

/** @typedef {BlogEntry | BlogDay | BlogMonth | BlogYear } BlogEntity */
export const DayParamsSchema = MonthParamsSchema.and(
  z.object({
    day: z.number(),
  }),
);

/**
 * @typedef {Object} BlogQueryParams
 * @prop {number} [id]
 * @prop {number} [year]
 * @prop {number} [month]
 * @prop {number} [day]
 */
