import { type RendererObject, marked } from "marked";
import slug from "slug";
import { css, renderToString } from "~/css";
import * as V from "varsace";
import { anchorStyle } from "~/components/anchor";
import { highlighter, isSupportedLanguage } from "./highlight";

async function getRenderer(): Promise<RendererObject> {
  const hl = await highlighter();
  return {
    blockquote(quote) {
      const [, , alertTypeStr, content] = Array.from(
        quote.match(/^<p>(\[!([A-Z]+)\])?([\S\s]*)$/m) || [],
      );
      const alertType =
        alertTypeStr === "NOTE" || alertTypeStr === "WARNING"
          ? alertTypeStr
          : "NONE";
      const prefix = {
        NONE: "<p>",
        NOTE: `<p><strong style="${renderToString(
          css({
            color: V.blue30,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25em",
          }),
        )}"><svg viewBox="0 -960 960 960" width="1.125em" height="1.125em"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" fill="currentColor" /></svg>Note</strong><br/>`,
        WARNING: `<p><strong style="${renderToString(
          css({
            color: V.orange30,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25em",
          }),
        )}"><svg viewBox="0 0 24 24" width="1.125em" height="1.125em"><path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z" fill="currentColor"/></svg>Warning</strong><br/>`,
      }[alertType];
      return `<blockquote style="${renderToString(
        css({
          borderWidth: 0,
          borderLeftWidth: "8px",
          borderStyle: "solid",
          padding: "0.1px 1em",
          marginLeft: 0,
          marginRight: 0,
          marginBlock: "1.5rem",
          borderColor: V.pink20,
          color: V.gray70,
          background: V.white,
          on: ($, { not }) => [
            $(not("@media (prefers-color-scheme: dark)"), {
              boxShadow: `inset 0 0 0 1px ${V.gray20}`,
            }),
            $("@media (prefers-color-scheme: dark)", {
              borderColor: V.pink60,
              background: V.gray85,
              color: V.gray30,
            }),
          ],
        }),
      )}">${prefix}${content}</blockquote>`;
    },
    code(code, language, escaped) {
      const style = renderToString(
        css({
          fontFamily: "'Inconsolata Variable', monospace",
          fontSize: "1rem",
          overflow: "auto",
          padding: "1rem",
          marginBlock: "1.5rem",
          background: V.white,
          on: ($, { not }) => [
            $(not("@media (prefers-color-scheme: dark)"), {
              boxShadow: `inset 0 0 0 1px ${V.gray20}`,
            }),
            $("@media (prefers-color-scheme: dark)", {
              background: V.gray85,
            }),
          ],
        }),
      );
      if (!escaped && language && isSupportedLanguage(language)) {
        return `<div style="${style}">${hl.highlight(code, { language })}</div>`;
      }
      return `<pre style="${style}"><code style="font:inherit">${
        escaped
          ? code
          : code.replace(
              /[&<>'"]/g,
              tag =>
                ({
                  "&": "&amp;",
                  "<": "&lt;",
                  ">": "&gt;",
                  "'": "&#39;",
                  '"': "&quot;",
                })[tag] || tag,
            )
      }</code></pre>`;
    },
    codespan(text) {
      return `<code style="${renderToString(
        css({
          fontFamily: "'Inconsolata Variable', monospace",
          fontSize: "1em",
          color: V.teal60,
          on: $ => [
            $("@media (prefers-color-scheme: dark)", {
              color: V.teal30,
            }),
          ],
        }),
      )}">${text}</code>`;
    },
    heading(text, level) {
      if (
        level === 1 ||
        level === 2 ||
        level === 3 ||
        level === 4 ||
        level === 5 ||
        level === 6
      ) {
        const [, , step, content] = Array.from(
          text.match(/^(([0-9])\.)?\s*(.*)/m) || [],
        );
        const prefix = step
          ? `<span style="${renderToString(
              css({
                transform: "translateY(-20%)",
                width: "0.75em",
                height: "0.75em",
                display: "inline-grid",
                placeItems: "center",
                borderRadius: 999,
                background: V.pink10,
                color: V.pink50,
                on: $ => [
                  $("@media (prefers-color-scheme: dark)", {
                    background: V.pink50,
                    color: V.pink10,
                  }),
                ],
              }),
            )}"><span style="font-size: 0.5em">${step}</span></span>&nbsp;`
          : "";
        return `<h${level} class="group" style="${renderToString({
          ...[
            {
              fontSize: "2.2rem",
              fontWeight: 400,
              marginBlock: "1.375rem",
            },
            {
              fontSize: "2rem",
              fontWeight: 400,
              marginBlock: "1.5rem",
            },
            {
              fontSize: "1.8rem",
              fontWeight: 400,
              marginBlock: "1.625rem",
            },
            {
              fontSize: "1.6rem",
              fontWeight: 700,
              marginBlock: "1.75rem",
            },
            {
              fontSize: "1.4rem",
              fontWeight: 700,
              marginBlock: "1.875rem",
            },
            {
              fontSize: "1.2rem",
              fontWeight: 700,
              marginBlock: "2rem",
            },
          ][level - 1],
          lineHeight: 1.25,
        })}"><span id="${slug(
          text,
        )}" style="${renderToString({ position: "relative", top: "-6rem" })}"></span><a href="#${slug(text)}" style="${renderToString(
          {
            float: "left",
            marginLeft: "-28px",
            paddingRight: "8px",
            color: "inherit",
          },
        )}"><div style="${renderToString(
          css({
            visibility: "hidden",
            width: "20px",
            on: $ => [
              $(".group:hover &", {
                visibility: "visible",
              }),
            ],
          }),
        )}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></div></a><span>${prefix}${content}</span></h${level}>`;
      }
      return false;
    },
    hr() {
      return `<hr style="${renderToString(
        css({
          margin: "2rem 0",
          border: 0,
          width: "100%",
          height: 1,
          background: V.gray10,
          on: $ => [
            $("@media (prefers-color-scheme: dark)", {
              background: V.gray80,
            }),
          ],
        }),
      )}" />`;
    },
    link(href, title, label) {
      return `<a href="${href}"${
        title ? ` title="${title}"` : ""
      } style="${renderToString(anchorStyle())}">${label}</a>`;
    },
    table(header, body) {
      return `<table style="${renderToString(
        css({
          borderColor: V.gray20,
          borderSpacing: 0,
          borderCollapse: "collapse",
          on: $ => [
            $("@media (prefers-color-scheme: dark)", {
              borderColor: V.gray70,
            }),
          ],
        }),
      )}"><thead>${header}</thead><tbody>${body}</tbody></table>`;
    },
    tablerow(content) {
      return `<tr class="group">${content}</tr>`;
    },
    tablecell(content, flags) {
      const tag = flags.header ? "th" : "td";
      return `<${tag} style="${renderToString(
        css(
          {
            borderWidth: 1,
            borderColor: "inherit",
            borderStyle: "solid",
            padding: "calc(0.375em - 0.5px) 0.75em",
            on: ($, { and, or, not }) => [
              $(
                not(
                  or(
                    "@media (prefers-color-scheme: dark)",
                    ".group:even-child &",
                  ),
                ),
                {
                  background: V.white,
                },
              ),
              $(
                and(
                  not("@media (prefers-color-scheme: dark)"),
                  ".group:even-child &",
                ),
                {
                  background: `color-mix(in srgb, ${V.white}, ${V.gray05})`,
                },
              ),
              $(
                and(
                  "@media (prefers-color-scheme: dark)",
                  not(".group:even-child &"),
                ),
                {
                  background: `color-mix(in srgb, ${V.gray85}, ${V.gray90})`,
                },
              ),
              $(
                and(
                  "@media (prefers-color-scheme: dark)",
                  ".group:even-child &",
                ),
                {
                  background: V.gray85,
                },
              ),
            ],
          },
          flags.align ? { textAlign: flags.align } : undefined,
        ),
      )}">${content}</${tag}>`;
    },
  };
}

export async function render(markdown: string): Promise<string> {
  const renderer = await getRenderer();
  return await marked
    .use({
      gfm: true,
      renderer,
      walkTokens(token) {
        if (token.type === "link") {
          const href = token.href as string;
          token.href = href.replace(/\.md$/, "").replace(/\/index$/, "");
        }
      },
    })
    .parse(markdown);
}
