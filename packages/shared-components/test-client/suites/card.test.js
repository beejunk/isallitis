import { expect } from "chai";
import { within } from "@testing-library/dom";

import { css, html } from "../../components/utils.js";
import { Card } from "../../components/card/card-custom-element.js";

const TEST_ID = `${Card}-test`;

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

describe(`<${Card}>`, () => {
  it("should render card body copy", () => {
    const { getByText } = render(
      html`<${Card} max-width="300px"><p>Card Text</p></${Card}>`,
    );

    expect(() => {
      getByText(/card text/i);
    }).to.not.throw();
  });

  it("should render card header", () => {
    const { getByText } = render(html`
      <${Card} max-width="300px">
        <p slot="header">Card Header</p>
        <p>Card Text</p>
      </${Card}>
    `);

    expect(() => {
      getByText(/card header/i);
    }).to.not.throw();
  });
});
