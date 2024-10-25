import { html } from "htm/preact";

/** @typedef {import("../../views/views.js").RSSItemView} RSSItemView */

class RSSItemError extends Error {
  /**
   * @param {string} msg
   */
  constructor(msg) {
    super(msg);
    this.message = `[RSSItemError] ${msg}`;
  }
}

/** @typedef {(string | URL | undefined)} OptionalElementContent */

/** @typedef {function(string | URL): string} SubElementTemplate */

/**
 * @param {Object} props
 * @param {string} [props.children]
 */
function Title({ children }) {
  if (children) {
    return html`<title>${children}</title>`;
  }

  return null;
}

/**
 * @param {Object} props
 * @param {string} [props.children]
 */
function Description({ children }) {
  if (children) {
    const description = `<![CDATA[${children}]]>`;
    return html`<description
      dangerouslySetInnerHTML=${{ __html: description }}
    />`;
  }

  return null;
}

/**
 * @param {Object} props
 * @param {URL} [props.children]
 */
function Link({ children }) {
  if (children) {
    return html`<link>${children.toString()}</link>`;
  }

  return null;
}

/**
 * @param {RSSItemView} props
 */
export function Item(props) {
  const {
    description: itemDescription,
    link: itemLink,
    title: itemTitle,
  } = props;

  if (!itemTitle && !itemDescription) {
    throw new RSSItemError("One of `title` or `description` must be provided.");
  }

  return html`
    <item>
      <${Title}>${itemTitle}</${Title}>
      <${Description}>${itemDescription}</${Description}>
      <${Link}>${itemLink}</${Link}>
    </item>
  `;
}
