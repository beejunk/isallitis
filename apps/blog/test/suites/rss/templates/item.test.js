import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { item } from "../../../../src/rss/templates/item.js";

const TITLE = "Test Item Title";

const DESCRIPTION = "<h1>Test Item Description</h1>";

describe("item()", () => {
  test("should throw an error if neither title nor description are present", () => {
    assert.throws(() => {
      item({});
    });
  });

  test("should render an item element with a title sub-element", () => {
    const expected = `<item><title>${TITLE}</title></item>`;

    const actual = item({ title: TITLE });

    assert.equal(actual, expected);
  });

  test("should render an item element with a description sub-element", () => {
    const expected = `<item><description><![CDATA[${DESCRIPTION}]]></description></item>`;

    const actual = item({ description: DESCRIPTION });

    assert.equal(actual, expected);
  });

  test("should render an item element with both a title and a description sub-element", () => {
    const expected = `<item><title>${TITLE}</title><description><![CDATA[${DESCRIPTION}]]></description></item>`;

    const actual = item({ description: DESCRIPTION, title: TITLE });

    assert.equal(actual, expected);
  });

  test("should render an item element with a link sub-element", () => {
    const itemLink = new URL("https://test.blog.com/blog-entry");
    const expected = `<item><title>${TITLE}</title><link>${itemLink}</link></item>`;

    const actual = item({ link: itemLink, title: TITLE });

    assert.equal(actual, expected);
  });
});
