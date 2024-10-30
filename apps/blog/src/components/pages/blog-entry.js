import { html } from "htm/preact";
import { BasePage } from "../shared/base-page.js";
import { Layout } from "../shared/layout.js";
import { BreadCrumb } from "../shared/bread-crumb.js";

/** @typedef {import("../../views/entry-page.js").EntryPageView} EntryPageView
/**
 * @param {EntryPageView} props
 */
export function BlogEntry(props) {
  const {
    blogTitle,
    body,
    pageTitle,
    pageHeading,
    fingerprint,
    year,
    month,
    day,
  } = props;

  return html`
    <${BasePage} fingerprint=${fingerprint} pageTitle=${pageTitle} >
      <${Layout} blogTitle=${blogTitle} titleLink>
        <article>
          <h1>${pageHeading}</h1>
        
          <${BreadCrumb} year=${year} month=${month} day=${day} />
        
          <${body} />
        </article> 
      </${Layout}>
    </${BasePage}>
  `;
}
