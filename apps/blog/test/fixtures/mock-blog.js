import fs from "node:fs";
import { BlogSchema } from "../../src/models/schemas.js";

const blogText = fs.readFileSync(
  new URL("./blog.json", import.meta.url),
  "utf8",
);

export const mockBlog = BlogSchema.parse(JSON.parse(blogText));
