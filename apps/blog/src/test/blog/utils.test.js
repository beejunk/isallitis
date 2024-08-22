import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { getBlogPath } from "../../blog/utils.js";

describe("getBlogPath()", () => {
  test("should return the expected path", () => {
    /** @type {import("../../blog/blog.js").BlogPathParams} */
    const params = {
      year: 2024,
      month: 8,
      day: 21,
      slug: "entry-slug",
    };
    const expected = "/years/2024/months/8/days/21/entries/entry-slug";

    const actual = getBlogPath(params);

    assert.equal(actual, expected);
  });
});
