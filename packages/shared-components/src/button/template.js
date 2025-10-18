import { tag, html, css, isValidAttribute } from "../utils.js";

export const TAG = tag`button`;

const VARIATIONS = {
  /** @type {"default"} */
  default: "default",

  /** @type {"icon"} */
  icon: "icon",
};

const RADIUS_SIZES = {
  /** @type {"small"} */
  small: "small",

  /** @type {"medium"} */
  medium: "medium",

  /** @type {"large"} */
  large: "large",

  /** @type {"round"} */
  round: "round",
};

/** @typedef {keyof typeof VARIATIONS} ButtonVariation */

/** @typedef {keyof typeof RADIUS_SIZES} ButtonRadius */

/**
 * @typedef {Object} ButtonTemplateProps
 * @prop {string} label
 * @prop {(ButtonVariation | null)} [variation="default"]
 * @prop {(ButtonRadius | null)} [radius="radius-small"]
 */

/**
 * @param {(string | null)} attr
 */
export function isButtonVariation(attr) {
  return isValidAttribute(VARIATIONS, attr);
}

/**
 * @param {(string | null)} attr
 */
export function isButtonRadius(attr) {
  return isValidAttribute(RADIUS_SIZES, attr);
}

export const styles = css`
  :host {
    display: block;
  }

  button {
    border: none;
    cursor: pointer;
    background-color: var(--color-primary);
    display: inline-block;
    font-size: var(--text-m);
  }

  button:not(.icon) {
    padding: var(--space-s);
  }

  button.icon:not(.radius-round) {
    /*
      Assume background should be removed only if radius is not set to round.
      TODO: This should be handled with a variation.
    */
    background-color: transparent;
  }

  button.radius-round {
    aspect-ratio: 1;
    padding: 0 var(--space-s);
  }

  :focus {
    outline: solid calc(var(--space-s) / 2) var(--color-focus);
  }

  button:hover:not(.icon) {
    background-color: var(--color-primary-hover);
  }
`;

/**
 * @param {Omit<ButtonTemplateProps, "label">} props
 * @returns {string}
 */
export function shadowHTML(props) {
  const variation = props.variation ?? "default";
  const radius = props.radius ?? "small";

  return html`
    <button class="${variation} radius-${radius}">
      <slot></slot>
    </button>
  `;
}

/**
 * @param {ButtonTemplateProps} props
 * @returns {string}
 */
export function render({ label, variation }) {
  return html`<${TAG} variation=${variation}>${label}</${TAG}>`;
}
