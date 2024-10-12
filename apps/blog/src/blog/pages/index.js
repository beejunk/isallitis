import { html } from "htm/preact";
import { BasePage } from "../components/base-page.js";
import { Layout } from "../components/layout.js";
import { blogData } from "../signals/signals.js";
import { EntryListItem } from "../components/entry-list-item.js";

function RecentEntryList() {
  return html`
    <ul>
      ${blogData.value.slugs.reverse().map((slug) => {
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
        <h1>Recent Entries</h1>
        
        <${RecentEntryList} />
      </${Layout}>
    </${BasePage}>
  `;
}
