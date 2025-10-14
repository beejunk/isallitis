import { tag, html, css, parseAttribute } from "../utils.js";

export const TAG = tag`circle-xmark`;

const FILL_VARIATIONS = {
  /** @type {"primary"} */
  primary: "primary",

  /** @type {"primary-on"} */
  "primary-on": "primary-on",
};

/** @typedef {keyof FILL_VARIATIONS} FillVariation */

/**
 * @param {(string | null)} fillAttrValue
 */
export function parseFillVariation(fillAttrValue) {
  return parseAttribute(FILL_VARIATIONS, fillAttrValue);
}

/**
 * @typedef {Object} CircleXMarkProps
 * @prop {(FillVariation | null)} [fill]
 * @prop {(string | null)} [title]
 * @prop {(string | null)} [width]
 */

/**
 * @param {CircleXMarkProps} props
 * @returns {NonNullable<CircleXMarkProps>}
 */
function parseProps(props) {
  const fill = props.fill ?? "primary";
  const title = props.title ?? "Close";
  const width = props.width ?? "20";

  return { fill, title, width };
}

export const styles = css`
  :host {
    display: block;
  }

  :host([fill="primary"]) {
    fill: var(--color-primary);
  }

  :host([fill="primary-on"]) {
    fill: var(--color-primary-on);
  }
`;

/**
 * @param {CircleXMarkProps} props
 * @returns {string}
 */
export function shadowHTML(props) {
  const { title, width } = parseProps(props);

  return html`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      height="${width}"
      width="${width}"
    >
      <!--! Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. -->
      <title><slot>${title}</slot></title>
      <path
        d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"
      />
    </svg>
  `;
}

/**
 * @param {CircleXMarkProps} [props]
 * @return {string}
 */
export function render(props = {}) {
  const { fill, width, title } = parseProps(props);

  return html`<${TAG} fill="${fill}" width="${width}">${title}</${TAG}>`;
}
