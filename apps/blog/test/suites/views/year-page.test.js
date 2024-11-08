import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { mockBlog } from "../../fixtures/mock-blog.js";
import { getYearPageView } from "../../../src/views/year-page.js";
import { getBlogDates } from "../../../src/models/queries/entry.js";

describe("getYearView()", () => {
  test("should return entries written in the indicated year", () => {
    const testYear = 2024;
    const blogDates = getBlogDates(mockBlog);
    const years = Object.values(blogDates.years).map(({ year }) => year);

    const actual = getYearPageView(mockBlog, { year: testYear });

    actual.entries.forEach((entry) => {
      assert.ok(years.find((year) => entry.year === year));
    });
  });
});
