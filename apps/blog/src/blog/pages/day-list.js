import { html } from "htm/preact";
import { BasePage } from "../components/base-page.js";
import { Layout } from "../components/layout.js";
import { blogData } from "../signals/signals.js";

import { EntryListItem } from "../components/entry-list-item.js";

/**
 * @param {Object} props
 * @param {string} [props.fingerprint]
 * @param {number} props.day
 * @param {number} props.month
 * @param {number} props.year
 */
export function DayList(props) {
  const { day, fingerprint, month, year } = props;
  const entries = blogData.value.sortedEntries.filter(
    (entry) => entry.day === day,
  );
  const pageTitle = `${year}-${month}-${day}`;

  return html`
    <${BasePage} fingerprint=${fingerprint} pageTitle=${pageTitle}>
      <${Layout} titleLink>
        <h1>${pageTitle}</h1>
        
        <ul>
          ${entries.map((entry) => html`<${EntryListItem} ...${entry} />`)}
        </ul>
      </${Layout}>
    </${BasePage}>
  `;
}
