import { CustomElement } from "../custom-element.js";
import { Button } from "../button/custom-element.js";
import { styles, shadowHTML, TAG } from "./template.js";
import { createStyleSheet } from "../custom-element.js";
import "../circle-xmark/custom-element.js";

const styleSheet = createStyleSheet(styles);

export class Dialog extends CustomElement {
  static styles = [styleSheet];

  constructor() {
    super();

    this.getCloseButton = this.getCloseButton.bind(this);
    this.getDialog = this.getDialog.bind(this);
    this.handleAnimationEnd = this.handleAnimationEnd.bind(this);
    this.handleCancelEvent = this.handleCancelEvent.bind(this);
    this.handleCloseButtonClick = this.handleCloseButtonClick.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

  getDialog() {
    const dialog = this.shadowRoot?.querySelector("dialog");

    if (!(dialog instanceof HTMLDialogElement)) {
      throw new Error("Could not find <dialog> element in shadow root.");
    }

    return dialog;
  }

  getCloseButton() {
    const button = this.shadowRoot?.querySelector(`${Button}`);

    if (!(button instanceof Button)) {
      throw new Error(`Could not find ${Button} in ${Dialog}.`);
    }

    return button;
  }

  handleAnimationEnd() {
    const dialog = this.getDialog();

    dialog.addEventListener("close", this.handleDialogClose);
    dialog.close();
    dialog.removeEventListener("animationend", this.handleAnimationEnd);
  }

  /**
   * @param {Event} event
   */
  handleCancelEvent(event) {
    event.preventDefault();

    const dialog = this.getDialog();

    if (!dialog.classList.contains("hide")) {
      dialog.addEventListener("animationend", this.handleAnimationEnd);
      dialog.classList.add("hide");
    }

    dialog.removeEventListener("cancel", this.handleCancelEvent);
  }

  handleCloseButtonClick() {
    const closeButton = this.getCloseButton();
    const dialog = this.getDialog();

    if (!dialog.classList.contains("hide")) {
      dialog.addEventListener("animationend", this.handleAnimationEnd);
      dialog.classList.add("hide");
    }

    closeButton.removeEventListener("click", this.handleCloseButtonClick);
  }

  handleDialogClose() {
    const dialog = this.getDialog();

    dialog.classList.remove("hide");
    dialog.removeEventListener("close", this.handleDialogClose);
  }

  render() {
    return shadowHTML();
  }

  showModal() {
    const dialog = this.getDialog();
    // TODO Need to figure out why render won't autofocus.
    const closeButton = this.getCloseButton();

    closeButton.addEventListener("click", this.handleCloseButtonClick);
    dialog.addEventListener("cancel", this.handleCancelEvent);
    dialog.showModal();
  }
}

CustomElement.define(TAG, Dialog);
