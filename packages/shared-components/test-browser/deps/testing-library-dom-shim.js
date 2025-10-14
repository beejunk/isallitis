/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

/**
 * `@testing-library/dom` does not publish a bundled ESM source that includes
 * dependencies. To avoid having to serve static assets for all of Testing Library
 * DOM's dependencies, the UMD module is used in the test HTML and this shim is
 * added to the import map. Yes, this is very tedious.
 */

export const getConfig = window.TestingLibraryDom.getConfig;

export const logDOM = window.TestingLibraryDom.logDOM;

export const queryAllByPlaceholderText =
  window.TestingLibraryDom.queryAllByPlaceholderText;

export const prettyDOM = window.TestingLibraryDom.prettyDOM;

export const queryAllByDisplayValue =
  window.TestingLibraryDom.queryAllByDisplayValue;

export const queryAllByText = window.TestingLibraryDom.queryAllByText;

export const configure = window.TestingLibraryDom.configure;

export const queryAllByRole = window.TestingLibraryDom.queryAllByRole;

export const queryAllByAltText = window.TestingLibraryDom.queryAllByAltText;

export const queryAllByLabelText = window.TestingLibraryDom.queryAllByLabelText;

export const screen = window.TestingLibraryDom.screen;

export const queryAllByTitle = window.TestingLibraryDom.queryAllByTitle;

export const within = window.TestingLibraryDom.within;

export const queryAllByTestId = window.TestingLibraryDom.queryAllByTestId;

export const buildQueries = window.TestingLibraryDom.buildQueries;

export const queries = window.TestingLibraryDom.queries;
