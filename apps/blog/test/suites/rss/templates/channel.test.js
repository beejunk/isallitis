import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { renderToString } from "preact-render-to-string";
import { html } from "htm/preact";
import { Channel } from "../../../../src/rss/templates/channel.js";

describe("channel()", () => {
  test("should return a channel element with required sub-elements", () => {
    const feedTitle = "Test Blog Title";
    const feedURL = new URL("https://blog.test.com");
    const feedDescription = "Test blog description.";
    const expected = `<channel><title>${feedTitle}</title><link>${feedURL}</link><description>${feedDescription}</description></channel>`;

    const actual = renderToString(html`
      <${Channel}
        title=${feedTitle}
        link=${feedURL}
        description=${feedDescription}
      />
    `);

    assert.equal(actual, expected);
  });

  test("should return a channel element with required sub-elements and an item", () => {
    const itemTitle = "Test Item Title";
    const expectedItem = `<item><title>${itemTitle}</title></item>`;

    const feedTitle = "Test Blog Title";
    const feedURL = new URL("https://blog.test.com");
    const feedDescription = "Test blog description.";
    const expected = `<channel><title>${feedTitle}</title><link>${feedURL}</link><description>${feedDescription}</description>${expectedItem}</channel>`;

    const actual = renderToString(html`
      <${Channel}
        title=${feedTitle}
        link=${feedURL}
        description=${feedDescription}
        items=${[
          {
            title: itemTitle,
          },
        ]}
      />
    `);

    assert.equal(actual, expected);
  });
});
