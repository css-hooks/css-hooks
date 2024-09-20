import type { RootContent } from "hast";
import { fromHtml } from "hast-util-from-html";
import { isElement } from "hast-util-is-element";
import type { JSXChildren } from "hastx/jsx-runtime";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { pipe } from "remeda";
import slug from "slug";
import { unified } from "unified";
import * as V from "varsace";

import { Anchor, anchorStyle } from "../../components/anchor.js";
import { Body } from "../../components/body.js";
import { Head } from "../../components/head.js";
import { Html } from "../../components/html.js";
import * as Icon from "../../components/icons.js";
import { PageLayout } from "../../components/page-layout.js";
import { PageMeta } from "../../components/page-meta.js";
import { and, dark, hover, not, on, or } from "../../css.js";
import {
  findTextNode,
  rehypeAlerts,
  rehypeClassName,
  rehypeRewriteElement,
  rehypeStyle,
  rehypeTransformHref,
  withElement,
} from "../../rehype.js";
import type { Route } from "../../route.js";
import { getArticles } from "./data.js";

export default async (): Promise<Route[]> => {
  const articles = await getArticles();
  return articles.map(
    ({ content, description, editURL, filePath, pathname, title }) => ({
      pathname,
      render: async () => ({
        content: await Article({
          articles,
          editURL,
          filePath,
          pathname,
          title,
          description,
          content,
        }),
      }),
    }),
  );
};

type MenuItem = {
  pathname: string;
  selected: boolean;
  title: string;
  order: string;
  children: MenuItem[];
};

function menu(
  pathname: string,
  itemsSource: Awaited<ReturnType<typeof getArticles>>,
) {
  const items = JSON.parse(JSON.stringify(itemsSource)).map(
    (x: (typeof itemsSource)[number]) => ({
      ...x,
      selected:
        pathname === x.pathname ||
        (!itemsSource.some(x => pathname === x.pathname) &&
          pathname.startsWith(x.pathname)),
      children: [],
    }),
  ) as MenuItem[];
  const menu: MenuItem[] = [];
  for (const item of items) {
    const parent = items.find(
      ({ pathname }) =>
        pathname !== item.pathname && item.pathname.startsWith(pathname),
    );
    if (parent) {
      parent.children.push(item);
    } else {
      menu.push(item);
    }
  }
  return menu;
}

function MenuList({ children }: { children: JSXChildren }) {
  return (
    <ol
      class="group"
      style={pipe(
        {
          listStyleType: "none",
          margin: 0,
          padding: 0,
          paddingLeft: 0,
        },
        on(".group &.group", {
          paddingLeft: "2em",
        }),
      )}
    >
      {children}
    </ol>
  );
}

function MenuItem({ children, pathname, selected, title }: MenuItem) {
  return (
    <li style={{ marginTop: "0.25em" }}>
      <Anchor href={pathname} selected={selected}>
        {title}
      </Anchor>
      {children.length ? (
        <MenuList>
          {children
            .sort((a, b) =>
              a.order < b.order ? -1 : a.order > b.order ? 1 : 0,
            )
            .map(child => (
              <MenuItem {...child} />
            ))}
        </MenuList>
      ) : (
        <></>
      )}
    </li>
  );
}

