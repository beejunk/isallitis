import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { createRouteMap } from "../../../src/routes/routes.js";
import { getBlogPath } from "../../../src/utils/html-utils.js";
import { mockBlog } from "../../fixtures/mock-blog.js";

describe("createRouteMap()", () => {
  test("it should return an entry for the provided path", () => {
    const routeMap = createRouteMap(mockBlog, {
      hostname: "https://test.blog.com",
    });

    const params = {
      year: 2024,
      month: 8,
      day: 18,
      slug: "a-test-is-all-it-is",
    };
    const path = getBlogPath(params);
    const entry = routeMap.get(path);

    assert.ok(entry);
  });
});
