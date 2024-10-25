import { html } from "htm/preact";
import { RSSIcon } from "./rss-icon.js";

function ConnectLinks() {
  return html`
    <ul class="connect-links">
      <li>
        <a href="/rss-feed.xml"><${RSSIcon} /></a>
      </li>
    </ul>
  `;
}

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {boolean} props.titleLink
 */
function PageTitle(props) {
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
function Header(props) {
  return html`
    <header class="banner">
      <${PageTitle} ...${props} />
      <${ConnectLinks} />
    </header>
  `;
}

/**
 * @param {Object} props
 * @param {import("preact").ComponentChildren} props.children
 * @param {boolean} props.blogTitle
 * @param {boolean} [props.titleLink = false]
 */
export function Layout(props) {
  const { blogTitle, children, titleLink = false } = props;

  return html`
    <body>
      <div class="main-container">
        <${Header} title=${blogTitle} titleLink=${titleLink} />

        <!-- TODO nav -->

        <main>${children}</main>
      </div>

      <script src="/vendors/prism/prism.js" async></script>
    </body>
  `;
}
