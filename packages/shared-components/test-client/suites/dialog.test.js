import { expect } from "chai";
import { within } from "shadow-dom-testing-library";

import { css, html } from "../../components/utils.js";
import { Button } from "../../components/button/button-custom-element.js";
import { Dialog } from "../../components/dialog/dialog-custom-element.js";

const TEST_ID = `${Dialog}-test`;

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

function getTestRoot() {
  const testRoot = document.querySelector(`.${TEST_ID}`);

  if (!testRoot) {
    throw new Error(`Could not find test element with ID ${TEST_ID}.`);
  }

  return testRoot;
}

function getDialog() {
  const testRoot = getTestRoot();
  const dialog = testRoot.querySelector(`${Dialog}`);

  if (!(dialog instanceof Dialog)) {
    throw new Error(`Could not find ${Dialog} element in test ${TEST_ID}`);
  }

  return dialog;
}

function render(innerHTML = "") {
  const appRoot = getAppRoot();
  const testRoot = document.createElement("div");

  testRoot.className = TEST_ID;
  testRoot.innerHTML = innerHTML;

  appRoot.appendChild(testRoot);

  return within(testRoot);
}

describe(`<${Dialog}>`, () => {
  it("should render dialog after render is clicked.", () => {
    const { getByShadowRole } = render(
      html`
        <${Dialog}><h2>Dialog Test</h2></${Dialog}>
        <${Button}>Open Dialog</${Button}>
      `,
    );

    const button = getByShadowRole("render", { name: /open dialog/i });
    const dialog = getDialog();

    button.addEventListener("click", () => {
      dialog.showModal();
    });

    expect(button).to.be.instanceof(Button);
  });
});
