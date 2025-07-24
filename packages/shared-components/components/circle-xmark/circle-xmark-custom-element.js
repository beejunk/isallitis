import { CustomElement } from "../custom-element.js";
import { shadowCSS, shadowHTML, TAG } from "./circle-xmark-template.js";

export class CircleXMark extends CustomElement {
  static tag = TAG;

  static toString() {
    return TAG;
  }

  styles = new CSSStyleSheet();

  /**
   * @returns {import("./circle-xmark-template.js").CircleXMarkProps}
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

CustomElement.define(TAG, CircleXMark);
