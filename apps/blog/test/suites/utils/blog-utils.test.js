import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { mockBlog } from "../../fixtures/mock-blog.js";
import { reduceToEntryData } from "../../../src/utils/blog-utils.js";

describe("reduceToEntryData()", () => {
  test("should create an array with an element for each blog entry", () => {
    const entryData = reduceToEntryData(mockBlog);

    assert.equal(entryData.length, 2);
  });

  test("should create entries in the expected data format", () => {
    const expected = {
      year: 2024,
      month: 8,
      day: 18,
      slug: "a-test-is-all-it-is",
      title: "A Test Is All It Is",
      body: "<p>A test is all it is</p>",
    };

    const [actual] = reduceToEntryData(mockBlog);

    assert.deepEqual(actual, expected);
  });
});
