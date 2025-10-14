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

try {
  await server.listen({ port: PORT });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
