import { html } from "../html-utils.js";

/**
 * @param {Object} props
 * @param {string} [props.fingerprint]
 * @param {string} props.title
 * @return {string}
 */
function head(props) {
  const { fingerprint, title } = props;
  const stylePath = fingerprint ? `/styles-${fingerprint}.css` : `/styles.css`;

  return html`
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${title}</title>
      <link rel="stylesheet" href="${stylePath}" />
      <link
        rel="alternate"
        type="application/rss+xml"
        title="A Blog Is All It Is"
        href="/rss-feed.xml"
      />
    </head>
  `;
}

/**
 * @param {Object} props
 * @param {string} props.content
 * @param {string} [props.fingerprint]
 * @param {string} props.title
 * @return {string}
 */
export function basePage(props) {
  const { content, fingerprint, title } = props;

  return html`
    <!doctype html>
    <html lang="en">
      ${head({ fingerprint, title })} ${content}
    </html>
  `;
}
