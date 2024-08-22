/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.content
 * @return {string}
 */
export function layout(props) {
  const { content, title } = props;

  return `
    <body>
      <main>
        <!-- TODO header -->
        <!-- TODO nav -->
        <h1>${title}</h1>
        ${content}
      </main>
    </body>
  `;
}
