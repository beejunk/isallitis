import { rssIcon } from "./rss-icon.js";
import { html } from "../blog-utils.js";

function connectLinks() {
  return html`
    <ul class="connect-links">
      <li><a href="/rss-feed.xml">${rssIcon()}</a></li>
    </ul>
  `;
}

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {boolean} props.titleLink
 */
function pageTitle(props) {
  const { title, titleLink } = props;

  if (titleLink) {
    return html`<a class="site-title" href="/index.html">${title}</a>`;
  }

  return html`<p class="site-title">${title}</p>`;
}

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {boolean} props.titleLink
 */
function header(props) {
  return html` <header class="banner">
    ${pageTitle(props)} ${connectLinks()}
  </header>`;
}

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.content
 * @param {boolean} [props.titleLink = false]
 * @return {string}
 */
export function layout(props) {
  const { content, title, titleLink = false } = props;

  return html`
    <body>
      <div class="main-container">
        ${header({ title, titleLink })}

        <!-- TODO nav -->

        <main>${content}</main>
      </div>

      <script src="/vendors/prism/prism.js" async></script>
    </body>
  `;
}
