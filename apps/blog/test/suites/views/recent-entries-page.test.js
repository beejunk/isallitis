import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { mockBlog } from "../../fixtures/mock-blog.js";
import { getRecentEntriesPageView } from "../../../src/views/recent-entries-page.js";

describe("getRecentEntriesPageView()", () => {
  test("should return most recent entry first", () => {
    const lastEntry =
      mockBlog.entities.entry[mockBlog.entities.entry.length - 1];
    const actual = getRecentEntriesPageView(mockBlog);

    assert.equal(lastEntry.slug, actual.entries[0].slug);
  });
});
