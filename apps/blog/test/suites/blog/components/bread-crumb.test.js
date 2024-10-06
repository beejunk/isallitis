import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { renderToString } from "preact-render-to-string";
import { html } from "htm/preact";
import { BreadCrumb } from "../../../../src/blog/components/bread-crumb.js";
import { getScreen } from "../../../test-utils.js";

describe("<BreadCrumb>", () => {
  test("should return link for entry year", () => {
    const { screen } = getScreen(
      renderToString(html`<${BreadCrumb} year=${2024} month=${10} day=${4} />`),
    );

    const yearLinkEl = screen.getByRole("link", { name: "2024" });

    assert.ok(yearLinkEl);
  });

  test("should return link for entry month", () => {
    const { screen } = getScreen(
      renderToString(html`<${BreadCrumb} year=${2024} month=${10} day=${4} />`),
    );

    const yearLinkEl = screen.getByRole("link", { name: "10" });

    assert.ok(yearLinkEl);
  });

  test("should return link for entry day", () => {
    const { screen } = getScreen(
      renderToString(html`<${BreadCrumb} year=${2024} month=${10} day=${4} />`),
    );

    const yearLinkEl = screen.getByRole("link", { name: "4" });

    assert.ok(yearLinkEl);
  });
});
