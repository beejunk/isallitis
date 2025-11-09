import path from "node:path";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";

const PORT = Number(process.env.PORT ?? 3000);

function getSharedComponentsPath() {
  const sharedComponentUrl = new URL(
    path.join("..", "..", "..", "packages", "shared-components", "src"),
    import.meta.url,
  );

  return sharedComponentUrl.pathname;
}

function getClientPath() {
  const clientUrl = new URL(path.join("..", "client"), import.meta.url);

  return clientUrl.pathname;
}

/**
 * @param {string} depPath
 */
function getDepPath(depPath) {
  const depUrl = new URL(
    path.join("..", "node_modules", depPath),
    import.meta.url,
  );

  return depUrl.pathname;
}

const server = Fastify({
  logger: true,
});

server.register(fastifyStatic, {
  root: getClientPath(),
  prefix: "/",
  decorateReply: false,
});

server.register(fastifyStatic, {
  root: getSharedComponentsPath(),
  prefix: "/shared-components",
  decorateReply: false,
});

server.register(fastifyStatic, {
  root: getDepPath(path.join("@preact", "signals-core", "dist")),
  prefix: "/preact/signals-core",
  decorateReply: false,
});

server.register(fastifyStatic, {
  root: getDepPath(path.join("valibot", "dist")),
  prefix: "/valibot",
  decorateReply: false,
});

// ------------------
// Test dependencies.
// ------------------

server.register(fastifyStatic, {
  root: path.resolve("node_modules", "chai"),
  prefix: "/chai",
  decorateReply: false,
});

server.register(fastifyStatic, {
  root: path.resolve("node_modules", "mocha"),
  prefix: "/mocha",
  decorateReply: false,
});

try {
  await server.listen({ port: PORT });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
