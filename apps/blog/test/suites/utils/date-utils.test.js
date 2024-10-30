import { html } from "htm/preact";
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { toDate } from "../../../src/utils/date-utils.js";

describe("toDate()", () => {
  const entry = {
    year: 2024,
    month: 10,
    day: 15,
    hour: 10,
    minute: 25,
    title: "Test Title",
    slug: "test-title",
    body: () => html`<p>Test Body</p>`,
  };

  test("should create a date object in GMT with CST offset", () => {
    const expected = `Tue, 15 Oct 2024 15:25:00 GMT`;

    const actual = toDate(entry);

    assert.equal(actual.toUTCString(), expected);
  });

  test("should handle single digit date elements", () => {
    const expected = `Sun, 01 Sep 2024 13:05:00 GMT`;
    const entryWithSingleDigits = {
      ...entry,
      month: 9,
      day: 1,
      hour: 8,
      minute: 5,
    };

    const actual = toDate(entryWithSingleDigits);

    assert.equal(actual.toUTCString(), expected);
  });
});
