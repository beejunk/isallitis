import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { createHTMLMap } from "../../blog/html-map.js";
import { getBlogPath } from "../../utils/html-utils.js";

/** @type {import("../../blog/blog.js").Blog} */
const blog = {
  title: "Test Blog",
  years: {
    2024: {
      year: 2024,
      months: {
        8: {
          month: 8,
          days: {
            18: {
              day: 18,
              entries: {
                "a-test-is-all-it-is": {
                  slug: "a-test-is-all-it-is",
                  title: "A Test Is All It Is",
                  body: "<p>A test is all it is</p>",
                  hour: 18,
                  minute: 20,
                },
              },
            },
          },
        },
      },
    },
  },
};

describe("createHTMLMap", () => {
  const htmlMap = createHTMLMap(blog);

  test("it should return an entry for the provided path", () => {
    const params = {
      year: 2024,
      month: 8,
      day: 18,
      slug: "a-test-is-all-it-is",
    };
    const path = getBlogPath(params);
    const entry = htmlMap.get(path);

    assert.ok(entry);
  });
});
