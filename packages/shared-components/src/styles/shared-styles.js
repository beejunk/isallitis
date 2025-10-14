import { css } from "../utils.js";

export const defaultStyles = css`
  :host {
    font-size: var(--base-size);
    font-family: sans-serif;
  }

  p {
    padding: 0;
    margin: var(--space-s) 0;
  }
`;

export const fillStyles = css`
  :host:has(.color-primary) {
    fill: var(--color-primary);
  }

  :host:has(.color-seconds) {
    fill: var(--color-secondary);
  }
`;

export const radiusStyles = css`
  .radius-small {
    border-radius: var(--space-s);
  }

  .radius-medium {
    border-radius: var(--space-m);
  }

  .radius-large {
    border-radius: var(--space-l);
  }

  .radius-round {
    border-radius: 50%;
  }
`;
