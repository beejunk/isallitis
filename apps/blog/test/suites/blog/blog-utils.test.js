import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { mockBlog } from "../../fixtures/mock-blog.js";
import {
  condenseWhitespace,
  html,
  reduceBlogToEntryData,
} from "../../../src/blog/blog-utils.js";

describe("reduceToEntryData()", () => {
  test("should create an array with an element for each blog entry", () => {
    const entryData = reduceBlogToEntryData(mockBlog);

    assert.equal(entryData.length, 2);
  });

  test("should create entries in the expected data format", () => {
    const expected = {
      year: 2024,
      month: 8,
      day: 18,
      hour: 18,
      minute: 20,
      slug: "a-test-is-all-it-is",
      title: "A Test Is All It Is",
      body: "<p>A test is all it is</p>",
    };

    const [actual] = reduceBlogToEntryData(mockBlog);

    assert.deepEqual(actual, expected);
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
