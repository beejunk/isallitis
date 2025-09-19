const SUFFIX = "is-all-it-is";

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
 * @param {string} cssStr
 * @returns {CSSStyleSheet}
 */
export function createStyleSheet(cssStr) {
  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(cssStr);

  return styleSheet;
}
