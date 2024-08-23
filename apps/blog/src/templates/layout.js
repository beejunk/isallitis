import { html } from "../blog/utils.js";

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
        <!-- TODO header -->
        <!-- TODO nav -->
        <h1>${title}</h1>
        ${content}
      </main>
    </body>
  `;
}
