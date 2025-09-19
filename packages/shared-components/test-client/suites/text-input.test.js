import { expect } from "chai";

import { html } from "../../components/utils.js";
import { TextInput } from "../../components/text-input/text-input-custom-element.js";
import { createRender } from "../test-components.js";

const SUITE_ID = `${TextInput}-test`;

const render = createRender(SUITE_ID);

describe(`<${TextInput}>`, () => {
  it("should render form with expected label", () => {
    const { getByShadowRole } = render(
      html`<${TextInput}>Test Input</${TextInput}>`,
    );

    const input = getByShadowRole("textbox", { name: /test input/i });

    expect(input).to.be.instanceof(HTMLInputElement);
  });
});
