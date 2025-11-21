import * as v from "valibot";
import { tag, html, css } from "../utils.js";

export const TAG = tag`button`;

const DEFAULT = "default";
const ICON = "icon";

const SMALL = "small";
const MEDIUM = "medium";
const LARGE = "large";
const ROUND = "round";

const SM = "sm";
const MD = "md";
const LG = "lg";

export const VariationSchema = v.nullish(
  v.enum({
    DEFAULT,
    ICON,
  }),
  DEFAULT,
);

export const RadiusSizeSchema = v.nullish(
  v.enum({
    SMALL,
    MEDIUM,
    LARGE,
    ROUND,
  }),
  SMALL,
);

export const SizeSchema = v.nullish(
  v.enum({
    SM,
    MD,
    LG,
  }),
  MD,
);

/** @typedef {import("valibot").InferInput<typeof VariationSchema>} ButtonVariation */

/** @typedef {import("valibot").InferInput<typeof RadiusSizeSchema>} ButtonRadius */

/** @typedef {import("valibot").InferInput<typeof SizeSchema>} ButtonSize */

/**
 * @typedef {Object} ButtonTemplateProps
 * @prop {string} label
 * @prop {(ButtonVariation | null)} [variation="default"]
 * @prop {(ButtonRadius | null)} [radius="radius-small"]
 * @prop {(ButtonSize | null)} [size="md"]
 */

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

  button.btn-sm {
    font-size: var(--text-s);
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
  const size = props.size ?? "md";

  return html`
    <button class="${variation} radius-${radius} btn-${size}">
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
