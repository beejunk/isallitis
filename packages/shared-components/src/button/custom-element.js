import { CustomElement, createStyleSheet } from "../custom-element.js";
import {
  styles,
  template,
  isButtonVariation,
  TAG,
  isButtonRadius,
} from "./template.js";
import { radiusSheet } from "../styles/style-sheets.js";

const styleSheet = createStyleSheet(styles);

export class Button extends CustomElement {
  static styles = [radiusSheet, styleSheet];

  get variation() {
    const variation = this.getAttribute("variation");

    if (isButtonVariation(variation)) {
      return variation;
    }

    return null;
  }

  get radius() {
    const radius = this.getAttribute("radius");

    if (isButtonRadius(radius)) {
      return radius;
    }

    return null;
  }

  /**
   * @param {(e: Event) => void} handler
   */
  addClickEventListener(handler) {
    const button = this.getSelector("button");
    button.addEventListener("click", handler);
  }

  render() {
    return template({ variation: this.variation, radius: this.radius });
  }
}

CustomElement.define(TAG, Button);
