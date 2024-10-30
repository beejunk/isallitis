import { html } from "htm/preact";
import { BasePage } from "../shared/base-page.js";
import { Layout } from "../shared/layout.js";
import { EntryListItem } from "../shared/entry-list-item.js";

/** @typedef {import("../../views/entry-list-page.js").EntryListPageView} EntryListPageView */

/**
 * @param {EntryListPageView} props
 */
export function EntryListPage(props) {
  const { blogTitle, entries, fingerprint, pageTitle, pageHeading } = props;

  return html`
    <${BasePage} fingerprint=${fingerprint} pageTitle=${pageTitle}>
      <${Layout} blogTitle=${blogTitle} titleLink>
        <h1>${pageHeading}</h1>
        
        <ul>
          ${entries.map((entry) => html`<${EntryListItem} ...${entry} />`)}
        </ul>
      </${Layout}>
    </${BasePage}>
  `;
}
