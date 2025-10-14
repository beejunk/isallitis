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
