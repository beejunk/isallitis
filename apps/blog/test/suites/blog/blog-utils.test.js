import assert from "node:assert/strict";
import { describe, test } from "node:test";
import path from "node:path";
import { importEntry } from "../../../src/blog/blog-utils.js";

describe("importEntry()", () => {
  const baseURL = new URL(
    path.join("..", "..", "fixtures", "entries"),
    import.meta.url,
  );

  test("should import the expected entry module", async () => {
    const entry = await importEntry({
      baseURL,
      year: 2024,
      month: 10,
      day: 12,
      slug: "test-entry-1",
    });

    assert.equal(entry.slug, "test-entry-1");
  });
});
