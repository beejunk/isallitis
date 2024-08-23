import { basePage } from "./base-page.js";
import { getBlogPath, html } from "../blog/utils.js";

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

  return html`<li><a href="${path}">${year}-${month}-${day}: ${title}</a></li>`;
}

/**
 * @param {Object} props
 * @param {import("../blog/blog.js").BlogYears} props.years
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
    <ul>
      ${entryListItems.join("")}
    </ul>
  `;
}

/**
 * @param {import("../blog/blog.js").Blog} blog
 * @return {string}
 */
export function index(blog) {
  const { title, years } = blog;

  return basePage({
    content: entryList({ years }),
    title,
  });
}