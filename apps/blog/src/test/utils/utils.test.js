import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  condenseWhitespace,
  getBlogPath,
  html,
} from "../../utils/html-utils.js";

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
});

describe("html()", () => {
  test("should handle text with no embedded expressions", () => {
    const expected = `
      <p>Test Paragraph 1</p>
      <p>Test Paragraph 2</p>
    `;

    const actual = html`
      <p>Test Paragraph 1</p>
      <p>Test Paragraph 2</p>
    `;

    assert.equal(actual, expected);
  });

  test("should handle embedded expressions that are strings", () => {
    const expected = `
      <p>Test Paragraph 1</p>
      <p>Test Paragraph two</p>
    `;

    const actual = html`
      <p>Test Paragraph 1</p>
      <p>Test Paragraph ${"two"}</p>
    `;

    assert.equal(actual, expected);
  });

  test("should handle embedded expressions that are numbers", () => {
    const expected = `
      <p>Test Paragraph 1</p>
      <p>Test Paragraph 2</p>
    `;

    const actual = html`
      <p>Test Paragraph 1</p>
      <p>Test Paragraph ${2}</p>
    `;

    assert.equal(actual, expected);
  });

  test("should handle embedded expressions that are arrays", () => {
    const expected = `
      <ul>
        <li>Test Paragraph 1</li><li>Test Paragraph 2</li><li>Test Paragraph 3</li>
      </ul>
    `;

    const actual = html`
      <ul>
        ${[
          html`<li>Test Paragraph 1</li>`,
          html`<li>Test Paragraph 2</li>`,
          html`<li>Test Paragraph 3</li>`,
        ]}
      </ul>
    `;

    assert.equal(actual, expected);
  });
});

describe("condenseWhitespace()", () => {
  test("should replace all extended whitespace with single spaces.", () => {
    const expected = `<p>Test Paragraph 1</p> <p>Test Paragraph 2</p>`;

    const actual = condenseWhitespace(html`
      <p>Test Paragraph 1</p>
      <p>Test Paragraph ${2}</p>
    `);

    assert.equal(actual, expected);
  });
});
