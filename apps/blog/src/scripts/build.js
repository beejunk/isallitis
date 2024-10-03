import path from "node:path";
import fs from "node:fs/promises";
import { blog } from "../blog/blog.js";
import { compileRouteMap } from "../routes/routes.js";

// TODO: Move to config file
const HOSTNAME = "https://isallitis.onrender.com";

const startTime = Date.now();

const routes = compileRouteMap(blog, {
  fingerprint: startTime.toString(),
  hostname: HOSTNAME,
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

try {
  await fs.cp(vendorsSrcUrl, vendorsBuildUrl, { recursive: true });
} catch (err) {
  console.error(`Error building CSS: ${err}`);
  process.exit(1);
}

/** @type {Array<Promise<void>>} */
const buildPromises = [];

routes.forEach((routeData, entryPath) => {
  const pathSegments = entryPath.split("/").slice(0, -1);
  const entryFolderPath = path.join(distPath, pathSegments.join("/"));
  const entryFolderURL = new URL(entryFolderPath, import.meta.url);
  const entryFileURL = new URL(
    path.join(entryFolderPath, `${routeData.slug}.${routeData.ext}`),
    import.meta.url,
  );

  const writeEntry = async () => {
    await fs.mkdir(entryFolderURL, { recursive: true });
    await fs.writeFile(entryFileURL, routeData.content);
  };

  buildPromises.push(writeEntry());
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
