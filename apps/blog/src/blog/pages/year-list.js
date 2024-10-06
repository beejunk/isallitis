import { html } from "htm/preact";
import { BasePage } from "../components/base-page.js";
import { Layout } from "../components/layout.js";
import { blogData } from "../signals/signals.js";

import { EntryListItem } from "../components/entry-list-item.js";

/**
 * @param {Object} props
 * @param {string} [props.fingerprint]
 * @param {number} props.year
 */
export function YearList(props) {
  const { fingerprint, year } = props;
  const entries = blogData.value.sortedEntries.filter(
    (entry) => entry.year === year,
  );

  return html`
    <${BasePage} fingerprint=${fingerprint} pageTitle=${year.toString()}>
      <${Layout} titleLink>
        <h1>${year.toString()}</h1>
        
        <ul>
          ${entries.map((entry) => html`<${EntryListItem} ...${entry} />`)}
        </ul>
      </${Layout}>
    </${BasePage}>
  `;
}
