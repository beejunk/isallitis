export const SEP = "/";

/**
 * @param {import("./blog.js").DateParams} dateParams
 */
export function getBlogPath(...dateParams) {
  return dateParams.join(SEP);
}
