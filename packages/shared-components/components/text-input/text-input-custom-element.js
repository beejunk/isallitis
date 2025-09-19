import { CustomElement } from "../custom-element.js";
import { styles, shadowHTML, TAG } from "./text-input-template.js";
import { createStyleSheet } from "../utils.js";

const styleSheet = createStyleSheet(styles);

export class TextInput extends CustomElement {
  static styles = [styleSheet];

  render() {
    return shadowHTML();
  }
}

CustomElement.define(TAG, TextInput);
