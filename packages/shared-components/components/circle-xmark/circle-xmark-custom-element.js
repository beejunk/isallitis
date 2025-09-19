import { CustomElement } from "../custom-element.js";
import { styles, shadowHTML, TAG } from "./circle-xmark-template.js";
import { createStyleSheet } from "../utils.js";
import { fillSheet } from "../style-sheets.js";

const styleSheet = createStyleSheet(styles);

export class CircleXMark extends CustomElement {
  static styles = [fillSheet, styleSheet];

  /**
   * @returns {import("./circle-xmark-template.js").CircleXMarkProps}
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

CustomElement.define(TAG, CircleXMark);
