import { html } from "htm/preact";

/**
 * @typedef {Object} BlogLinkProps
 * @prop {string} href
 * @prop {import("preact").ComponentChildren} children
 */

/**
 * @param {BlogLinkProps} props
 */
export function BlogLink(props) {
  const { href, children } = props;
  return html`<a href="${href}">${children}</a>`;
}
