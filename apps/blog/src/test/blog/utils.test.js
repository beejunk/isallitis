import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { getBlogPath, html } from "../../blog/utils.js";

describe("getBlogPath()", () => {
  test("should return the expected path", () => {
    /** @type {import("../../blog/blog.js").BlogPathParams} */
    const params = {
      year: 2024,
      month: 8,
      day: 21,
      slug: "entry-slug",
    };
    const expected = "/years/2024/months/8/days/21/entries/entry-slug";

    const actual = getBlogPath(params);

    assert.equal(actual, expected);
  });

  test("html", () => {
    const expected = "<p>Test Paragraph 1</p> <p>Test Paragraph 2</p>";

    const actual = html`
      <p>Test Paragraph 1</p>
      <p>Test Paragraph ${2}</p>
    `;

    assert.equal(actual, expected);
  });
});
