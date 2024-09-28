/**
 * @param {Object} props
 * @param {string} props.href
 * @param {string} props.text
 * @returns {string}
 */
export function anchor(props) {
  const { href, text } = props;
  return `<a href="${href}">${text}</a>`;
}
