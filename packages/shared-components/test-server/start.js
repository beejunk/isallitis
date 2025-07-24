/**
 * Serves static assets for executing unit tests in a browser.
 */

import path from "node:path";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";

const PORT = Number(process.env.PORT ?? 3000);

const server = Fastify({
  logger: true,
});

// -----------
// Source code
// -----------

server.register(fastifyStatic, {
  root: path.resolve("components"),
  prefix: "/components",
  decorateReply: false,
});

// -----------
// Unit tests.
// -----------

server.register(fastifyStatic, {
  root: path.resolve("test-client"),
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
