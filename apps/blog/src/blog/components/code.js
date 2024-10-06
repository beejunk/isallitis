import { html } from "htm/preact";
import he from "he";

/**
 * @param {string} src
 */
function withBackTicks(src) {
  return `\`${src}\``;
}
/**
 * @param {Object} props
 * @param {boolean} [props.inline=false]
 * @param {string} [props.language="javascript"]
 * @param {string} props.src
 */
export function Code(props) {
  const { src, inline, language = "javascript" } = props;

  if (inline) {
    return html`
      ${" "}
      <code
        class="language-${language}"
        dangerouslySetInnerHTML=${{ __html: he.encode(withBackTicks(src)) }}
      />
      ${" "}
    `;
  }

  return html`
    <figure class="code">
      <figcaption class="visually-hidden">Code Snippet</figcaption>

      <pre aria-hidden>
        <code
          class="language-${language}"
          dangerouslySetInnerHTML=${{ __html: he.encode(src) }}
        />
      </pre>

      <pre class="visually-hidden">
        <code dangerouslySetInnerHTML=${{ __html: he.encode(src) }} />
      </pre>
    </figure>
  `;
}
