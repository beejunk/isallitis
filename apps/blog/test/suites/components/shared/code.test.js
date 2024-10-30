import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { renderToString } from "preact-render-to-string";
import { html } from "htm/preact";
import { Code } from "../../../../src/components/shared/code.js";

describe("<Code>", () => {
  test("should take raw code as a prop and render the code with HTML escape characters", () => {
    const code = `<link rel="alternate" href="rss.xml" type="application/rss+xml" title="RSS" />`;
    const codeExpected = `&#x3C;link rel=&#x22;alternate&#x22; href=&#x22;rss.xml&#x22; type=&#x22;application/rss+xml&#x22; title=&#x22;RSS&#x22; /&#x3E;`;

    const actual = renderToString(
      html`<${Code} language="markup" src=${code} />`,
    );

    assert.ok(actual.includes(codeExpected));
  });
});
