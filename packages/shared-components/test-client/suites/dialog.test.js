import { expect } from "chai";

import { html } from "../../components/utils.js";
import { Button } from "../../components/button/button-custom-element.js";
import { Dialog } from "../../components/dialog/dialog-custom-element.js";
import { createRender } from "../test-components.js";

const SUITE_ID = `${Dialog}-test`;

const render = createRender(SUITE_ID);

describe(`<${Dialog}>`, () => {
  it("should render dialog after render is clicked.", () => {
    const { container, getByShadowRole } = render(
      html`
        <${Dialog}><h2>Dialog Test</h2></${Dialog}>
        <${Button}>Open Dialog</${Button}>
      `,
    );

    const button = getByShadowRole("button", { name: /open dialog/i });
    const dialog = container.getCustomElement(Dialog);

    button.addEventListener("click", () => {
      dialog.showModal();
    });

    // NOTE: This test is only for visually validating the dialog, but otherwise
    // does not assert against any functionality. This assertion is here as a
    // placeholder.
    expect(button).to.be.instanceof(HTMLButtonElement);
  });
});
