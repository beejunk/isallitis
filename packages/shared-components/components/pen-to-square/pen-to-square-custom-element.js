import { CustomElement } from "../custom-element.js";
import { styles, shadowHTML, TAG } from "./pen-to-square-template.js";
import { createStyleSheet } from "../utils.js";
import { fillSheet } from "../style-sheets.js";

const styleSheet = createStyleSheet(styles);

export class PenToSquare extends CustomElement {
  static styles = [fillSheet, styleSheet];

  /**
   * @returns {import("./pen-to-square-template.js").PenToSquareProps}
   */
  getProps() {
    return {
      width: this.getAttribute("width"),
    };
  }

  render() {
    return shadowHTML(this.getProps());
  }
}

CustomElement.define(TAG, PenToSquare);
