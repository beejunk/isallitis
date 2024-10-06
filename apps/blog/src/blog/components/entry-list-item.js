import { getBlogEntryRoute } from "../../routes/routes.js";
import { html } from "htm/preact";

/**
 * @param {Object} props
 * @param {number} props.year
 * @param {number} props.month
 * @param {number} props.day
 * @param {string} props.slug
 * @param {string} props.title
 */
export function EntryListItem(props) {
  const { year, month, day, slug, title } = props;
  const path = getBlogEntryRoute({ year, month, day, slug });

  return html`
    <li>
      <a href="${path}.html">${year}-${month}-${day}: ${title}</a>
    </li>
  `;
}
