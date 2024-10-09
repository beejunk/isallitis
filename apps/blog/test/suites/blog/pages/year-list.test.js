import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { html } from "htm/preact";
import { YearList } from "../../../../src/blog/pages/year-list.js";
import { renderStatic } from "../../../test-utils.js";
import { renderToString } from "preact-render-to-string";
import { blogData, blogSignal } from "../../../../src/blog/signals/signals.js";
import { mockBlog } from "../../../fixtures/mock-blog.js";

const TEST_YEAR = 2024;

function yearListFixture() {
  blogSignal.value = mockBlog;

  return renderStatic(html`<${YearList} year=${TEST_YEAR} />`);
}

describe("<YearList>", () => {
  test("should include links for all entries in the year", () => {
    const { screen } = yearListFixture();

    blogData.value.sortedEntries.forEach((entry) => {
      const { year, month, day, title } = entry;
      const linkText = `${year}-${month}-${day}: ${title}`;

      if (year === TEST_YEAR) {
        assert.doesNotThrow(() => screen.getByRole("link", { name: linkText }));
      }
    });
  });

  test("should set the page heading to the year", () => {
    const { screen } = yearListFixture();

    assert.doesNotThrow(() =>
      screen.getByRole("heading", { level: 1, name: "2024" }),
    );
  });

  test("should add year to page title", () => {
    const { document } = yearListFixture();
    const titleEl = document.getElementsByTagName("title")[0];

    assert.match(titleEl?.innerHTML, new RegExp(TEST_YEAR.toString()));
  });
});
