import fs from "fs";
import prettier from "prettier";
import prettierXML from "@prettier/plugin-xml";
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { renderToString } from "preact-render-to-string";
import { html } from "htm/preact";
import { RSS } from "../../../../src/rss/components/rss.js";
import { blogSignal } from "../../../../src/blog/signals/signals.js";
import { mockBlog } from "../../../fixtures/mock-blog.js";

function getMockRSSFeed() {
  return fs.readFileSync(
    new URL("../../../fixtures/mock-rss.xml", import.meta.url),
    "utf8",
  );
}

function renderAndFormat() {
  return prettier.format(renderToString(html`<${RSS} />`), {
    parser: "xml",
    plugins: [prettierXML],
    xmlWhitespaceSensitivity: "ignore",
  });
}

describe("channel()", () => {
  const mockRSSFeed = getMockRSSFeed();
  blogSignal.value = mockBlog;

  test("should match expected RSS format", async () => {
    const actual = await renderAndFormat();

    assert.equal(actual, mockRSSFeed);
  });
});
