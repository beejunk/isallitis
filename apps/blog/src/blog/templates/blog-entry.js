import { basePage } from "./base-page.js";
import { layout } from "./layout.js";
import { blog } from "../blog.js";
import { html } from "../blog-utils.js";

/**
 * @param {Object} props
 * @param  {string} props.title
 * @returns {string}
 */
function entryTitle(props) {
  const { title } = props;

  return html`<h1>${title}</h1>`;
}

/**
 * @param {Object} props
 * @param {string} props.body
 * @param {string} [props.fingerprint]
 * @param {string} props.title
 * @return {string}
 */
export function blogEntry(props) {
  const { body, fingerprint, title } = props;

  return basePage({
    title,
    fingerprint,
    content: layout({
      title: blog.title,
      titleLink: true,
      content: `${entryTitle({ title })} ${body}`,
    }),
  });
}
