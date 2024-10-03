import { html } from "htm/preact";
import { Code } from "../../../../../../../components/code.js";

const title = "Detecting RSS";

const slug = "detecting-rss";

const hour = 12;

const minute = 45;

const links = {
  mdnRelLink:
    "https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel",
  mdnLinkEl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link",
  redditComment:
    "https://www.reddit.com/r/vivaldibrowser/comments/rdap53/comment/hnztrx4/",
  vivaldi: "https://www.vivaldi.com",
};

const body = () => html`
  <p>
    Setting up a bare-bones RSS feed for this blog ended up not being too
    tedious, and I'll probably write in more detail about that later. One thing
    I wanted to document before I forget about it, though, is how I got the RSS
    feed to be detected by <a href="${links.vivaldi}">Vivaldi</a> (and, I hope,
    any other app that detects feeds).
  </p>

  <p>
    As it turns out, you can use${" "}
    <a href="${links.mdnLinkEl}"><${Code} inline src="<link>" /> tags</a> to do
    this, like so:
  </p>

  <${Code}
    language="markup"
    src=${`<link rel="alternate" type="application/rss+xml" title="A Blog Is All It Is" href="/rss-feed.xml">`}
  />

  <p>
    The key here is setting the <${Code} inline src="rel" /> attribute to
    <${Code} inline src="alternative" />, which has the following description on
    ${" "} <a href="${links.mdnRelLink}">MDN</a>:
  </p>

  <blockquote>Alternate representations of the current document.</blockquote>

  <p>Handy!</p>

  <p>
    Perhaps unsurprisingly,
    <a href="${links.redditComment}"> a Reddit comment </a>
    was where I found this recommendation:
  </p>

  <blockquote>
    <p>See if this works in the <${Code} inline src="<head></head>" /></p>

    <p>
      <${Code}
        src=${`<link rel="alternate" type="application/rss+xml" title="Title of Feed" href="url-to-feed"`}
      />
    </p>
  </blockquote>
  <p>
    It's sad that Reddit is where I found this, because it seems like using
    <${Code} inline src="<link>" /> tags in this way is standard. When I type in
    <${Code} inline src="link" /> into WebStorm a bunch of auto-completes (drive
    by Emmet, I think) pop up, including for RSS and Atom.
  </p>
`;

/** @type {import("../../../../../../../blog.js").BlogEntry} */
export const detectingRSS = {
  body,
  hour,
  minute,
  slug,
  title,
};
