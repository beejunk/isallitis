import { basePage } from "./base-page.js";
import { html } from "../blog/utils.js";

/**
 * @param {Object} props
 * @param {string} props.body
 * @param {string} [props.fingerprint]
 * @param {string} props.title
 * @return {string}
 */
export function blogEntry(props) {
  const { body, fingerprint, title } = props;
  const content = html` <h2>${title}</h2>
    ${body}`;

  return basePage({ fingerprint, title, content });
}