async function Article({
  articles,
  editURL,
  filePath,
  pathname,
  title,
  description,
  content,
}: {
  articles: Awaited<ReturnType<typeof getArticles>>;
  editURL?: string;
  filePath: string;
  pathname: string;
  title: string;
  description: string;
  content: string;
}) {
  return (
    <Html>
      <Head>
        <PageMeta pathname={pathname} title={title} description={description} />
      </Head>
      <Body>
        <PageLayout pathname={pathname}>
          <div
            style={pipe(
              {
                flex: 1,
                display: "flex",
                flexDirection: "column",
              },
              on("@media (width >= 44em)", {
                flexDirection: "row",
              }),
            )}
          >
            <nav
              style={pipe(
                {
                  background: V.gray05,
                  boxSizing: "border-box",
                },
                on(dark, {
                  background: V.gray85,
                }),
                on("@media (width >= 44em)", {
                  flexBasis: "24ch",
                  flexShrink: 0,
                }),
              )}
            >
              <label
                style={pipe(
                  {
                    display: "flex",
                    alignItems: "center",
                    padding: "1rem 1.25rem",
                    gap: "0.25rem",
                    fontSize: "1.25rem",
                    color: V.gray60,
                    outlineWidth: 0,
                    outlineColor: V.blue20,
                    outlineStyle: "solid",
                    outlineOffset: -2,
                  },
                  on(dark, {
                    outlineColor: V.blue50,
                    color: V.gray40,
                  }),
                  on("&:has(:focus-visible)", {
                    outlineWidth: 2,
                  }),
                  on(or(hover, "&:active"), {
                    background: V.white,
                  }),
                  on(hover, {
                    color: V.blue50,
                  }),
                  on("&:active", {
                    color: V.red50,
                  }),
                  on(
                    and(
                      or(hover, "&:active"),
                      "@media (prefers-color-scheme: dark)",
                    ),
                    {
                      background: V.gray80,
                    },
                  ),
                  on(and(hover, dark), {
                    color: V.blue20,
                  }),
                  on(and("&:active", dark), {
                    color: V.red20,
                  }),
                  on("@media (width >= 44em)", {
                    display: "none",
                  }),
                )}
              >
                <input
                  type="checkbox"
                  style={{
                    appearance: "none",
                    width: 0,
                    height: 0,
                    margin: 0,
                  }}
                />
                <div
                  style={pipe(
                    {
                      display: "inline-flex",
                    },
                    on(not(":checked + &"), {
                      transform: "rotate(-90deg)",
                      transformOrigin: "center",
                    }),
                  )}
                >
                  <Icon.ExpandMore />
                </div>
                <span>Contents</span>
              </label>
              <div
                style={pipe(
                  {
                    marginTop: "0.5em",
                    paddingTop: 0,
                    paddingRight: "1.75rem",
                    paddingBottom: "1.75rem",
                    paddingLeft: "1.75rem",
                  },
                  on(not(or(":has(:checked) + &", "@media (width >= 44em)")), {
                    display: "none",
                  }),
                  on("@media (width >= 44em)", {
                    position: "fixed",
                    marginTop: "-0.5em",
                    paddingTop: "2rem",
                    paddingRight: "2rem",
                    paddingBottom: "2rem",
                    paddingLeft: "2rem",
                  }),
                )}
              >
                <MenuList>
                  {menu(
                    pathname,
                    articles.filter(({ order }) => order >= 0),
                  )
                    .sort((a, b) =>
                      a.order < b.order ? -1 : a.order > b.order ? 1 : 0,
                    )
                    .map(props => (
                      <MenuItem {...props} />
                    ))}
                </MenuList>
              </div>
            </nav>
            <main
              style={{
                flexGrow: 1,
                flexShrink: 1,
                minWidth: 0,
                lineHeight: 1.5,
              }}
            >
              <div
                style={pipe(
                  {
                    width: "calc(100% - 4rem)",
                    maxWidth: "88ch",
                    margin: "auto",
                    padding: "1rem 0",
                  },
                  on("@media (width >= 69em)", {
                    width: "calc(100% - 8rem)",
                  }),
                )}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem",
                  }}
                >
                  <div class="prose">
                    {fromHtml(
                      (
                        await unified()
                          .use(remarkParse)
                          .use(remarkGfm)
                          .use(remarkRehype, {
                            allowDangerousHtml: true,
                          })
                          .use(rehypeRaw)
                          .use(rehypeTransformHref, url =>
                            url
                              .replace(
                                /(^|\/)([^/]+)\.md$/,
                                function (_, prefix, basename) {
                                  return `${prefix}${filePath.endsWith("index.md") ? "" : "../"}${basename}`;
                                },
                              )
                              .replace(/\/index$/, ""),
                          )
                          .use(rehypeClassName, {
                            heading: () => "group",
                            tr: "group",
                          })
                          .use(rehypeStyle, {
                            a: anchorStyle,
                            blockquote: pipe(
                              {
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
                              },
                              on(not(dark), {
                                boxShadow: `inset 0 0 0 1px ${V.gray20}`,
                              }),
                              on(dark, {
                                borderColor: V.pink60,
                                background: V.gray85,
                                color: V.gray30,
                              }),
                            ),
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
                            hr: pipe(
                              {
                                margin: "2rem 0",
                                border: 0,
                                width: "100%",
                                height: 1,
                                background: V.gray10,
                              },
                              on("@media (prefers-color-scheme: dark)", {
                                background: V.gray80,
                              }),
                            ),
                            p: pipe(
                              {
                                margin: "1em 0",
                              },
                              on("&:only-child", {
                                margin: 0,
                              }),
                            ),
                            table: pipe(
                              {
                                borderStyle: "solid",
                                borderWidth: 1,
                                borderSpacing: 0,
                                borderCollapse: "collapse",
                                borderColor: V.gray20,
                              },
                              on("@media (prefers-color-scheme: dark)", {
                                borderColor: V.gray70,
                              }),
                            ),
                            tablecell: () =>
                              pipe(
                                {
                                  borderWidth: 1,
                                  borderColor: "inherit",
                                  borderStyle: "solid",
                                  padding: "calc(0.375em - 0.5px) 0.75em",
                                },
                                on(not(or(dark, ".group:nth-child(even) &")), {
                                  background: V.white,
                                }),
                                on(and(not(dark), ".group:nth-child(even) &"), {
                                  background: `color-mix(in srgb, ${V.white}, ${V.gray05})`,
                                }),
                                on(and(dark, not(".group:nth-child(even) &")), {
                                  background: `color-mix(in srgb, ${V.gray85}, ${V.gray90})`,
                                }),
                                on(and(dark, ".group:nth-child(even) &"), {
                                  background: V.gray85,
                                }),
                              ),
                            tr: pipe(
                              {
                                borderColor: V.gray20,
                              },
                              on(dark, {
                                borderColor: V.gray70,
                              }),
                            ),
                          })
                          .use(rehypeAlerts)
                          .use(rehypeRewriteElement, {
                            heading(node) {
                              // Add step number prefix:

                              const text = findTextNode(node);
                              if (text) {
                                const [, , step, content] = Array.from(
                                  text.node.value.match(
                                    /^(([0-9])\.)?\s*(.*)/m,
                                  ) || [],
                                );
                                if (step && content) {
                                  withElement(
                                    <span
                                      style={pipe(
                                        {
                                          transform: "translateY(-22.5%)",
                                          width: "0.75em",
                                          height: "0.75em",
                                          display: "inline-grid",
                                          placeItems: "center",
                                          borderRadius: 999,
                                          background: V.pink10,
                                          color: V.pink50,
                                        },
                                        on(dark, {
                                          background: V.pink50,
                                          color: V.pink10,
                                        }),
                                      )}
                                    >
                                      <span style={{ fontSize: "0.5em" }}>
                                        {step}
                                      </span>
                                    </span>,
                                    element => {
                                      text.parent.children.splice(
                                        text.index,
                                        0,
                                        element,
                                      );
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
                                  style={{
                                    float: "left",
                                    marginLeft: "calc(-0.5em - 8px)",
                                    paddingRight: 8,
                                    color: "inherit",
                                  }}
                                >
                                  <div
                                    style={pipe(
                                      {
                                        visibility: "hidden",
                                        width: "0.5em",
                                      },
                                      on(".group:hover &", {
                                        visibility: "visible",
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
                                  style={{
                                    position: "relative",
                                    top: "-6rem",
                                  }}
                                />,
                                element => node.children.splice(0, 0, element),
                              );
                            },
                          })
                          .use(rehypeStringify)
                          .process(content)
                      ).toString(),
                    )}
                  </div>
                  {editURL ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      <hr
                        style={pipe(
                          {
                            margin: 0,
                            border: 0,
                            width: "100%",
                            height: 1,
                            background: V.gray10,
                          },
                          on(dark, {
                            background: V.gray80,
                          }),
                        )}
                      />
                      <Anchor href={editURL}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25em",
                          }}
                        >
                          <span
                            style={{ display: "inline-flex" }}
                            aria-hidden="true"
                          >
                            <Icon.Edit />
                          </span>
                          <span>Suggest an edit</span>
                        </div>
                      </Anchor>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div style={{ height: "2rem" }} />
            </main>
          </div>
        </PageLayout>
      </Body>
    </Html>
  );
}
