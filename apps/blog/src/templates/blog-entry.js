import { baseTemplate } from "./base.js";

/**
 * @param {Object} data
 * @param {string} data.body
 * @param {string} data.title
 * @return {string}
 */
export function blogEntryTemplate(data) {
  const body = `
    <h1>${data.title}</h1>
    ${data.body}
  `;

  return baseTemplate({ title: data.title, body });
}
