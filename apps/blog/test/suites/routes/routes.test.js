import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  compileRouteMap,
  getBlogEntryRoute,
} from "../../../src/routes/routes.js";
import { mockBlog } from "../../fixtures/mock-blog.js";
import { getEntry } from "../../../src/models/queries/entry.js";
import { getYear } from "../../../src/models/queries/year.js";
import { getDay } from "../../../src/models/queries/day.js";
import { getMonth } from "../../../src/models/queries/month.js";
import path from "node:path";

describe("createRouteMap()", () => {
  const entriesBaseURL = new URL(
    path.join("..", "..", "fixtures", "entries"),
    import.meta.url,
  );

  test("it should return an entry for the provided path", async () => {
    const routeMap = await compileRouteMap(mockBlog, { entriesBaseURL });

    const { dayId, monthId, slug, yearId } = getEntry(mockBlog, { id: 1 });
    const { day } = getDay(mockBlog, { id: dayId });
    const { month } = getMonth(mockBlog, { id: monthId });
    const { year } = getYear(mockBlog, { id: yearId });

    const path = getBlogEntryRoute({ year, month, day, slug });
    const entry = routeMap.get(path);

    assert.ok(entry);
  });

  test("it should create routes for each year with entries", async () => {
    const routeMap = await compileRouteMap(mockBlog, { entriesBaseURL });

    mockBlog.entities.year.forEach(({ year }) => {
      const route = routeMap.get(`/year/${year}`);
      assert.equal(route?.slug, year.toString());
    });
  });

  test("it should create routes for each month with entries", async () => {
    const routeMap = await compileRouteMap(mockBlog, { entriesBaseURL });

    mockBlog.entities.month.forEach(({ month, yearId }) => {
      const { year } = getYear(mockBlog, { id: yearId });
      const route = routeMap.get(`/year/${year}/month/${month}`);
      assert.equal(route?.slug, month.toString());
    });
  });

  test("it should create routes for each day with entries", async () => {
    const routeMap = await compileRouteMap(mockBlog, { entriesBaseURL });

    mockBlog.entities.day.forEach(({ day, monthId, yearId }) => {
      const { year } = getYear(mockBlog, { id: yearId });
      const { month } = getMonth(mockBlog, { id: monthId });
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
