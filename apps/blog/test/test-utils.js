import { JSDOM } from "jsdom";
import { within } from "@testing-library/dom";

/**
 * @param {string} html
 */
export function getScreen(html) {
  const dom = new JSDOM(html);

  return within(dom.window.document.body);
}
