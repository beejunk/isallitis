import fs from "node:fs";
import Fastify from "fastify";
import { blog } from "../blog/blog.js";
import { createRouteMap } from "../routes/routes.js";

const PORT = Number(process.env.PORT ?? 3000);

const routeMap = createRouteMap(blog, { hostname: `http://localhost:${PORT}` });

const stylesPath = new URL("../blog/styles/styles.css", import.meta.url);

const styles = fs.readFileSync(stylesPath, "utf8");

const server = Fastify({
  logger: true,
});

server.get("/styles.css", (_request, reply) => {
  reply.type("text/css").send(styles);
});

routeMap.forEach((routeData, path) => {
  server.get(`${path}.${routeData.ext}`, (_request, reply) => {
    reply.type(routeData.mime).send(routeData.content);
  });
});

try {
  await server.listen({ port: PORT });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
