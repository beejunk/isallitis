import { CustomElement, createStyleSheet } from "../src/custom-element.js";
import { css, html, tag } from "../src/utils.js";
import { within } from "shadow-dom-testing-library";

const unitTestCSS = createStyleSheet(css`
  :host {
    display: block;
    padding: var(--space-m);
  }
`);

export class UnitTest extends CustomElement {
  static styles = [unitTestCSS];

  render() {
    return html`<div class="unit-test"><slot></slot></div>`;
  }
}

CustomElement.define(tag`unit-test`, UnitTest);

const testSuiteCSS = createStyleSheet(css`
  :host {
    display: block;
    background-color: var(--color-surface-default);
    border: 2px dashed var(--color-surface-raised);
    border-radius: var(--space-s);
    margin: var(--space-m);
  }
`);

export class TestSuite extends CustomElement {
  static styles = [testSuiteCSS];
}

CustomElement.define(tag`test-suite`, TestSuite);

function getTestRoot() {
  const appRoot = document.getElementById("tests");

  if (!appRoot) {
    throw new Error("Unable to find root element for tests.");
  }

  return appRoot;
}

/**
 * @param {string} suiteId
 */
export function createRender(suiteId) {
  const testRoot = getTestRoot();
  const testSuite = CustomElement.createElement(TestSuite);

  testSuite.id = suiteId;

  return function render(innerHTML = "") {
    if (!testSuite.shadowRoot) {
      // If there is no `shadowRoot`, the test suite container hasn't been mounted
      // yet.

      // Append the test suite container only during a direct call to `render`,
      // and only if it hasn't already been mounted. This prevents empty test suite
      // containers from rendering in scenarios where the unit tests within the
      // suite aren't executing (such as views that scope to only a subset of tests).
      testRoot.appendChild(testSuite);
    }

    const unitTest = CustomElement.createElement(UnitTest);

    testSuite.getShadowRoot().appendChild(unitTest);
    unitTest.getShadowRoot().innerHTML = innerHTML;

    return { ...within(unitTest), container: unitTest };
  };
}
