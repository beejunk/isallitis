import { html } from "htm/preact";

/**
 * @param {Object} props
 * @param {string} [props.fingerprint]
 * @param {string} props.title
 */
function Head(props) {
  const { fingerprint, title } = props;
  const stylePath = fingerprint ? `/styles-${fingerprint}.css` : `/styles.css`;

  return html`
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${title}</title>

      <link rel="stylesheet" href="/vendors/prism/prism.css" />
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
 * @param {string} [props.pageTitle]
 * @param {import("preact").ComponentChildren} props.children
 * @param {string} [props.fingerprint]
 */
export function BasePage(props) {
  const { children, fingerprint, pageTitle } = props;

  return html`
    <html lang="en">
      <${Head} fingerprint=${fingerprint} title=${pageTitle} />
      ${children}
    </html>
  `;
}
