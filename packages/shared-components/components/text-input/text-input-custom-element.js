import { CustomElement } from "../custom-element.js";
import { shadowCSS, shadowHTML, TAG } from "./text-input-template.js";

export class TextInput extends CustomElement {
  static tag = TAG;

  static toString() {
    return TAG;
  }

  styles = new CSSStyleSheet();

  render() {
    this.styles.replaceSync(shadowCSS());

    return shadowHTML();
  }
}

CustomElement.define(TAG, TextInput);
