import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { mockBlog } from "../../fixtures/mock-blog.js";
import { getYear } from "../../../src/models/queries/year.js";
import { getYearPageView } from "../../../src/views/year-page.js";

describe("getYearView()", () => {
  test("should return entries written in the indicated year", () => {
    const testYear = 2024;
    const year = getYear(mockBlog, { year: testYear });
    const yearEntities = mockBlog.entities.year.filter(
      ({ id }) => id === year.id,
    );

    const actual = getYearPageView(mockBlog, { year: testYear });

    actual.entries.forEach((entry) => {
      assert.ok(
        yearEntities.find((yearEntity) => entry.year === yearEntity.year),
      );
    });
  });
});
