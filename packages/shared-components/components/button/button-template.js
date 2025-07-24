import { tag, html, css } from "../utils.js";

export const TAG = tag`button`;

/**
 * @typedef {Object} ButtonTemplateProps
 * @prop {string} label
 */

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

/**
 * @param {(ButtonRadius | null)} radius
 * @returns {string}
 */
function getRadiusStyle(radius) {
  switch (radius) {
    case RADIUS_SIZES.small:
      return `var(--base-size)`;
    case RADIUS_SIZES.large:
      return `calc(var(--base-size) * 3)`;
    case RADIUS_SIZES.round:
      return "50%";
    default:
      return `calc(var(--base-size) * 2)`;
  }
}

/**
 * @param {Object} props
 * @param {(ButtonVariation | null)} props.variation
 * @param {(ButtonRadius | null)} props.radius
 * @returns {string}
 */
export function shadowCSS({ variation = "default", radius }) {
  const radiusStyle = getRadiusStyle(radius);
  const paddingMultiplier = radius === "round" ? 3 : 2;

  const shared = css`
    :host {
      display: block;
    }

    button {
      cursor: pointer;
      display: inline-block;
      padding: calc(var(--base-size) * ${paddingMultiplier});
    }
  `;

  if (variation === "icon") {
    return css`
      ${shared}
      button {
        border: none;
        background: none;
      }
    `;
  }

  return css`
    ${shared}
    button {
      border: 1px solid var(--color-primary);
      border-radius: ${radiusStyle};
      background-color: var(--color-primary);
      font-size: var(--base-font-size);
    }
  `;
}

/**
 * @returns {string}
 */
export function shadowHTML() {
  return html`
    <button>
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
