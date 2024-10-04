import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { renderToString } from "preact-render-to-string";
import { html } from "htm/preact";
import { Code } from "../../../../src/blog/components/code.js";

describe("<Code>", () => {
  test("should render code as-is", () => {
    const code = `<link rel="alternate" href="rss.xml" type="application/rss+xml" title="RSS" />`;
    const codeExpected = `&#x3C;link rel=&#x22;alternate&#x22; href=&#x22;rss.xml&#x22; type=&#x22;application/rss+xml&#x22; title=&#x22;RSS&#x22; /&#x3E;`;
    const expected = `<pre><code class="language-markup">${codeExpected}</code></pre>`;

    const actual = renderToString(html`
      <${Code} language="markup" src=${code} />
    `);

    assert.equal(actual, expected);
  });
});