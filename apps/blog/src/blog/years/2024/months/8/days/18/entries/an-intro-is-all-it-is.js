import { html } from "../../../../../../../blog-utils.js";

const title = "An Intro Is All It Is";

const slug = "an-intro-is-all-it-is";

const hour = 11;

const minute = 52;

const body = html`<p>It's a blog!</p>`;

/** @type {import("../../../../../../../blog.js").BlogEntry} */
export const anIntroIsAllItIs = {
  body,
  hour,
  minute,
  slug,
  title,
};
