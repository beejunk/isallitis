import { html } from "htm/preact";
import { Channel } from "./channel.js";

/** @typedef {import("../../views/views.js").RSSView} RSSView */

/**
 * @param {RSSView} props
 */
export function RSS(props) {
  return html`
    <rss version="2.0">
      <${Channel} ...${props} />
    </rss>
  `;
}
