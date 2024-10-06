import { html } from "htm/preact";
import { BasePage } from "../components/base-page.js";
import { Layout } from "../components/layout.js";
import { BreadCrumb } from "../components/bread-crumb.js";

/**
 * @param {Object} props
 * @param {import("../blog-utils.js").EntryData} props.entry
 * @param {string} [props.fingerprint]
 */
export function BlogEntry(props) {
  const { entry, fingerprint } = props;
  const { body, day, month, title, year } = entry;

  return html`
    <${BasePage} fingerprint=${fingerprint} pageTitle=${title} >
      <${Layout} titleLink>
        <article>
          <h1>${title}</h1>
        
          <${BreadCrumb} year=${year} month=${month} day=${day} />
        
          <${body} />
        </article> 
      </${Layout}>
    </${BasePage}>
  `;
}
