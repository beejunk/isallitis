import { tag, html, css } from "../utils.js";
import * as Button from "../button/template.js";
import * as CircleXMark from "../circle-xmark/template.js";

export const TAG = tag`dialog`;

/**
 * @returns {string}
 */
export const styles = css`
  dialog {
    border: 1px solid var(--color-primary);
    border-radius: var(--size-100);
    background-color: var(--color-primary);
    padding: var(--size-100);
    margin-top: var(--size-100);
    width: calc(100vw - var(--size-400));
    max-width: 600px;
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
    <dialog closedby="any">
      ${Button.render({
        label: CircleXMark.render({ fill: "primary-on" }),
        variation: "icon",
      })}
      <slot></slot>
    </dialog>
  `;
}
