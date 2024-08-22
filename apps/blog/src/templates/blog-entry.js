import { basePage } from "./base-page.js";

/**
 * @param {Object} props
 * @param {string} props.body
 * @param {string} props.title
 * @return {string}
 */
function blogContent(props) {
  const { body, title } = props;

  return `
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
  const { title } = props;

  return basePage({ title, content: blogContent(props) });
}
