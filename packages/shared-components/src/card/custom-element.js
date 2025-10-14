import { CustomElement } from "../custom-element.js";
import { styles, shadowHTML, TAG } from "./template.js";
import { createStyleSheet } from "../custom-element.js";

const styleSheet = createStyleSheet(styles);

export class Card extends CustomElement {
  static styles = [styleSheet];

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
    return shadowHTML();
  }
}

CustomElement.define(TAG, Card);
