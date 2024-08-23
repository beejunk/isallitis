import { blog } from "../blog/blog.js";
import { layout } from "./layout.js";
import { html } from "../blog/utils.js";

/**
 * @param {Object} props
 * @param {string} props.title
 * @return {string}
 */
function head(props) {
  const { title } = props;

  return html`
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${title}</title>
    </head>
  `;
}

/**
 * @param {Object} props
 * @param {string} props.content
 * @param {string} props.title
 * @return {string}
 */
export function basePage(props) {
  const { content, title } = props;

  return html`
    <!doctype html>
    <html lang="en">
      ${head({ title })} ${layout({ content, title: blog.title })}
    </html>
  `;
}