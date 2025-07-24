import { tag, html, css } from "../utils.js";

export const TAG = tag`card`;

/**
 * @typedef {Object} CardProps
 * @prop {(string | null)} maxWidth
 * @prop {boolean} [withHeader=false]
 */

/**
 * @param {CardProps} props
 * @returns {string}
 */
export function shadowCSS(props) {
  const { maxWidth = "100%", withHeader = false } = props;
  const headerDisplay = withHeader ? "block" : "none";

  return css`
    :host {
      display: block;
      border: 1px solid white;
      border-radius: 4px;
      max-width: ${maxWidth};

      --card-padding: calc(var(--base-font-size) * 0.5);
    }

    .header {
      display: ${headerDisplay};
      border-bottom: 1px solid white;
      padding: var(--card-padding);
    }

    .body {
      display: block;
      padding: var(--card-padding);
    }
  `;
}

/**
 * @returns {string}
 */
export function shadowHTML() {
  return html`
    <slot class="header" name="header"></slot>
    <slot class="body"></slot>
  `;
}
