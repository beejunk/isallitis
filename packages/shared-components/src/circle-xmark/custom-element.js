import { CustomElement } from "../custom-element.js";
import { styles, shadowHTML, TAG, parseFillVariation } from "./template.js";
import { createStyleSheet } from "../custom-element.js";
import { fillSheet } from "../styles/style-sheets.js";

const styleSheet = createStyleSheet(styles);

export class CircleXMark extends CustomElement {
  static styles = [fillSheet, styleSheet];

  get fill() {
    return parseFillVariation(this.getAttribute("fill"));
  }

  /**
   * @returns {import("./template.js").CircleXMarkProps}
   */
  getProps() {
    return {
      fill: this.fill,
      width: this.getAttribute("width"),
    };
  }

  render() {
    return shadowHTML(this.getProps());
  }
}

CustomElement.define(TAG, CircleXMark);
