/**
 * @param {Object} data
 * @param {string} data.body
 * @return {string}
 */
export function layoutTemplate(data) {
  const { body } = data;

  return `
    <body>
      <main>
        <!-- TODO header -->
        <!-- TODO nav -->
        ${body}
      </main>
    </body>
  `;
}
