import { html } from "../html-utils.js";

/**
 * @param {Object} props
 * @param {string} props.title
 */
function header(props) {
  const { title } = props;

  return html`<header class="banner">
    <p class="site-title">${title}</p>
  </header>`;
}

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.content
 * @return {string}
 */
export function layout(props) {
  const { content, title } = props;

  return html`
    <body>
      <main>
        ${header({ title })}
        <!-- TODO nav -->
        ${content}
      </main>
    </body>
  `;
}
