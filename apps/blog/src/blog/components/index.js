import { html } from "htm/preact";
import { BasePage } from "./base-page.js";
import { Layout } from "./layout.js";
import { getBlogEntryRoute } from "../../routes/routes.js";
import { blogData } from "./signals.js";

/**
 * @param {Object} props
 * @param {number} props.year
 * @param {number} props.month
 * @param {number} props.day
 * @param {string} props.slug
 * @param {string} props.title
 */
function EntryListItem(props) {
  const { year, month, day, slug, title } = props;
  const path = getBlogEntryRoute({ year, month, day, slug });

  return html`<li>
    <a href="${path}.html">${year}-${month}-${day}: ${title}</a>
  </li>`;
}

function EntryList() {
  return html`
    <h1>Recent Entries</h1>
    <ul>
      ${blogData.value.slugs.map((slug) => {
        const { year, month, day, title } = blogData.value.entriesBySlug[slug];

        return html`
          <${EntryListItem}
            year=${year}
            month=${month}
            day=${day}
            slug=${slug}
            title=${title}
          />
        `;
      })}
    </ul>
  `;
}

/**
 * @param {Object} props
 * @param {string} [props.fingerprint]
 */
export function Index(props) {
  const { fingerprint } = props;

  return html`
    <${BasePage} fingerprint=${fingerprint}>
      <${Layout}>
        <${EntryList} />
      </${Layout}>
    </${BasePage}>
  `;
}
