/** @jsxImportSource hastscript */

import type { Result } from "hastscript";
import slug from "slug";
import { css, renderToString } from "~/css";
import * as V from "varsace";
import { anchorStyle } from "~/components/anchor";
import rehypeStringify from "rehype-stringify";
import { type Plugin, unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import rehypeShiki from "@shikijs/rehype";
import { z } from "@builder.io/qwik-city";
import { visit } from "unist-util-visit";
import { isElement } from "hast-util-is-element";
import type { CSSProperties } from "@builder.io/qwik";
import type { Element, Parent, Root, RootContent, Text } from "hast";

const findTextNode = (parent: Parent) =>
  isElement(parent)
    ? (function findTextNode(
        node: RootContent,
        index: number,
        parent: Parent,
      ):
        | {
            node: Text;
            index: number;
            parent: Parent;
          }
        | undefined {
        if (node.type === "text" && node.value.trim()) {
          return { node, index, parent };
        }
        if (node.type === "element") {
          for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            const text = findTextNode(child, i, node);
            if (text) {
              return text;
            }
          }
        }
      })(parent, -1, parent)
    : undefined;

function withElement(x: Result, f: (element: Element) => void) {
  if (x.type === "element") {
    f(x);
  }
}

type TagNamePluginOptions<T> = Partial<Record<keyof HTMLElementTagNameMap, T>> &
  (
    | {
        tablecell: (tagName: "td" | "th") => T;
        th?: undefined;
        td?: undefined;
      }
    | { tablecell?: undefined }
  ) &
  (
    | {
        heading: (level: 1 | 2 | 3 | 4 | 5 | 6) => T;
        h1?: undefined;
        h2?: undefined;
        h3?: undefined;
        h4?: undefined;
        h5?: undefined;
        h6?: undefined;
      }
    | { heading?: undefined }
  );

