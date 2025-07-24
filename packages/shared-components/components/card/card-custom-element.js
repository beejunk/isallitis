import { CustomElement } from "../custom-element.js";
import { shadowCSS, shadowHTML, TAG } from "./card-template.js";

export class Card extends CustomElement {
  static tag = TAG;

  static toString() {
    return TAG;
  }

  styles = new CSSStyleSheet();

  /**
   * @returns {import("./card-template.js").CardProps}
   */
  getProps() {
    return {
      maxWidth: this.getAttribute("max-width"),
      withHeader: this.hasHeader(),
    };
  }

  /**
   * @returns {boolean}
   */
  hasHeader() {
    for (const element of this.children) {
      if (element.slot === "header") {
        return true;
      }
    }

    return false;
  }

  render() {
    this.styles.replaceSync(shadowCSS(this.getProps()));

    return shadowHTML();
  }
}

CustomElement.define(TAG, Card);
