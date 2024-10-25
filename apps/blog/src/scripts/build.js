import path from "node:path";
import fs from "node:fs/promises";
import { compileRouteMap } from "../routes/routes.js";
import { loadBlog } from "../blog/blog-utils.js";

const blog = await loadBlog();

/**
 * @param {function(): Promise<void | void[]>} fn
 * @returns {Promise<void>}
 */
async function tryStep(fn) {
  try {
    await fn();
  } catch (err) {
    console.error(`${err}`);
    process.exit(1);
  }
}

const startTime = Date.now();

const routes = await compileRouteMap(blog, {
  fingerprint: startTime.toString(),
});
const distPath = "../../build";
const distURL = new URL(distPath, import.meta.url);
const cssSrcURL = new URL("../blog/styles/styles.css", import.meta.url);
const cssBuildURL = new URL(
  path.join(distPath, `styles-${startTime}.css`),
  import.meta.url,
);
const vendorsSrcUrl = new URL(
  path.join("..", "..", "vendors"),
  import.meta.url,
);
const vendorsBuildUrl = new URL(
  path.join(distPath, "vendors"),
  import.meta.url,
);

console.info("Removing `dist` directory ...");

await tryStep(() => fs.rm(distURL, { recursive: true, force: true }));

console.info("Copying CSS ...");

await tryStep(() => fs.cp(cssSrcURL, cssBuildURL));

console.info("Copying vendor assets ...");

await tryStep(() => fs.cp(vendorsSrcUrl, vendorsBuildUrl, { recursive: true }));

console.info("Writing HTML ...");

/** @type {Array<Promise<void>>} */
const buildPromises = [];

routes.forEach((routeData, entryPath) => {
  const pathSegments = entryPath.split("/").slice(0, -1);
  const entryFolderURL = new URL(
    path.join(distPath, ...pathSegments),
    import.meta.url,
  );
  const entryFileURL = new URL(
    path.join(distPath, `${entryPath}.${routeData.ext}`),
    import.meta.url,
  );

  async function writeEntry() {
    await fs.mkdir(entryFolderURL, { recursive: true });
    await fs.writeFile(entryFileURL, routeData.content);
  }

  buildPromises.push(writeEntry());
});

await tryStep(() => Promise.all(buildPromises));

const endTime = Date.now();
const deltaTime = endTime - startTime;

console.info(`Build complete in ${deltaTime}ms`);
