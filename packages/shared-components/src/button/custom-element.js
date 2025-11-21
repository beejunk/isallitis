import * as v from "valibot";
import { CustomElement, createStyleSheet } from "../custom-element.js";
import {
  styles,
  shadowHTML,
  TAG,
  RadiusSizeSchema,
  VariationSchema,
  SizeSchema,
} from "./template.js";
import { radiusSheet } from "../styles/style-sheets.js";

const styleSheet = createStyleSheet(styles);

export class Button extends CustomElement {
  static styles = [radiusSheet, styleSheet];

  get variation() {
    return v.parse(VariationSchema, this.getAttribute("variation"));
  }

  get radius() {
    return v.parse(RadiusSizeSchema, this.getAttribute("radius"));
  }

  get size() {
    return v.parse(SizeSchema, this.getAttribute("size"));
  }

  /**
   * @param {(e: Event) => void} handler
   */
  addClickEventListener(handler) {
    const button = this.getSelector("button");
    button.addEventListener("click", handler);
  }

  render() {
    return shadowHTML({
      variation: this.variation,
      radius: this.radius,
      size: this.size,
    });
  }
}

CustomElement.define(TAG, Button);
