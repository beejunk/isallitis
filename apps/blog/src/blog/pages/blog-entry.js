import { html } from "htm/preact";
import { BasePage } from "../components/base-page.js";
import { Layout } from "../components/layout.js";
import { BreadCrumb } from "../components/bread-crumb.js";

/** @typedef {import("../../views/views.js").EntryPageView} EntryPageView
/**
 * @param {EntryPageView} props
 */
export function BlogEntry(props) {
  const {
    blogTitle,
    children,
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
        
          <${children} />
        </article> 
      </${Layout}>
    </${BasePage}>
  `;
}
