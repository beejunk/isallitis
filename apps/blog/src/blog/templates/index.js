import { basePage } from "./base-page.js";
import { getBlogPath, html } from "../html-utils.js";
import { layout } from "./layout.js";

/**
 * @param {Object} props
 * @param {number} props.year
 * @param {number} props.month
 * @param {number} props.day
 * @param {string} props.slug
 * @param {string} props.title
 * @return {string}
 */
function entryListItem(props) {
  const { year, month, day, slug, title } = props;
  const path = getBlogPath({ year, month, day, slug });

  return html`<li>
    <a href="${path}.html">${year}-${month}-${day}: ${title}</a>
  </li>`;
}

/**
 * @param {Object} props
 * @param {import("../blog.js").BlogYears} props.years
 * @return {string}
 */
function entryList(props) {
  const { years } = props;

  /** @type {Array<string>} */
  const entryListItems = [];

  Object.values(years).forEach(({ year, months }) => {
    Object.values(months).forEach(({ month, days }) => {
      Object.values(days).forEach(({ day, entries }) => {
        Object.values(entries).forEach(({ slug, title }) => {
          entryListItems.push(entryListItem({ year, month, day, slug, title }));
        });
      });
    });
  });

  return html`
    <h1>Recent Entries</h1>
    <ul>
      ${entryListItems}
    </ul>
  `;
}

/**
 * @param {Object} props
 * @param {import("../blog.js").Blog} props.blog
 * @param {string} [props.fingerprint]
 * @return {string}
 */
export function index(props) {
  const { blog, fingerprint } = props;
  const { title, years } = blog;

  return basePage({
    title,
    fingerprint,
    content: layout({
      title,
      content: entryList({ years }),
    }),
  });
}
