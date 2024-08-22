const title = "A Blog Is All It Does";

const slug = "a-blog-is-all-it-is";

const hour = 11;

const minute = 52;

const body = `
  <p>
    It's a blog!
  </p>
`;

/** @type {import("../../../../blog.js").BlogEntry} */
export const aBlogIsAllItDoes = {
  body,
  hour,
  minute,
  slug,
  title,
};
