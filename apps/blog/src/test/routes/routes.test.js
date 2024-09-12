import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { createRouteMap } from "../../routes/routes.js";
import { getBlogPath } from "../../utils/html-utils.js";
import { mockBlog } from "../../mock-data/mock-blog.js";

describe("createRouteMap()", () => {
  test("it should return an entry for the provided path", () => {
    const routeMap = createRouteMap(mockBlog);

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
