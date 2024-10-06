import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  compileRouteMap,
  getBlogEntryRoute,
} from "../../../src/routes/routes.js";
import { mockBlog } from "../../fixtures/mock-blog.js";
import { blogData, blogSignal } from "../../../src/blog/signals/signals.js";

describe("createRouteMap()", () => {
  blogSignal.value = mockBlog;

  test("it should return an entry for the provided path", () => {
    const routeMap = compileRouteMap(mockBlog, {
      hostname: "https://test.blog.com",
    });

    const params = {
      year: 2024,
      month: 8,
      day: 18,
      slug: "a-test-is-all-it-is",
    };
    const path = getBlogEntryRoute(params);
    const entry = routeMap.get(path);

    assert.ok(entry);
  });

  test("it should create routes for each year with entries", () => {
    const routeMap = compileRouteMap(mockBlog, {
      hostname: "https://test.blog.com",
    });

    blogData.value.sortedEntries.forEach((entry) => {
      const route = routeMap.get(`/year/${entry.year}`);
      assert.equal(route?.slug, entry.year.toString());
    });
  });

  test("it should create routes for each month with entries", () => {
    const routeMap = compileRouteMap(mockBlog, {
      hostname: "https://test.blog.com",
    });

    blogData.value.sortedEntries.forEach((entry) => {
      const route = routeMap.get(`/year/${entry.year}/month/${entry.month}`);
      assert.equal(route?.slug, entry.month.toString());
    });
  });

  test("it should create routes for each day with entries", () => {
    const routeMap = compileRouteMap(mockBlog, {
      hostname: "https://test.blog.com",
    });

    blogData.value.sortedEntries.forEach((entry) => {
      const route = routeMap.get(
        `/year/${entry.year}/month/${entry.month}/day/${entry.day}`,
      );
      assert.equal(route?.slug, entry.day.toString());
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
