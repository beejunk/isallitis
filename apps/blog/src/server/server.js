import fs from "node:fs";
import Fastify from "fastify";
import { compileRouteMap } from "../routes/routes.js";
import { loadBlog } from "../utils/blog-utils.js";

const PORT = Number(process.env.PORT ?? 3000);

const blog = await loadBlog();

const routeMap = await compileRouteMap(blog);

const stylesPath = new URL("../styles/styles.css", import.meta.url);
const prismJSPath = new URL("../../vendors/prism/prism.js", import.meta.url);
const prismCSSPath = new URL("../../vendors/prism/prism.css", import.meta.url);

const styles = fs.readFileSync(stylesPath, "utf8");
const prismJS = fs.readFileSync(prismJSPath, "utf8");
const prismCSS = fs.readFileSync(prismCSSPath, "utf8");

const server = Fastify({
  logger: true,
});

server.get("/styles.css", (_request, reply) => {
  reply.type("text/css").send(styles);
});

server.get("/vendors/prism/prism.js", (_request, reply) => {
  reply.type("text/javascript").send(prismJS);
});

server.get("/vendors/prism/prism.css", (_request, reply) => {
  reply.type("text/css").send(prismCSS);
});

routeMap.forEach((routeData, path) => {
  server.get(`${path}.${routeData.ext}`, (_request, reply) => {
    reply.type(routeData.mime).send(routeData.content);
  });

  if (path === "/index") {
    server.get("/", (_request, reply) => {
      reply.type(routeData.mime).send(routeData.content);
    });
  } else {
    server.get(path, (_request, reply) => {
      reply.type(routeData.mime).send(routeData.content);
    });
  }
});

try {
  await server.listen({ port: PORT });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
