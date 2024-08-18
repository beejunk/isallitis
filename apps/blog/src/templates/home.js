import { baseTemplate } from "./base.js";

const title = "Engineering Blog";

const body = `
  <h1>Engineering Blog</h1>
`;

export function homeTemplate() {
  return baseTemplate({
    title,
    body,
  });
}
