import { basePage } from "./base-page.js";
import { html } from "../blog/utils.js";

/**
 * @param {Object} props
 * @param {string} props.body
 * @param {string} props.title
 * @return {string}
 */
function blogContent(props) {
  const { body, title } = props;

  return html`
    <h2>${title}</h2>
    ${body}
  `;
}

/**
 * @param {Object} props
 * @param {string} props.body
 * @param {string} props.title
 * @return {string}
 */
export function blogEntry(props) {
  const { body, title } = props;
  const content = html` <h2>${title}</h2>
    ${body}`;

  return basePage({ title, content });
}
