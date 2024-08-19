import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { catalogue } from "../../blog/catalogue.js";
import { createHTMLMap } from "../../blog/html-map.js";
import { getBlogPath } from "../../blog/utils.js";

const htmlMap = createHTMLMap(catalogue);

describe("createHTMLMap", () => {
  test("it should return an entry for the provided path", () => {
    const path = getBlogPath(2024, 8, 18, 11, 52);
    const entry = htmlMap.get(path);

    console.log(entry);
    assert.ok(entry);
  });
});
