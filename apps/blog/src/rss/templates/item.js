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
 * @param {SubElementTemplate} template
 */
function maybeContent(template) {
  /**
   * @param {OptionalElementContent} content
   */
  return function templateWrapper(content) {
    if (!content) {
      return "";
    }

    return template(content);
  };
}

const title = maybeContent((itemTitle) => `<title>${itemTitle}</title>`);

const description = maybeContent(
  (itemDescription) =>
    `<description><![CDATA[${itemDescription}]]></description>`,
);

const link = maybeContent((itemLink) => `<link>${itemLink}</link>`);

/**
 * @typedef {Object} RSSItemProps
 * @property {string} [props.description]
 * @property {string} [props.title]
 * @property {URL} [props.link]
 */

/**
 * @param {RSSItemProps} props
 * @returns {string}
 */
export function item(props) {
  const {
    description: itemDescription,
    link: itemLink,
    title: itemTitle,
  } = props;

  if (!itemTitle && !itemDescription) {
    throw new RSSItemError("One of `title` or `description` must be provided.");
  }

  return `<item>${title(itemTitle)}${description(itemDescription)}${link(itemLink)}</item>`;
}
