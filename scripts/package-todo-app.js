import path from "node:path";
import { cd, $, echo, chalk } from "zx";

function getDistPath() {
  const distUrl = new URL(path.join("..", "dist"), import.meta.url);

  return distUrl.pathname;
}

function getTodoDistPath() {
  return path.join(getDistPath(), "todo");
}

function getTodoWorkspacePath() {
  const todoWorkspaceUrl = new URL(
    path.join("..", "apps", "todo"),
    import.meta.url,
  );

  return todoWorkspaceUrl.pathname;
}

function getTodoCodePath() {
  return path.join(getTodoWorkspacePath(), "client");
}

function getNodeModulesPath() {
  return path.join(getTodoWorkspacePath(), "node_modules");
}

function getSharedComponentsCodePath() {
  const appCodeUrl = new URL(
    path.join("..", "packages", "shared-components", "src"),
    import.meta.url,
  );

  return appCodeUrl.pathname;
}

function getSignalsCorePath() {
  return path.join(
    getNodeModulesPath(),
    "@preact",
    "signals-core",
    "dist",
    "signals-core.mjs",
  );
}

function getSignalsCoreDistPath() {
  return path.join(getTodoDistPath(), "preact", "signals-core");
}

function getValibotPath() {
  return path.join(getNodeModulesPath(), "valibot", "dist", "index.min.js");
}

function getValibotDistPath() {
  return path.join(getTodoDistPath(), "valibot");
}

function getSharedComponentsDistPath() {
  return path.join(getTodoDistPath(), "shared-components");
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
const valibotPath = getValibotPath();
const valibotDistPath = getValibotDistPath();

await $`mkdir -p ${signalsCoreDistPath}`;
await $`mkdir -p ${valibotDistPath}`;
await $`cp ${signalsCorePath} ${signalsCoreDistPath}`;
await $`cp ${valibotPath} ${valibotDistPath}`;

echo("Archiving files.");
cd(distDir);
await $`tar -cf todo.tgz todo/*`;
cd("..");

echo("Cleaning up.");
await $`rm -rf ${todoDistPath}`;

echo(chalk.green("Todo app successfully packaged."));
process.exit();