const rehypeAlerts: Plugin<[], Root> = () => {
  return tree =>
    visit(tree, "element", node => {
      if (node.tagName === "blockquote") {
        const text = findTextNode(node);
        if (text) {
          const match = text.node.value.match(/^\s*\[!(NOTE|WARNING)\]\s*(.*)/);
          if (match) {
            const type = z.enum(["NOTE", "WARNING"]).parse(match[1]);
            const restText = match[2];
            text.node.value = restText;
            withElement(
              <p style={renderToString({ margin: 0 })}>
                <strong
                  style={renderToString(
                    css({
                      color: type === "WARNING" ? V.orange30 : V.blue30,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.375em",
                    }),
                  )}
                >
                  <svg
                    viewBox="0 0 16 16"
                    style={renderToString({
                      minWidth: "1em",
                      maxWidth: "1em",
                      minHeight: "1em",
                      maxHeight: "1em",
                      transform: "translateY(-0.0625em)",
                    })}
                  >
                    <path
                      fill="currentColor"
                      d={
                        type === "WARNING"
                          ? "M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
                          : "M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                      }
                    />
                  </svg>
                  {`${type[0]}${type.substring(1).toLowerCase()}`}
                </strong>
              </p>,
              element => text.parent.children.splice(text.index, 0, element),
            );
          }
        }
      }
    });
};

const rehypeClassName: Plugin<
  [TagNamePluginOptions<string>],
  Root
> = options => {
  return tree =>
    visit(tree, "element", node => {
      const { tagName } = node;
      if ((tagName === "td" || tagName === "th") && options.tablecell) {
        node.properties.class = options.tablecell(tagName);
      } else if (/^h[1-6]$/.test(tagName) && options.heading) {
        node.properties.class = options.heading(
          parseInt(tagName[1]) as 1 | 2 | 3 | 4 | 5 | 6,
        );
      } else if (tagName in options) {
        const option = options[tagName as keyof typeof options];
        if (typeof option === "string") {
          node.properties.class = option;
        }
      }
    });
};

const rehypeRewriteElement: Plugin<
  [
    Partial<Record<keyof HTMLElementTagNameMap, (node: Element) => void>> &
      (
        | {
            heading: (node: Element) => void;
            h1?: undefined;
            h2?: undefined;
            h3?: undefined;
            h4?: undefined;
            h5?: undefined;
            h6?: undefined;
          }
        | { heading?: undefined }
      ),
  ],
  Root
> = options => {
  return tree =>
    visit(tree, "element", node => {
      const { tagName } = node;
      const rewrite =
        /^h[1-6]$/.test(tagName) && "heading" in options
          ? options.heading
          : options[tagName as keyof typeof options];
      if (rewrite) {
        rewrite(node);
      }
    });
};

const rehypeStyle: Plugin<
  [TagNamePluginOptions<CSSProperties>],
  Root
> = options => {
  return tree => {
    visit(tree, "element", node => {
      const { tagName } = node;
      if ((tagName === "th" || tagName === "td") && options.tablecell) {
        node.properties.style = renderToString(options.tablecell(tagName));
      } else if (/^h[1-6]$/.test(tagName) && options.heading) {
        const level = parseInt(tagName[1]) as 1 | 2 | 3 | 4 | 5 | 6;
        node.properties.style = renderToString(options.heading(level));
      } else if (tagName in options) {
        const style = options[tagName as keyof typeof options];
        if (typeof style === "object") {
          node.properties.style = renderToString(style);
        }
      }
    });
  };
};

const rehypeTransformHref: Plugin<
  [(href: string) => string],
  Root
> = transform => {
  return tree =>
    visit(tree, "element", node => {
      if (typeof node.properties.href === "string") {
        node.properties.href = transform(node.properties.href);
      }
    });
};

export async function render(markdown: string): Promise<string> {
  const html = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, {
      allowDangerousHtml: true,
    })
    .use(rehypeRaw)
    .use(rehypeTransformHref, url =>
      url
        .replace(/(^|\/)([^/]+)\.md$/, function (_, prefix, basename) {
          return `${prefix}${basename.replace(/\./g, "_")}`;
        })
        .replace(/\/index$/, ""),
    )
    .use(rehypeShiki, {
      themes: {
        dark: "github-dark",
        light: "github-light",
      },
      defaultColor: false,
      transformers: [
        {
          line(line) {
            if (line.children[0]?.type === "element") {
              const node = line.children[0].children[0];
              if (node.type === "text") {
                const diffType =
                  node.value[0] === "+"
                    ? "add"
                    : node.value[0] === "-"
                      ? "remove"
                      : undefined;
                if (diffType) {
                  line.properties["class"] += ` diff ${diffType}`;
                  node.value = node.value.substring(1);
                }
              }
            }
          },
        },
      ],
    })
    .use(rehypeClassName, {
      heading: () => "group",
      tr: "group",
    })
    .use(rehypeStyle, {
      a: anchorStyle(),
      blockquote: css({
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
      code: css({
        fontFamily: "inherit",
        color: "inherit",
        on: ($, { and, not }) => [
          $(not(".shiki > &"), {
            fontFamily: "'Inconsolata Variable', monospace",
            color: V.teal60,
          }),
          $(and("@media (prefers-color-scheme: dark)", not(".shiki > &")), {
            color: V.teal30,
          }),
        ],
      }),
      heading: level => ({
        ...[
          {
            fontSize: "3rem",
            fontWeight: 400,
            marginBlock: "1.25rem",
          },
          {
            fontSize: "2.2rem",
            fontWeight: 400,
            marginBlock: "1.75rem",
          },
          {
            fontSize: "1.8rem",
            fontWeight: 400,
            marginBlock: "2rem",
          },
          {
            fontSize: "1.4rem",
            fontWeight: 400,
            marginBlock: "2.25rem",
          },
          {
            fontSize: "1rem",
            fontWeight: 700,
            marginBlock: "2.5rem",
          },
          {
            fontSize: "0.75rem",
            fontWeight: 700,
            marginBlock: "2.625rem",
          },
        ][level - 1],
        lineHeight: 1.25,
      }),
      hr: css({
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
      p: css({
        margin: "1em 0",
        on: $ => [
          $("&:only-child", {
            margin: 0,
          }),
        ],
      }),
      table: css({
        borderStyle: "solid",
        borderWidth: 1,
        borderSpacing: 0,
        borderCollapse: "collapse",
        borderColor: V.gray20,
        on: $ => [
          $("@media (prefers-color-scheme: dark)", {
            borderColor: V.gray70,
          }),
        ],
      }),
      tablecell: () =>
        css({
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
              and("@media (prefers-color-scheme: dark)", ".group:even-child &"),
              {
                background: V.gray85,
              },
            ),
          ],
        }),
      tr: css({
        borderColor: V.gray20,
        on: $ => [
          $("@media (prefers-color-scheme: dark)", {
            borderColor: V.gray70,
          }),
        ],
      }),
    })
    .use(rehypeAlerts)
    .use(rehypeRewriteElement, {
      pre(node) {
        if (
          typeof node.properties.class === "string" &&
          node.properties.class.includes("shiki")
        ) {
          node.properties.style = `${node.properties.style};${renderToString(
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
          )}`;
        }
      },
      heading(node) {
        // Add step number prefix:

        const text = findTextNode(node);
        if (text) {
          const [, , step, content] = Array.from(
            text.node.value.match(/^(([0-9])\.)?\s*(.*)/m) || [],
          );
          if (step && content) {
            withElement(
              <span
                style={renderToString(
                  css({
                    transform: "translateY(-22.5%)",
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
                )}
              >
                <span style={renderToString({ fontSize: "0.5em" })}>
                  {step}
                </span>
              </span>,
              element => {
                text.parent.children.splice(text.index, 0, element);
                text.node.value = ` ${content}`;
              },
            );
          }
        }

        // Add anchor:

        const anchorId = slug(
          (function text(node: RootContent): string {
            if (isElement(node)) {
              return node.children.map(text).join("");
            }
            if (node.type === "text") {
              return node.value;
            }
            return "";
          })(node),
        );

        withElement(
          <a
            href={`#${anchorId}`}
            style={renderToString({
              float: "left",
              marginLeft: "calc(-0.5em - 8px)",
              paddingRight: 8,
              color: "inherit",
            })}
          >
            <div
              style={renderToString(
                css({
                  visibility: "hidden",
                  width: "0.5em",
                  on: $ => [
                    $(".group:hover &", {
                      visibility: "visible",
                    }),
                  ],
                }),
              )}
            >
              <svg
                width="0.5em"
                height="0.58333em"
                viewBox="0 0 24 28"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-link"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
          </a>,
          element => node.children.splice(0, 0, element),
        );

        withElement(
          <span
            id={anchorId}
            style={renderToString({ position: "relative", top: "-6rem" })}
          />,
          element => node.children.splice(0, 0, element),
        );
      },
    })
    .use(rehypeStringify)
    .process(markdown);

  return html.toString();
}
