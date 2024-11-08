import { z } from "zod";

/** @typedef {import("preact").FunctionComponent} FunctionComponent */

const EntryLinkSchema = z.object({
  title: z.string(),
  url: z.string(),
  description: z.string().optional(),
});

export const EntryModuleSchema = z.object({
  body: z.unknown(),
  links: z.array(EntryLinkSchema).default([]),
});

/** @typedef {z.infer<typeof EntryModuleSchema>} EntryModuleSchemaType */

/**
 * @typedef {Object} EntryModuleBodyExport
 * @prop {FunctionComponent} body
 */

/**
 * @typedef {EntryModuleSchemaType & EntryModuleBodyExport} EntryModule
 */

/**
 * @param {EntryModuleSchemaType} entryModule
 * @returns {asserts entryModule is EntryModule}
 */
export function assertBodyExport(entryModule) {
  if (typeof entryModule.body !== "function") {
    throw new Error(`Entry module does not have 'body' export.`);
  }
}
