import fs from "node:fs";
import Fastify from "fastify";
import { blog } from "../blog/blog.js";
import { createHTMLMap } from "../blog/html-map.js";
import { getBlogPath } from "../utils/html-utils.js";

const PORT = Number(process.env.PORT ?? 3000);

const htmlMap = createHTMLMap(blog);

const stylesPath = new URL("../styles/styles.css", import.meta.url);

const styles = fs.readFileSync(stylesPath, "utf8");

const server = Fastify({
  logger: true,
});

server.get("/styles.css", (request, reply) => {
  reply.type("text/css").send(styles);
});

/**
 * @typedef {Object} BlogParams
 * @property {number} year
 * @property {number} month
 * @property {number} day
 * @property {string} slug
 */

server.get(
  "/years/:year/months/:month/days/:day/entries/:slug",
  {
    schema: {
      params: {
        par1: { type: "number", minimum: 2024, maximum: 2100 },
        par2: { type: "number", minimum: 1, maximum: 12 },
        par3: { type: "number", minimum: 0, maximum: 23 },
        par4: { type: "string" },
      },
    },
  },
  /**
   * @param {import("fastify").FastifyRequest<{ Params: BlogParams }>} request
   * @param {import("fastify").FastifyReply} reply
   */
  (request, reply) => {
    const path = getBlogPath(request.params);
    const html = htmlMap.get(path);

    reply.type("text/html").send(html);
  },
);

server.get("/", (request, reply) => {
  const html = htmlMap.get("/index");

  reply.type("text/html").send(html);
});

try {
  await server.listen({ port: PORT });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
