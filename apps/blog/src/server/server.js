import Fastify from "fastify";
import { homeTemplate } from "../templates/home.js";

const PORT = Number(process.env.PORT ?? 3000);

const server = Fastify({
  logger: true,
});

server.get("/", (_request, reply) => {
  reply.type("text/html").send(homeTemplate());
});

try {
  await server.listen({ port: PORT });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
