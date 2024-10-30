import { html } from "htm/preact";

function BreadCrumbSep() {
  return html`<span aria-hidden class="bread-crumb-sep">></span>`;
}

/**
 * @param {Object} props
 * @param {number} props.year
 * @param {number} props.month
 * @param {number} props.day
 */
export function BreadCrumb(props) {
  const { year, month, day } = props;
  const yearRoute = `/year/${year}.html`;
  const monthRoute = `/year/${year}/month/${month}.html`;
  const dayRoute = `/year/${year}/month/${month}/day/${day}.html`;

  return html`
    <nav aria-label="Breadcrumb" class="bread-crumbs">
      <ul>
        <li><a href=${yearRoute}>${year}</a><${BreadCrumbSep} /></li>
        <li><a href=${monthRoute}>${month}</a><${BreadCrumbSep} /></li>
        <li><a href=${dayRoute}>${day}</a></li>
      </ul>
    </nav>
  `;
}
