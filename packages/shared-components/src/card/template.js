import { tag, html, css } from "../utils.js";

export const TAG = tag`card`;

/**
 * @typedef {Object} CardProps
 * @prop {(string | null)} maxWidth
 * @prop {boolean} [withHeader=false]
 */

export const styles = css`
  :host {
    display: block;
    border: 1px solid white;
    border-radius: var(--space-s);
  }

  :host([with-header]) .header {
    display: block;
    border-bottom: 1px solid white;
    padding: var(--space-s);
  }

  .body {
    display: block;
    padding: var(--space-m);
  }
`;

/**
 * @returns {string}
 */
export function shadowHTML() {
  return html`
    <slot class="header" name="header"></slot>
    <slot class="body"></slot>
  `;
}
