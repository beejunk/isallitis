import path from "node:path";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";

const PORT = Number(process.env.PORT ?? 3000);

const server = Fastify({
  logger: true,
});

server.register(fastifyStatic, {
  root: path.resolve("client"),
  prefix: "/",
  decorateReply: false,
});

server.register(fastifyStatic, {
  root: path.resolve("..", "..", "packages", "shared-components", "components"),
  prefix: "/shared-components",
  decorateReply: false,
});

server.register(fastifyStatic, {
  root: path.resolve("node_modules", "@preact", "signals-core", "dist"),
  prefix: "/preact-signals-core",
  decorateReply: false,
});

try {
  await server.listen({ port: PORT });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
