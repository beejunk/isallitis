export const SUFFIX = "is-all-it-is";

/**
 * @param {TemplateStringsArray} strings
 * @returns {string}
 */
export function tag(strings) {
  return `${strings.join("")}-${SUFFIX}`;
}

export const html = String.raw;

export const css = String.raw;

/**
 * @template ValidAttrValues
 * @param {ValidAttrValues} validAttrValues
 * @param {(string | null)} attrValue
 * @returns {attrValue is keyof ValidAttrValues}
 */
export function isValidAttribute(validAttrValues, attrValue) {
  return (
    typeof attrValue === "string" &&
    typeof validAttrValues === "object" &&
    validAttrValues !== null &&
    Object.hasOwn(validAttrValues, attrValue)
  );
}

/**
 * @template ValidAttrValues
 * @param {ValidAttrValues} validAttrValues
 * @param {(string | null)} attrValue
 * @returns {(keyof ValidAttrValues | null)}
 */
export function parseAttribute(validAttrValues, attrValue) {
  if (isValidAttribute(validAttrValues, attrValue)) {
    return attrValue;
  }

  return null;
}
