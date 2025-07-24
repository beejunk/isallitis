import { CustomElement } from "../custom-element.js";
import {
  shadowCSS,
  shadowHTML,
  isButtonVariation,
  TAG,
  isButtonRadius,
} from "./button-template.js";

export class Button extends CustomElement {
  styles = new CSSStyleSheet();

  get variation() {
    const variation = this.getAttribute("variation");

    if (isButtonVariation(variation)) {
      return variation;
    }

    return null;
  }

  get radius() {
    const variation = this.getAttribute("radius");

    if (isButtonRadius(variation)) {
      return variation;
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
    this.styles.replaceSync(
      shadowCSS({ radius: this.radius, variation: this.variation }),
    );

    return shadowHTML();
  }
}

CustomElement.define(TAG, Button);
