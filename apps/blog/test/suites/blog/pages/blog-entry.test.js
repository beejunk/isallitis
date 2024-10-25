import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { blogEntryFixture } from "../../../fixtures/blog-entry-fixture.js";
import { mockBlog } from "../../../fixtures/mock-blog.js";
import { getEntryPageView } from "../../../../src/views/views.js";
import path from "node:path";

describe("<BlogEntry>", async () => {
  const entriesBaseURL = new URL(
    path.join("..", "..", "..", "fixtures", "entries"),
    import.meta.url,
  );
  const entry = await getEntryPageView(mockBlog, {
    entriesBaseURL,
    slug: "test-entry-1",
  });

  test("should display entry title", () => {
    const { screen } = blogEntryFixture(entry);
    assert.ok(screen.getByText(entry.pageHeading));
  });

  test("should include entry title with site title", () => {
    const { document } = blogEntryFixture(entry);
    const titleEl = document.getElementsByTagName("title")[0];

    assert.match(titleEl?.innerHTML, new RegExp(entry.pageTitle));
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
