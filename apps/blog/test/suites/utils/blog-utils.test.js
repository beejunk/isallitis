import assert from "node:assert/strict";
import { describe, test } from "node:test";
import path from "node:path";
import { renderToString } from "preact-render-to-string";
import { html } from "htm/preact";
import { importEntry } from "../../../src/utils/blog-utils.js";

describe("importEntry()", () => {
  const baseURL = new URL(
    path.join("..", "..", "fixtures", "entries"),
    import.meta.url,
  );

  test("should import the expected entry module", async () => {
    const entry = await importEntry({
      baseURL,
      year: 2024,
      month: 11,
      day: 8,
      slug: "test-entry-1",
    });

    assert.match(renderToString(html`<${entry.body} />`), /mock blog entry 1/i);
  });
});
