import { expect } from "chai";

import { html } from "../../components/utils.js";
import { Button } from "../../components/button/button-custom-element.js";
import { PenToSquare } from "../../components/pen-to-square/pen-to-square-custom-element.js";
import { createRender } from "../test-components.js";

const SUITE_ID = `${Button}-test`;

const render = createRender(SUITE_ID);

describe(`<${Button}>`, () => {
  it("should render button with default styles", () => {
    const { getByShadowRole } = render(html`<${Button}>Default</${Button}>`);

    const button = getByShadowRole("button", { name: /default/i });

    expect(button.classList.toString()).to.include("default");
    expect(button.classList.toString()).to.include("radius-small");
  });

  it("should render button with medium radius", () => {
    const { getByShadowRole } = render(
      html`
        <${Button} radius="medium">
          Medium Radius
        </${Button}>`,
    );

    const button = getByShadowRole("button", { name: /medium/i });

    expect(button.classList.toString()).to.include("default");
    expect(button.classList.toString()).to.include("radius-medium");
  });

  it("should render button with large radius", () => {
    const { getByShadowRole } = render(
      html`
        <${Button} radius="large">
          Large Radius
        </${Button}>`,
    );

    const button = getByShadowRole("button", { name: /large/i });

    expect(button.classList.toString()).to.include("default");
    expect(button.classList.toString()).to.include("radius-large");
  });

  it("should render button with round radius", () => {
    const { getByShadowRole } = render(
      html`
        <${Button} radius="round">
          <${PenToSquare}>Round</${PenToSquare}>
        </${Button}>`,
    );

    const button = getByShadowRole("button", { name: /round/i });

    expect(button.classList.toString()).to.include("default");
    expect(button.classList.toString()).to.include("radius-round");
  });
});
