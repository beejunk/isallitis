import { basePage } from "./base-page.js";
import { html } from "../utils/html-utils.js";

/**
 * @param {Object} props
 * @param {string} props.body
 * @param {string} [props.fingerprint]
 * @param {string} props.title
 * @return {string}
 */
export function blogEntry(props) {
  const { body, fingerprint, title } = props;
  const content = html`<h1>${title}</h1>
    ${body}`;

  return basePage({ fingerprint, title, content });
}
