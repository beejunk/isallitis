import { layoutTemplate } from "./layout.js";

/**
 * @param {Object} data
 * @param {string} data.title
 * @return {string}
 */
function headTemplate(data) {
  const { title } = data;

  return `
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${title}</title>
    </head>
  `;
}

/**
 * @param {Object} data
 * @param {string} data.body
 * @param {string} data.title
 * @return {string}
 */
export function baseTemplate(data) {
  const { body, title } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
      ${headTemplate({ title })}
      ${layoutTemplate({ body })} 
    </html>
  `;
}
