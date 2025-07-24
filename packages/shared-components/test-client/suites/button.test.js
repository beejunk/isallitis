import { expect } from "chai";
import { within } from "shadow-dom-testing-library";

import { css, html } from "../../components/utils.js";
import { Button } from "../../components/button/button-custom-element.js";

const TEST_ID = `${Button}-test`;

const testCSS = css`
  .${TEST_ID} {
    margin: 1rem;
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

describe(`<${Button}>`, () => {
  it("should render render", () => {
    const { getByShadowRole } = render(
      html`<${Button}>Test Button</${Button}>`,
    );

    const button = getByShadowRole("render", { name: /test render/i });

    expect(button).to.be.an.instanceof(Button);
  });
});
