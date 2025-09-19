import { tag, html, css } from "../utils.js";
import * as Button from "../button/button-template.js";
import * as CircleXMark from "../circle-xmark/circle-xmark-template.js";

export const TAG = tag`dialog`;

/**
 * @returns {string}
 */
export const styles = css`
  dialog {
    border: 1px solid var(--color-primary);
    border-radius: calc(var(--base-size) * 2);
    background-color: var(--color-primary);
    font-size: var(--base-font-size);
    padding: calc(var(--base-size) * 2);
  }

  ::backdrop {
    background-color: #000000;
    opacity: 0.2;
  }

  dialog[open] {
    animation: 200ms dialog-show;
    display: flex;
    flex-direction: column;
  }

  dialog[open] ${Button.TAG} {
    align-self: flex-end;
  }

  dialog.hide {
    animation: 200ms dialog-hide;
  }

  @keyframes dialog-show {
    from {
      opacity: 0;
      scale: 95%;
    }

    to {
      opacity: 1;
      scale: 100%;
    }
  }

  @keyframes dialog-hide {
    from {
      opacity: 1;
      scale: 100%;
    }

    to {
      opacity: 0;
      scale: 95%;
    }
  }
`;

/**
 * @returns {string}
 */
export function shadowHTML() {
  return html`
    <dialog>
      ${Button.render({ label: CircleXMark.render() })}
      <slot></slot>
    </dialog>
  `;
}
