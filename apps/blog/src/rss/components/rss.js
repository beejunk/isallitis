import { html } from "htm/preact";
import { Channel } from "./channel.js";

export function RSS() {
  return html`
    <rss version="2.0">
      <${Channel} />
    </rss>
  `;
}
