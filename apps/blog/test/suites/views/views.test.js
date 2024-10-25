import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { getRecentEntriesView } from "../../../src/views/views.js";
import { mockBlog } from "../../fixtures/mock-blog.js";
import { getYear } from "../../../src/models/queries/year.js";

describe("getRecentEntriesView()", () => {
  test("should return most recent entry first", () => {
    const lastEntry =
      mockBlog.entities.entry[mockBlog.entities.entry.length - 1];
    const actual = getRecentEntriesView(mockBlog);

    assert.equal(lastEntry.slug, actual.entries[0].slug);
  });
});

describe("getYearView()", () => {
  test("should return entries written in the indicated year", () => {
    const testYear = 2024;
    const year = getYear(mockBlog, { year: testYear });
    const yearEntities = mockBlog.entities.year.filter(
      ({ id }) => id === year.id,
    );

    const actual = getRecentEntriesView(mockBlog);

    actual.entries.forEach((entry) => {
      assert.ok(
        yearEntities.find((yearEntity) => entry.year === yearEntity.year),
      );
    });
  });
});
