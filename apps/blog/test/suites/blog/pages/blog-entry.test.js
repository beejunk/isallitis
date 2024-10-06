import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { blogEntryFixture } from "../../../fixtures/blog-entry-fixture.js";
import { getFirstEntry } from "../../../../src/blog/signals/signals.js";

describe("<BlogEntry>", () => {
  const entry = getFirstEntry();

  test("should display entry title", () => {
    const { screen } = blogEntryFixture(entry);
    assert.ok(screen.getByText(entry.title));
  });

  test("should include entry title with site title", () => {
    const { document } = blogEntryFixture(entry);
    const titleEl = document.getElementsByTagName("title")[0];

    assert.match(titleEl?.innerHTML, new RegExp(entry.title));
  });

  test("should include bread crumb", () => {
    const { screen } = blogEntryFixture(entry);
    const { year, month, day } = entry;
    const yearLink = screen.getByRole("link", { name: year.toString() });
    const monthLink = screen.getByRole("link", {
      name: month.toString(),
    });
    const dayLink = screen.getByRole("link", { name: day.toString() });

    assert.ok(yearLink);
    assert.ok(monthLink);
    assert.ok(dayLink);
  });
});
