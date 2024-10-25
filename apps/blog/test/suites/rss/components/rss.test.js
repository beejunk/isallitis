import fs from "fs";
import prettier from "prettier";
import prettierXML from "@prettier/plugin-xml";
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { renderToString } from "preact-render-to-string";
import { html } from "htm/preact";
import { RSS } from "../../../../src/rss/components/rss.js";
import { mockBlog } from "../../../fixtures/mock-blog.js";
import { getRSSView } from "../../../../src/views/views.js";
import path from "node:path";

const entriesBaseURL = new URL(
  path.join("..", "..", "..", "fixtures", "entries"),
  import.meta.url,
);

function getMockRSSFeed() {
  return fs.readFileSync(
    new URL("../../../fixtures/mock-rss.xml", import.meta.url),
    "utf8",
  );
}

async function renderAndFormat() {
  const rssView = await getRSSView(mockBlog, {
    entriesBaseURL,
    hostname: "https://test.blog.com",
  });

  return prettier.format(renderToString(html`<${RSS} ...${rssView} />`), {
    parser: "xml",
    plugins: [prettierXML],
    xmlWhitespaceSensitivity: "ignore",
  });
}

describe("channel()", () => {
  const mockRSSFeed = getMockRSSFeed();

  test("should match expected RSS format", async () => {
    const actual = await renderAndFormat();

    assert.equal(actual, mockRSSFeed);
  });
});
