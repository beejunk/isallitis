import {
  createStyleSheet,
  CustomElement,
} from "@isallitis/shared-components/custom-element.js";
import { css, html } from "@isallitis/shared-components/utils.js";
import { defaultSheet } from "@isallitis/shared-components/styles/style-sheets.js";
import { effect, signal } from "@preact/signals-core";
import { register } from "./register.js";

/**
 * Enables the service worker. Set this to `false` during development so that
 * assets are not cached.
 */
const ENABLE_SW = true;

// ---------------------------------------
// TodoNav - Navigation bar for all views.
// ---------------------------------------

export const todoLinkCSS = createStyleSheet(css`
  a {
    border: 1px solid var(--color-primary);
    border-radius: var(--space-s);
    color: var(--color-primary);
    font-size: var(--text-s);
    padding: var(--space-s);
    text-decoration: none;
  }

  a.active {
    background-color: var(--color-primary);
    color: var(--color-primary-on);
  }
`);

const todoNavCSS = createStyleSheet(css`
  nav {
    align-items: center;
    background-color: var(--color-primary-on);
    border-top: dotted 2px var(--color-primary);
    display: flex;
    gap: var(--space-m);
    padding: var(--space-m);
  }

  #add-button {
    display: flex;
    flex-grow: 1;
    justify-content: flex-end;
  }
`);

class TodoNav extends CustomElement {
  static styles = [defaultSheet, todoNavCSS, todoLinkCSS];

  connectedCallback() {
    super.connectedCallback();
    this.setActiveLink();
  }

  setActiveLink() {
    const { pathname } = window.location;
    const activeLinkEl = this.getSelector(`a[href="${pathname}"]`);
    activeLinkEl.classList.add("active");
  }

  render() {
    return html`
      <nav>
        <a href="/">To Do</a>
        <a href="/template-lists.html">Templates</a>
        <div id="add-button">
          <slot name="add-button"></slot>
        </div>
      </nav>
    `;
  }
}

CustomElement.define("todo-nav", TodoNav);

// ---------------------------------------------------------------
// TodoAppVersion - Display current version of the service-worker.
// ---------------------------------------------------------------

const todoAppVersionCSS = createStyleSheet(css`
  :host {
    display: flex;
    flex-grow: 1;
    justify-content: flex-end;
  }

  p {
    font-size: var(--text-s);
  }
`);

class TodoAppVersion extends CustomElement {
  static styles = [defaultSheet, todoAppVersionCSS];

  #versionSignal = signal("v0.0.0-dev");

  get version() {
    return this.#versionSignal.value;
  }

  /**
   * @param {string} verStr
   */
  set version(verStr) {
    this.#versionSignal.value = verStr;
  }

  connectedCallback() {
    super.connectedCallback();
    this.requestAppVersion();

    effect(() => {
      const version = this.version;
      const versionEl = this.shadowRoot?.querySelector("p > em");

      if (versionEl) {
        versionEl.innerHTML = version;
      }
    });
  }

  async requestAppVersion() {
    const registration = await window.navigator.serviceWorker.ready;

    window.navigator.serviceWorker.addEventListener("message", (event) => {
      if (typeof event.data.version === "string") {
        this.version = event.data.version;
      }
    });

    registration.active?.postMessage({ type: "VERSION_REQUESTED" });
  }

  render() {
    return html`<p><em>${this.version}</em></p>`;
  }
}

CustomElement.define("todo-app-version", TodoAppVersion);

// ------------------------------------------------
// TodoAppLayout - Shared layout for all app views.
// ------------------------------------------------

const todoLayoutCSS = createStyleSheet(css`
  :host {
    align-content: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: calc(var(--space-m));
    min-height: 100vh;
    margin: 0 auto;
    padding-left: var(--space-m);
    padding-right: var(--space-m);
    max-width: 600px;
    width: 100%;
  }

  #list {
    flex-grow: 1;
  }

  header {
    align-items: center;
    display: flex;
    gap: 16px;
    padding: 16px 0;
  }

  header h1,
  header p {
    margin: 0;
  }

  ${TodoNav} {
    bottom: 0;
    margin-left: calc(-1 * var(--space-m));
    margin-right: calc(-1 * var(--space-m));
    position: sticky;
    right: 0;
  }
`);

export class TodoAppLayout extends CustomElement {
  static styles = [defaultSheet, todoLayoutCSS];

  async connectedCallback() {
    super.connectedCallback();

    if (ENABLE_SW) {
      await register();
    }
  }

  render() {
    return html`
      <header>
        <h1>To-Do</h1>
        <p><em>Is All It Is</em></p>
        <${TodoAppVersion}></${TodoAppVersion}>
      </header>
        
      <slot name="title"></slot>
        
      <div id="list">
        <slot name="list"></slot>
      </div>

      <slot name="dialog"></slot>
        
      <${TodoNav}>
        <slot slot="add-button" name="add-button"></slot>
      </${TodoNav}>
    `;
  }
}

CustomElement.define("todo-app-layout", TodoAppLayout);
