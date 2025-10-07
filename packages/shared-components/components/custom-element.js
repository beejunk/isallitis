import { defaultStyles } from "./default-styles.js";
import { createStyleSheet } from "./utils.js";

/**
 * @typedef {Object} CustomElementStaticMembers
 * @prop {string} TAG
 * @prop {function(): string} toString - Returns the TAG for the CustomElement.
 *   This allows for using the CustomElement class in an HTML template string, e.g.
 *   `<${MyElement}>Text Content</${MyElement>`.
 * @prop {Array<CSSStyleSheet>} styles
 */

/**
 * @template Props
 * @typedef {(props: Props) => string} Template
 */

/**
 * @param {Function} clsConstructor
 * @returns {clsConstructor is Pick<CustomElementStaticMembers, "styles">}
 */
function hasStyles(clsConstructor) {
  if (Object.hasOwn(clsConstructor, "styles")) {
    return true;
  }

  return false;
}

/**
 * @template CustomElementInstance
 * @param {unknown} instance
 * @param {new (...args: any[]) => CustomElementInstance} CustomElementClass
 * @returns {asserts instance is CustomElementInstance}
 */
function assertElementClass(instance, CustomElementClass) {
  if (!(instance instanceof CustomElementClass)) {
    throw new Error(`Element is not an instance of ${CustomElementClass}.`);
  }
}

/**
 * @param {(CustomElementConstructor & Partial<CustomElementStaticMembers>)} NewCustomElement
 * @returns {asserts NewCustomElement is (CustomElementConstructor & CustomElementStaticMembers)}
 */
function assertHasStaticMembers(NewCustomElement) {
  const hasAllStaticMembers =
    typeof NewCustomElement.TAG === "string" &&
    typeof NewCustomElement.toString === "function" &&
    Array.isArray(NewCustomElement.styles);

  if (!hasAllStaticMembers) {
    throw new Error("New CustomElement is missing required static members.");
  }
}

const defaultSheet = createStyleSheet(defaultStyles);

export class CustomElement extends HTMLElement {
  /**
   * @template CustomElementInstance
   * @param {new (...args: any[]) => CustomElementInstance} CustomElementClass
   * @returns {CustomElementInstance}
   */
  static createElement(CustomElementClass) {
    const newElement = document.createElement(`${CustomElementClass}`);

    assertElementClass(newElement, CustomElementClass);

    return newElement;
  }

  /**
   * @param {string} tag
   * @param {(CustomElementConstructor & Partial<CustomElementStaticMembers>)} NewCustomElement
   * @returns {(CustomElementConstructor & CustomElementStaticMembers)}
   */
  static define(tag, NewCustomElement) {
    NewCustomElement.TAG = tag;
    NewCustomElement.toString = function toString() {
      return tag;
    };

    assertHasStaticMembers(NewCustomElement);

    window.customElements.define(tag, NewCustomElement);

    return NewCustomElement;
  }

  /**
   * @type {Array<CSSStyleSheet>}
   */
  static styles = [];

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      const innerHTML = this.render();
      const shadow = this.attachShadow({ mode: "open" });
      const clsConstructor = this.constructor;

      shadow.adoptedStyleSheets.push(defaultSheet);

      if (hasStyles(clsConstructor)) {
        clsConstructor.styles.forEach((sheet) => {
          shadow.adoptedStyleSheets.push(sheet);
        });
      }

      if (innerHTML) {
        shadow.innerHTML = innerHTML;
      }
    }
  }

  /**
   * Convenience method for querying for any components that are instances of
   * the provided `CustomElement` class. Will throw if the element is not found.
   *
   * @template CustomElementInstance
   * @param {new (...args: any[]) => CustomElementInstance} CustomElementClass
   * @param {string} [customSelector]
   * @returns {CustomElementInstance}
   */
  getCustomElement(CustomElementClass, customSelector) {
    const selector = customSelector ?? `${CustomElementClass}`;
    const shadowRoot = this.getShadowRoot();
    const el =
      this.querySelector(selector) ?? shadowRoot.querySelector(selector);

    assertElementClass(el, CustomElementClass);

    return el;
  }

  /**
   * The same as `querySelector`, but will also query the shadow root of the
   * element. Will throw if no element is found.
   *
   * @param {string} selector
   */
  getSelector(selector) {
    const shadowRoot = this.getShadowRoot();
    const el =
      this.querySelector(selector) ?? shadowRoot.querySelector(selector);

    if (!el) {
      throw new Error(`Could not find element using selector \`${selector}\``);
    }

    return el;
  }

  /**
   * Return the shadow root of the custom element. Will throw if the shadow root
   * is not found.
   */
  getShadowRoot() {
    const shadowRoot = this.shadowRoot;

    if (!shadowRoot) {
      throw new Error(`Unable to find ${this} shadow root.`);
    }

    return shadowRoot;
  }

  /**
   * Convenience method for querying for any components that are instances of
   * the provided `CustomElement` class. Returns `null` if an instance of the element
   * class is not found.
   *
   * @template CustomElementInstance
   * @param {new (...args: any[]) => CustomElementInstance} CustomElementClass
   * @param {string} [customSelector]
   * @returns {(CustomElementInstance | null)}
   */
  queryCustomElement(CustomElementClass, customSelector) {
    const selector = customSelector ?? `${CustomElementClass}`;
    const shadowRoot = this.getShadowRoot();
    const el =
      this.querySelector(selector) ?? shadowRoot.querySelector(selector);

    if (el instanceof CustomElementClass) {
      return el;
    }

    return null;
  }

  /**
   * Should return the HTML for the custom element, or `null` if this element
   * has no inner HTML. This is also where any CSS should be applied to the
   * element's stylesheet.
   *
   * @example
   * class MyElement extends CustomElement {
   *   styles = new CSSStyleSheet();
   *
   *   render() {
   *     this.styles.replaceSync(css`p { color: red; }`);
   *     return html`<p>Hello, world.</p>`;
   *   }
   * }
   *
   * @returns {(string | null)}
   */
  render() {
    return null;
  }

  update() {
    const innerHTML = this.render();

    if (innerHTML && this.shadowRoot) {
      this.shadowRoot.innerHTML = innerHTML;
    }
  }
}
