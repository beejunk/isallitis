import { tag, html, css } from "../utils.js";

export const TAG = tag`circle-xmark`;

/**
 * @typedef {Object} CircleXMarkProps
 * @prop {(string | null)} [title = "Close"]
 * @prop {(string | null)} [width = "20"]
 */

/**
 * @param {Object} props
 * @param {(string | null)} [props.fill = "#000000"]
 * @returns {string}
 */
export function shadowCSS({ fill }) {
  return css`
    :host {
      display: block;
    }

    svg {
      fill: ${fill};
    }
  `;
}

/**
 * @param {CircleXMarkProps} props
 * @returns {string}
 */
export function shadowHTML(props) {
  const title = props.title ?? "Close";
  const width = props.width ?? "20";

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
export function render({ title, width } = { title: "Close", width: "20" }) {
  return html`<${TAG} width="${width}">${title}</${TAG}>`;
}
