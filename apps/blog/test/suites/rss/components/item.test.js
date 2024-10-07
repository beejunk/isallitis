import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { renderToString } from "preact-render-to-string";
import { html } from "htm/preact";
import { Item } from "../../../../src/rss/components/item.js";

const TITLE = "Test Item Title";

const DESCRIPTION = "<h1>Test Item Description</h1>";

describe("item()", () => {
  test("should throw an error if neither title nor description are present", () => {
    assert.throws(() => {
      renderToString(html`<${Item} />`);
    });
  });

  test("should render an item element with a title sub-element", () => {
    const expected = `<item><title>${TITLE}</title></item>`;

    const actual = renderToString(html`<${Item} title=${TITLE} />`);

    assert.equal(actual, expected);
  });

  test("should render an item element with a description sub-element", () => {
    const expected = `<item><description><![CDATA[${DESCRIPTION}]]></description></item>`;

    const actual = renderToString(html`<${Item} description=${DESCRIPTION} />`);

    assert.equal(actual, expected);
  });

  test("should render an item element with both a title and a description sub-element", () => {
    const expected = `<item><title>${TITLE}</title><description><![CDATA[${DESCRIPTION}]]></description></item>`;

    const actual = renderToString(
      html`<${Item} description=${DESCRIPTION} title=${TITLE} />`,
    );

    assert.equal(actual, expected);
  });

  test("should render an item element with a link sub-element", () => {
    const itemLink = new URL("https://test.blog.com/blog-entry");
    const expected = `<item><title>${TITLE}</title><link>${itemLink}</link></item>`;

    const actual = renderToString(
      html`<${Item} link=${itemLink} title=${TITLE} />`,
    );

    assert.equal(actual, expected);
  });
});
