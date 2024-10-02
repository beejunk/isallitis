import { html } from "htm/preact";
import { BasePage } from "./base-page.js";
import { Layout } from "./layout.js";

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {import("preact").ComponentChildren} props.children
 * @param {string} [props.fingerprint]
 */
export function BlogEntry(props) {
  const { children, fingerprint, title } = props;

  return html`
    <${BasePage} fingerprint=${fingerprint}>
      <${Layout} titleLink>
        <h1>${title}</h1>
        ${children}
      </${Layout}>
    </${BasePage}>
  `;
}
