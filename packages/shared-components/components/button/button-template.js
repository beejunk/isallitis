import { tag, html, css } from "../utils.js";

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
 * @returns {attr is ButtonVariation}
 */
export function isButtonVariation(attr) {
  if (!attr) {
    return false;
  }

  return attr in VARIATIONS;
}

/**
 * @param {(string | null)} attr
 * @returns {attr is ButtonRadius}
 */
export function isButtonRadius(attr) {
  if (!attr) {
    return false;
  }

  return attr in RADIUS_SIZES;
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
    padding: var(--space-s);
  }

  button.icon {
    button {
      background: none;
      padding: var(--space-m);
    }
  }

  :focus {
    outline: solid calc(var(--space-s) / 2) var(--color-focus);
  }

  button:hover {
    background-color: var(--color-primary-hover);
  }
`;

/**
 * @param {Omit<ButtonTemplateProps, "label">} props
 * @returns {string}
 */
export function template(props) {
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
export function render({ label }) {
  return html`<${TAG}>${label}</${TAG}>`;
}
