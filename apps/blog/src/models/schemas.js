import { z } from "zod";

/** @type {"entry"} */
export const BLOG_ENTRY = "entry";

/**
 * @typedef {typeof BLOG_ENTRY} BlogEntityType
 */

export const BlogEntrySchema = z.object({
  createdAt: z.string().datetime(),
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  type: z.literal(BLOG_ENTRY),
});

/** @typedef {z.infer<typeof BlogEntrySchema>} BlogEntry */

export const BlogSchema = z.object({
  description: z.string(),
  title: z.string(),
  entities: z.object({
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

/** @typedef {BlogEntry} BlogEntity */

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
