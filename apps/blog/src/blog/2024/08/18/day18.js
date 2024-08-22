import { entries } from "./entries.js";
import { aBlogIsAllItDoes } from "./entries/a-blog-is-all-it-is.js";

/** @type {import("../../../blog.js").BlogDay} */
export const day18 = {
  day: 18,
  entries: {
    [aBlogIsAllItDoes.slug]: aBlogIsAllItDoes,
  },
};
