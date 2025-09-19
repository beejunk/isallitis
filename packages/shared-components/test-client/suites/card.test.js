import { expect } from "chai";

import { html } from "../../components/utils.js";
import { Card } from "../../components/card/card-custom-element.js";
import { createRender } from "../test-components.js";

const SUITE_ID = `${Card}-test`;

const render = createRender(SUITE_ID);

describe(`<${Card}>`, () => {
  it("should render card body copy", () => {
    const { getByShadowText } = render(
      html`
        <${Card} max-width="300px" style="max-width: 300px">
          <p>Card Text</p>
        </${Card}>`,
    );

    expect(getByShadowText(/card text/i)).to.be.instanceof(
      HTMLParagraphElement,
    );
  });

  it("should render card header", () => {
    const { getByShadowText } = render(html`
      <${Card} with-header="true" style="max-width: 300px">
        <p slot="header">Card Header</p>
        <p>Card Text</p>
      </${Card}>
    `);

    expect(getByShadowText(/card header/i)).to.be.instanceof(
      HTMLParagraphElement,
    );
  });
});
