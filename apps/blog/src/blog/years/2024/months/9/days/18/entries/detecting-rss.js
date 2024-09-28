import { html } from "../../../../../../../blog-utils.js";

const title = "Detecting RSS";

const slug = "detecting-rss";

const hour = 12;

const minute = 45;

const links = {
  mdn: "https://developer.mozilla.org/",
  mdnLinkEl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link",
  redditComment:
    "https://www.reddit.com/r/vivaldibrowser/comments/rdap53/comment/hnztrx4/",
  vivaldi: "https://www.vivaldi.com",
};

const body = html`
  <p>
    Setting up a bare-bones RSS feed for this blog ended up not being too
    tedious, and I'll probably write in more detail about that later. One thing
    I wanted to document before I forget about it, though, is how I got the RSS
    feed to be detected by <a href="${links.vivaldi}">Vivaldi</a> (and, I hope,
    any other app that detects feeds).
  </p>

  <p>
    As it turns out, you can use
    <a href="${links.mdnLinkEl}">&lt;link&gt; tags</a> to do this, like so:
  </p>

  <pre>
    <code class="language-markup">&lt;link rel="alternate" type="application/rss+xml" title="A Blog Is All It Is" href="/rss-feed.xml"&gt;</code>
  </pre>

  <p>
    The key here is the \`rel\` attribute, which has the following description
    on <a href="${links.mdn}">MDN</a>:
  </p>

  <blockquote>Alternate representations of the current document.</blockquote>

  <p>Handy!</p>

  <p>
    Perhaps unsurprisingly,
    <a href="${links.redditComment}">a Reddit comment</a>
    was where I found this recommendation:
  </p>

  <blockquote>
    <p>See if this works in the &lt;head&gt;&lt;/head&gt>:</p>

    <p>
      &lt;link rel="alternate" type="application/rss+xml" title="Title of Feed"
      href="url-to-feed" /&gt;
    </p>
  </blockquote>
`;

/** @type {import("../../../../../../../blog.js").BlogEntry} */
export const detectingRSS = {
  body,
  hour,
  minute,
  slug,
  title,
};
