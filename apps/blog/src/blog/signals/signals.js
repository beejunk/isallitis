import { computed, signal } from "@preact/signals";
import { blog } from "../blog.js";
import { reduceBlogToEntryData } from "../blog-utils.js";

/** @typedef {import("../blog-utils.js").EntryData} EntryData */

export const blogSignal = signal(blog);

export const blogData = computed(() => {
  const entryData = reduceBlogToEntryData(blogSignal.value);
  /** @type Array<string> */
  const slugs = [];

  /** @type {Record<string, EntryData>} */
  const entriesBySlug = {};

  entryData.forEach((entry) => {
    slugs.push(entry.slug);
    entriesBySlug[entry.slug] = entry;
  });

  return {
    blogTitle: blogSignal.value.title,
    entriesBySlug,
    slugs,
    sortedEntries: entryData,
  };
});

export function getFirstEntry() {
  const firstEntry = blogData.value.sortedEntries[0];

  if (!firstEntry) {
    throw new Error("Unable to find first blog entry.");
  }

  return firstEntry;
}
