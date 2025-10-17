import path from "node:path";
import { cd, $, echo, chalk } from "zx";

function getDistPath() {
  const distUrl = new URL(path.join("..", "dist"), import.meta.url);

  return distUrl.pathname;
}

function getTodoDistPath() {
  return path.join(getDistPath(), "todo");
}

function getTodoCodePath() {
  const appCodeUrl = new URL(
    path.join("..", "apps", "todo", "client"),
    import.meta.url,
  );

  return appCodeUrl.pathname;
}

function getSharedComponentsCodePath() {
  const appCodeUrl = new URL(
    path.join("..", "packages", "shared-components", "src"),
    import.meta.url,
  );

  return appCodeUrl.pathname;
}

function getSignalsCorePath() {
  const appCodeUrl = new URL(
    path.join(
      "..",
      "node_modules",
      ".pnpm",
      "@preact+signals-core@1.11.0",
      "node_modules",
      "@preact",
      "signals-core",
      "dist",
      "signals-core.mjs",
    ),
    import.meta.url,
  );

  return appCodeUrl.pathname;
}

function getSharedComponentsDistPath() {
  return path.join(getTodoDistPath(), "shared-components");
}

function getSignalsCoreDistPath() {
  return path.join(getTodoDistPath(), "preact", "signals-core");
}

echo(chalk.blueBright("Packaging to-do application."));

const distDir = getDistPath();
const todoDistPath = getTodoDistPath();
const todoCodePath = getTodoCodePath();

echo("Creating `dist` directory.");

await $`rm -rf ${distDir}`;
await $`mkdir -p ${getDistPath()}`;

echo("Copying to-do app code.");

await $`cp -r ${todoCodePath} ${todoDistPath}`;

echo("Copying shared-components code.");

const sharedComponentsCodePath = getSharedComponentsCodePath();
const sharedComponentsDistPath = getSharedComponentsDistPath();
await $`cp -r ${sharedComponentsCodePath} ${sharedComponentsDistPath}`;

echo("Copying third-party dependencies.");

const signalsCorePath = getSignalsCorePath();
const signalsCoreDistPath = getSignalsCoreDistPath();
await $`mkdir -p ${signalsCoreDistPath}`;
await $`cp ${signalsCorePath} ${signalsCoreDistPath}`;

echo("Archiving files.");
cd(distDir);
await $`tar -cf todo.tgz todo/*`;
cd("..");

echo("Cleaning up.");
await $`rm -rf ${todoDistPath}`;

echo(chalk.green("Todo app successfully packaged."));
process.exit();
