/**
 * @typedef {Object} CustomElementStaticMembers
 * @prop {string} TAG
 * @prop {function(): string} toString
 */

/**
 * @template Props
 * @typedef {(props: Props) => string} Template
 */

export class CustomElement extends HTMLElement {
  /**
   * @param {string} tag
   * @param {(CustomElementConstructor & Partial<CustomElementStaticMembers>)} NewCustomElement
   */
  static define(tag, NewCustomElement) {
    NewCustomElement.TAG = tag;
    NewCustomElement.toString = function toString() {
      return tag;
    };

    window.customElements.define(tag, NewCustomElement);
  }

  /**
   * Should be explicitly set to a new CSSStyleSheet as a default in custom elements
   * that are not using declarative shadow DOM and intend to have custom styles.
   *
   * @type {(CSSStyleSheet | null)}
   */
  styles = null;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      const innerHTML = this.render();
      const shadow = this.attachShadow({ mode: "open" });

      if (innerHTML) {
        shadow.innerHTML = innerHTML;
      }

      if (this.styles) {
        shadow.adoptedStyleSheets.push(this.styles);
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

    if (el instanceof CustomElementClass) {
      return el;
    }

    throw new Error(
      `Could not find element that is an instance of ${CustomElementClass}`,
    );
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
      throw new Error("Unable to find `<CustomElement>` shadow root.");
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
