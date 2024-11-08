import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  compileRouteMap,
  getBlogEntryRoute,
} from "../../../src/routes/routes.js";
import { mockBlog } from "../../fixtures/mock-blog.js";
import { getBlogDates, getEntry } from "../../../src/models/queries/entry.js";
import path from "node:path";

describe("createRouteMap()", () => {
  const entriesBaseURL = new URL(
    path.join("..", "..", "fixtures", "entries"),
    import.meta.url,
  );

  test("it should return an entry for the provided path", async () => {
    const routeMap = await compileRouteMap(mockBlog, { entriesBaseURL });

    const { createdAt, slug } = getEntry(mockBlog, { id: 1 });
    const entryDate = new Date(createdAt);
    const day = entryDate.getDate();
    const month = entryDate.getMonth() + 1;
    const year = entryDate.getFullYear();

    const path = getBlogEntryRoute({ year, month, day, slug });
    const entry = routeMap.get(path);

    assert.ok(entry);
  });

  test("it should create routes for each year with entries", async () => {
    const routeMap = await compileRouteMap(mockBlog, { entriesBaseURL });
    const blogDates = getBlogDates(mockBlog);
    const years = Object.values(blogDates.years).map(({ year }) => year);

    years.forEach((year) => {
      const route = routeMap.get(`/year/${year}`);
      assert.equal(route?.slug, year.toString());
    });
  });

  test("it should create routes for each month with entries", async () => {
    const routeMap = await compileRouteMap(mockBlog, { entriesBaseURL });
    const { months } = getBlogDates(mockBlog);

    Object.values(months).forEach(({ month, year }) => {
      const route = routeMap.get(`/year/${year}/month/${month}`);
      assert.equal(route?.slug, month.toString());
    });
  });

  test("it should create routes for each day with entries", async () => {
    const routeMap = await compileRouteMap(mockBlog, { entriesBaseURL });
    const { days } = getBlogDates(mockBlog);

    Object.values(days).forEach(({ day, month, year }) => {
      const route = routeMap.get(`/year/${year}/month/${month}/day/${day}`);
      assert.equal(route?.slug, day.toString());
    });
  });
});

describe("getBlogEntryRoute()", () => {
  test("should return the expected route", () => {
    /** @type {import("../../../src/routes/routes.js").RouteParams} */
    const params = {
      year: 2024,
      month: 8,
      day: 21,
      slug: "entry-slug",
    };
    const expected = "/year/2024/month/8/day/21/entry-slug";

    const actual = getBlogEntryRoute(params);

    assert.equal(actual, expected);
  });
});
