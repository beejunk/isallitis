import { tag, html, css } from "../utils.js";

export const TAG = tag`text-input`;

/**
 * @returns {string}
 */
export const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    gap: calc(var(--base-size) * 2);
  }

  input {
    border: 1px solid var(--color-primary);
    border-radius: var(--base-size);
    background-color: var(--color-primary);
    display: inline-block;
    font-size: var(--base-font-size);
    padding: calc(var(--base-size) * 2);
  }
`;

/**
 * @returns {string}
 */
export function shadowHTML() {
  return html`
    <label for=${TAG}><slot></slot></label>
    <input id=${TAG} type="text" />
  `;
}
