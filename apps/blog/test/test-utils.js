import prettier from "prettier";
import { renderToString } from "preact-render-to-string";
import { JSDOM } from "jsdom";
import { within } from "@testing-library/dom";

/**
 * Format the provided HTML string. Useful for debugging tests or generating
 * human-readable fixture data.
 *
 * @param {string} html
 * @param {import("prettier").Options["parser"]} [parser]
 * @returns {Promise<string>}
 */
export function format(html, parser = "html") {
  return prettier.format(html, { parser });
}

/**
 * Helper function to render static markup while still providing Testing Library
 * APIs for easy querying.
 *
 * @param {import("preact").VNode} node
 */
export function renderStatic(node) {
  const html = renderToString(node);
  const dom = new JSDOM(html);
  const screen = within(dom.window.document.body);

  return {
    document: dom.window.document,
    screen,
  };
}
