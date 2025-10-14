import { describe, test } from "node:test";
import assert from "node:assert";
import { isValidAttribute, parseAttribute } from "../src/utils.js";

describe("Shared component utils", () => {
  const VALID_ATTRS = {
    /** @type {"primary"} */
    primary: "primary",

    /** @type {"secondary"} */
    secondary: "secondary",
  };

  describe("isValidAttribute()", () => {
    test("should return `true` when attribute object contains the provided string", () => {
      assert.equal(isValidAttribute(VALID_ATTRS, "primary"), true);
    });
  });

  describe("parseAttribute()", () => {
    test("should return attribute value when attribute object contains the provided string", () => {
      assert.equal(parseAttribute(VALID_ATTRS, "primary"), "primary");
    });

    test("should return `null` when attribute object does not contain the provided string", () => {
      assert.equal(parseAttribute(VALID_ATTRS, "invalid-attr-value"), null);
    });
  });
});
