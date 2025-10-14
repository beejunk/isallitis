import { CustomElement } from "../custom-element.js";
import { styles, shadowHTML, TAG } from "./template.js";
import { createStyleSheet } from "../custom-element.js";
import { fillSheet } from "../styles/style-sheets.js";

const styleSheet = createStyleSheet(styles);

export class CircleXMark extends CustomElement {
  static styles = [fillSheet, styleSheet];

  /**
   * @returns {import("./template.js").CircleXMarkProps}
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
