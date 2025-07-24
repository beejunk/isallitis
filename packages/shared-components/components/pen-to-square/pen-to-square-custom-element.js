import { CustomElement } from "../custom-element.js";
import { shadowCSS, shadowHTML, TAG } from "./pen-to-square-template.js";

export class PenToSquare extends CustomElement {
  static tag = TAG;

  static toString() {
    return TAG;
  }

  styles = new CSSStyleSheet();

  /**
   * @returns {import("./pen-to-square-template.js").PenToSquareProps}
   */
  getProps() {
    return {
      width: this.getAttribute("width"),
    };
  }

  render() {
    this.styles.replaceSync(shadowCSS({ fill: this.getAttribute("fill") }));

    return shadowHTML(this.getProps());
  }
}

CustomElement.define(TAG, PenToSquare);
