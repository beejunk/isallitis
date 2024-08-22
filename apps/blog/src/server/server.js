import Fastify from "fastify";
import { blog } from "../blog/blog.js";
import { createHTMLMap } from "../blog/html-map.js";
import { getBlogPath } from "../blog/utils.js";

const PORT = Number(process.env.PORT ?? 3000);

const htmlMap = createHTMLMap(blog);

const server = Fastify({
  logger: true,
});

/**
 * @typedef {Object} BlogParams
 * @property {number} year
 * @property {number} month
 * @property {number} day
 * @property {string} slug
 */

server.get(
  "/:year/:month/:day/:slug",
  {
    schema: {
      params: {
        par1: { type: "number", minimum: 2024, maximum: 2100 },
        par2: { type: "number", minimum: 1, maximum: 12 },
        par3: { type: "number", minimum: 0, maximum: 23 },
        par4: { type: "string", minimum: 0, maximum: 59 },
      },
    },
  },
  /**
   * @param {import("fastify").FastifyRequest<{ Params: BlogParams }>} request
   * @param {import("fastify").FastifyReply} reply
   */
  (request, reply) => {
    const { year, month, day, slug } = request.params;
    const path = getBlogPath(year, month, day, slug);
    const html = htmlMap.get(path);
    reply.type("text/html").send(html);
  },
);

try {
  await server.listen({ port: PORT });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
