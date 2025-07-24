import { expect } from "chai";
import { within } from "shadow-dom-testing-library";

import { css, html } from "../../components/utils.js";
import { TextInput } from "../../components/text-input/text-input-custom-element.js";

const TEST_ID = `${TextInput}-test`;

const testCSS = css`
  .${TEST_ID} {
    margin: 1rem;
  }

  ${TextInput} {
    max-width: 300px;
  }
`;

const testStyleSheet = new CSSStyleSheet();

testStyleSheet.replaceSync(testCSS);

document.adoptedStyleSheets.push(testStyleSheet);

function getAppRoot() {
  const appRoot = document.getElementById("app");

  if (!appRoot) {
    throw new Error("Unable to find test app root element.");
  }

  return appRoot;
}

function render(innerHTML = "") {
  const appRoot = getAppRoot();
  const testRoot = document.createElement("div");

  testRoot.className = TEST_ID;
  testRoot.innerHTML = innerHTML;

  appRoot.appendChild(testRoot);

  return within(testRoot);
}

describe(`<${TextInput}>`, () => {
  it("should render form with expected label", () => {
    const { getByShadowRole } = render(
      html`<${TextInput}>Test Input</${TextInput}>`,
    );

    const input = getByShadowRole("textbox", { name: /test input/i });

    expect(input).to.be.instanceof(TextInput);
  });
});
