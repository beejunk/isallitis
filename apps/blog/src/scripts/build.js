import path from "node:path";
import fs from "node:fs/promises";
import { blog } from "../blog/blog.js";
import { createHTMLMap } from "../blog/html-map.js";

const startTime = Date.now();

const htmlMap = createHTMLMap(blog);
const distPath = "../../build";
const distURL = new URL(distPath, import.meta.url);

await fs.rm(distURL, { recursive: true, force: true });

/** @type {Array<Promise<void>>} */
const buildPromises = [];

htmlMap.forEach((html, entryPath) => {
  const pathSegments = entryPath.split("/");
  const slug = pathSegments.pop();

  pathSegments.shift();

  const entryFolderPath = path.join(distPath, pathSegments.join("/"));
  const entryFolderURL = new URL(entryFolderPath, import.meta.url);
  const entryFileURL = new URL(
    path.join(entryFolderPath, `${slug}.html`),
    import.meta.url,
  );

  buildPromises.push(
    new Promise(async (resolve) => {
      await fs.mkdir(entryFolderURL, { recursive: true });
      await fs.writeFile(entryFileURL, html);
      resolve();
    }),
  );
});

await Promise.all(buildPromises);

const endTime = Date.now();
const deltaTime = endTime - startTime;

console.info(`Build complete in ${deltaTime}ms`);
