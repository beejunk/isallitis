/**
 * Serves static assets for executing unit tests in a browser.
 */

import path from "node:path";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";

const PORT = Number(process.env.PORT ?? 3000);

function getSrcPath() {
  const srcUrl = new URL(path.join("..", "src"), import.meta.url);

  return srcUrl.pathname;
}

function getTestClientPath() {
  const testClientUrl = new URL(
    path.join("..", "test-client"),
    import.meta.url,
  );

  return testClientUrl.pathname;
}

const server = Fastify({
  logger: true,
});

// -----------
// Source code
// -----------

server.register(fastifyStatic, {
  root: getSrcPath(),
  prefix: "/src",
  decorateReply: false,
});

// -----------
// Unit tests.
// -----------

server.register(fastifyStatic, {
  root: getTestClientPath(),
  prefix: "/",
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

server.register(fastifyStatic, {
  root: path.resolve(
    "node_modules",
    "@testing-library",
    "dom",
    "dist",
    "@testing-library",
  ),
  prefix: "/testing-library-dom",
  decorateReply: false,
});

server.register(fastifyStatic, {
  root: path.resolve("node_modules", "shadow-dom-testing-library", "dist"),
  prefix: "/shadow-dom-testing-library",
  decorateReply: false,
});

// -------------
// Server start.
// -------------

try {
  await server.listen({ port: PORT });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
