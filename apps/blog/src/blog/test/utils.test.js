import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { getBlogEntry } from "../utils.js";

/** @typedef {[number, number, number, number, number]} DateArgs */

describe("getBlogEntry()", () => {
  test("returns the blog entry with the expected date", () => {
    /** @type DateArgs */
    const dateArgs = [2024, 7, 18, 11, 52];
    const expectedDate = new Date(...dateArgs);

    const entry = getBlogEntry(2024, 7, 18, 11, 52);

    assert.equal(entry?.date.getTime(), expectedDate.getTime());
  });
});
