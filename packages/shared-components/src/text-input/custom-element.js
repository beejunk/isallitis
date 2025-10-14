import { CustomElement } from "../custom-element.js";
import { styles, shadowHTML, TAG } from "./template.js";
import { createStyleSheet } from "../custom-element.js";

const styleSheet = createStyleSheet(styles);

export class TextInput extends CustomElement {
  static styles = [styleSheet];

  render() {
    return shadowHTML();
  }
}

CustomElement.define(TAG, TextInput);
