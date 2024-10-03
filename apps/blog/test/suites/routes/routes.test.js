import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  compileRouteMap,
  getBlogEntryRoute,
} from "../../../src/routes/routes.js";
import { mockBlog } from "../../fixtures/mock-blog.js";

describe("createRouteMap()", () => {
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
});

describe("getBlogRoute()", () => {
  test("should return the expected route", () => {
    /** @type {import("../../../src/routes/routes.js").RouteParams} */
    const params = {
      year: 2024,
      month: 8,
      day: 21,
      slug: "entry-slug",
    };
    const expected = "/year/2024/month/8/day/21/entry/entry-slug";

    const actual = getBlogEntryRoute(params);

    assert.equal(actual, expected);
  });
});
