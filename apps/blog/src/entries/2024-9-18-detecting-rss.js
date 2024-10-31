import { html } from "htm/preact";
import { Code } from "../components/shared/code.js";
import { BlogLink } from "../components/shared/blog-link.js";

export const title = "Detecting RSS";

export const hour = 12;

export const minute = 45;

export const links = [
  { title: "Vivaldi website", url: "https://www.vivaldi.com" },
  {
    title: "MDN documentation for the 'link' element",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link",
  },
  {
    title: "MDN documentation for the 'rel' attribute",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel",
  },
  {
    title: "Reddit comment on how to use the 'link' element for an RSS feed",
    url: "https://www.reddit.com/r/vivaldibrowser/comments/rdap53/comment/hnztrx4/",
  },
  { title: "Emmet website", url: "https://docs.emmet.io" },
];

export const body = () => html`
  <p>
    Setting up a bare-bones RSS feed for this blog ended up not being too
    tedious, and I'll probably write in more detail about that later. One thing
    I wanted to document before I forget about it, though, is how I got the RSS
    feed to be detected by <${BlogLink} href="${links[0].url}">Vivaldi</${BlogLink}> (and, I hope,
    any other app that detects feeds).
  </p>

  <p>
    As it turns out, you can use
    <${BlogLink} href="${links[1].url}"><${Code} inline src="<link>" />tags</${BlogLink}> to do
    this, like so:
  </p>

  <${Code}
    language="markup"
    src=${`<link rel="alternate" type="application/rss+xml" title="A Blog Is All It Is" href="/rss-feed.xml">`}
  />

  <p>
    The key here is setting the <${Code} inline src="rel" /> attribute to
    <${Code} inline src="alternative" />, which has the following description on
    <${BlogLink} href="${links[2].url}">MDN</${BlogLink}>:
  </p>

  <blockquote>Alternate representations of the current document.</blockquote>

  <p>Handy!</p>

  <p>
    Perhaps unsurprisingly,
    <${BlogLink} href="${links[3].url}"> a Reddit comment </${BlogLink}>
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
    I'm not sure what it says about the state of search engines that Reddit is where
    I found this. It seems like using <${Code} inline src="<link>" /> tags in this
    way is standard. When I type in <${Code} inline src="link" /> into WebStorm a
    bunch of auto-completes (driven by <${BlogLink} href=${links[4].url}>Emmet</${BlogLink}>,
    I think) pop up, including for RSS and Atom. And at the very least
    you'd think the MDN docs I linked above would appear prominently in the search
    result.
  </p>
`;
