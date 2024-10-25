import { html } from "htm/preact";
import { BasePage } from "../components/base-page.js";
import { Layout } from "../components/layout.js";
import { EntryListItem } from "../components/entry-list-item.js";

/** @typedef {import("../../views/views.js").EntryListView} EntryListView */

/**
 * @param {EntryListView} props
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
