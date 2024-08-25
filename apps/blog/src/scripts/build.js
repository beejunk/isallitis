import path from "node:path";
import fs from "node:fs/promises";
import { blog } from "../blog/blog.js";
import { createHTMLMap } from "../blog/html-map.js";

const startTime = Date.now();

const htmlMap = createHTMLMap(blog, { fingerprint: startTime.toString() });
const distPath = "../../build";
const distURL = new URL(distPath, import.meta.url);
const cssSrcURL = new URL("../styles/styles.css", import.meta.url);
const cssBuildURL = new URL(
  path.join(distPath, `styles-${startTime}.css`),
  import.meta.url,
);

try {
  await fs.rm(distURL, { recursive: true, force: true });
} catch (err) {
  console.error(`Error deleting "dist" directory: ${err}`);
  process.exit(1);
}

try {
  await fs.cp(cssSrcURL, cssBuildURL);
} catch (err) {
  console.error(`Error building CSS: ${err}`);
  process.exit(1);
}

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

try {
  await Promise.all(buildPromises);
} catch (err) {
  console.error(`Error building HTML: ${err}`);
  process.exit(1);
}

const endTime = Date.now();
const deltaTime = endTime - startTime;

console.info(`Build complete in ${deltaTime}ms`);
