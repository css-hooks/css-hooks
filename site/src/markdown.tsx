/** @jsxImportSource hastscript */

import slug from "slug";
import { css, renderToString } from "~/css";
import * as V from "varsace";
import { anchorStyle } from "~/components/anchor";
import rehypeRewrite from "rehype-rewrite";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import rehypeShiki from "@shikijs/rehype";
import { z } from "@builder.io/qwik-city";
import { visit } from "unist-util-visit";
import { visitChildren } from "unist-util-visit-children";
import { isElement } from "hast-util-is-element";

export async function render(markdown: string): Promise<string> {
  const html = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, {
      allowDangerousHtml: true,
    })
    .use(rehypeRaw)
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
    .use(rehypeRewrite, {
      rewrite(node, _index, parent) {
        type Node = typeof node;
        if (node.type === "element") {
          switch (node.tagName) {
            case "a":
              node.properties.style = renderToString(anchorStyle());
              if (typeof node.properties.href === "string") {
                node.properties.href = node.properties.href
                  .replace(
                    /(^|\/)([^/]+)\.md$/,
                    function (_, prefix, basename) {
                      return `${prefix}${basename.replace(/\./g, "_")}`;
                    },
                  )
                  .replace(/\/index$/, "");
              }
              break;
            case "blockquote":
              node.properties.style = renderToString(
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
              );
              const text = (function findText(
                node: Node,
                parent?: Node,
              ): { node: Node; parent: Node | undefined } | undefined {
                if (node.type === "text" && node.value.trim()) {
                  return { node, parent };
                }
                if (node.type === "element") {
                  for (const child of node.children) {
                    const text = findText(child, node);
                    if (text) {
                      return text;
                    }
                  }
                }
              })(node);
              if (
                text &&
                text.node.type === "text" &&
                text.parent &&
                text.parent.type === "element"
              ) {
                const { node: textNode, parent } = text;
                const match = textNode.value.match(
                  /^\s*\[!(NOTE|WARNING)\]\s*(.*)/,
                );
                if (match) {
                  const type = z.enum(["NOTE", "WARNING"]).parse(match[1]);
                  const restText = match[2];
                  parent.children.splice(parent.children.indexOf(textNode), 0, {
                    type: "element",
                    tagName: "p",
                    properties: {
                      style: renderToString({
                        margin: 0,
                      }),
                    },
                    children: [
                      {
                        type: "element",
                        tagName: "strong",
                        properties: {
                          style: renderToString(
                            css({
                              color: type === "WARNING" ? V.orange30 : V.blue30,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25em",
                            }),
                          ),
                        },
                        children: [
                          {
                            type: "element",
                            tagName: "svg",
                            properties: {
                              viewBox:
                                type === "WARNING"
                                  ? "0 0 24 24"
                                  : "0 -960 960 960",
                              width: "1.125em",
                              height: "1.125em",
                              style: renderToString({
                                transform: "translateY(-0.0625em)",
                              }),
                            },
                            children: [
                              {
                                type: "element",
                                tagName: "path",
                                properties: {
                                  d:
                                    type === "WARNING"
                                      ? "M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"
                                      : "M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z",
                                  fill: "currentColor",
                                },
                                children: [],
                              },
                            ],
                          },
                          {
                            type: "text",
                            value: `${type[0]}${type.substring(1).toLowerCase()}`,
                          },
                        ],
                      },
                    ],
                  });
                  textNode.value = restText;
                }
              }
              break;
            case "code":
              node.properties.style = renderToString(
                css({
                  fontFamily: "inherit",
                  color: "inherit",
                  on: ($, { and, not }) => [
                    $(not(".shiki > &"), {
                      fontFamily: "'Inconsolata Variable', monospace",
                      color: V.teal60,
                    }),
                    $(
                      and(
                        "@media (prefers-color-scheme: dark)",
                        not(".shiki > &"),
                      ),
                      {
                        color: V.teal30,
                      },
                    ),
                  ],
                }),
              );
              break;
            case "div":
              if (
                typeof node.properties.class === "string" &&
                node.properties.class.includes("markdown-alert")
              ) {
                node.properties.style = renderToString(
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
                );
              }
              break;
            case "hr":
              node.properties.style = renderToString(
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
              );
              break;
            case "pre":
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
              break;
            case "table":
              node.properties.style = renderToString(
                css({
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
              );
              break;
            case "tr":
              node.properties.class = "group";
              node.properties.style = renderToString(
                css({
                  borderColor: V.gray20,
                  on: $ => [
                    $("@media (prefers-color-scheme: dark)", {
                      borderColor: V.gray70,
                    }),
                  ],
                }),
              );
              break;
            case "th":
            case "td":
              node.properties.style = renderToString(
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
                      and(
                        "@media (prefers-color-scheme: dark)",
                        ".group:even-child &",
                      ),
                      {
                        background: V.gray85,
                      },
                    ),
                  ],
                }),
              );
              break;
            case "p":
              if (
                parent?.type === "element" &&
                (parent.tagName === "th" || parent.tagName === "td")
              ) {
                node.properties.style = renderToString({ margin: 0 });
              }
              break;
          }
        }
      },
    })
    .use(function styleHeading() {
      return tree =>
        visit(tree, node => {
          if (isElement(node)) {
            const headingLevel = Array.from(
              node.tagName.match(/^h([1-6])$/) || [],
            )[1];
            if (headingLevel) {
              node.properties.style = renderToString({
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
                ][parseInt(headingLevel) - 1],
                lineHeight: 1.25,
              });
            }
          }
        });
    })
    .use(function addHeadingAnchors() {
      return visitChildren(parent => {
        if (!isElement(parent) || !/^h[1-6]$/.test(parent.tagName)) {
          return;
        }
        const text = (function text(
          node: typeof parent | (typeof parent.children)[number],
        ): string {
          if (isElement(node)) {
            return node.children.map(text).join("");
          }
          if (node.type === "text") {
            return node.value;
          }
          return "";
        })(parent);
        const anchor = (
          <span
            id={slug(text)}
            style={renderToString({ position: "relative", top: "-6rem" })}
          />
        );
        const link = (
          <a
            href={`#${slug(text)}`}
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
          </a>
        );
        if (isElement(anchor) && isElement(link)) {
          parent.children.splice(0, 0, anchor, link);
          parent.properties.class = "group";
        }
      });
    })
    .use(function addHeadingStepPrefix() {
      return visitChildren(parent => {
        if (isElement(parent) && /^h[1-6]$/.test(parent.tagName)) {
          type Node = (typeof parent.children)[number];
          type Parent = { type: "element"; tagName: string; children: Node[] };
          const text = (function findTextNode(
            node: Node,
            index: number,
            parent: Parent,
          ):
            | {
                node: { type: "text"; value: string };
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
          })(parent, -1, parent);
          if (text) {
            const [, , step, content] = Array.from(
              text.node.value.match(/^(([0-9])\.)?\s*(.*)/m) || [],
            );
            if (step && content) {
              const prefix = (
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
                </span>
              );
              if (isElement(prefix)) {
                text.node.value = ` ${content}`;
                text.parent.children.splice(text.index, 0, prefix);
              }
            }
          }
        }
      });
    })
    .use(rehypeStringify)
    .process(markdown);

  return html.toString();
}
