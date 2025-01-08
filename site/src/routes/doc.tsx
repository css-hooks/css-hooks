import type { ComponentProps, CSSProperties, ReactNode, Ref } from "react";
import { Children, cloneElement, createElement, isValidElement } from "react";
import { prerenderToNodeStream } from "react-dom/static";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { pipe } from "remeda";
import slug from "slug";
import * as V from "varsace";

import { AnchorLink } from "../components/anchor-link.tsx";
import { EditIcon, ExpandMoreIcon } from "../components/icons.tsx";
import { NavLink } from "../components/nav-link.tsx";
import { Preformatted } from "../components/preformatted.tsx";
import { SyntaxHighlighter } from "../components/syntax-highlighter.tsx";
import { and, dark, hover, not, on, or } from "../css.ts";
import { docs } from "../data/docs.ts";
import { createMetaDescriptors } from "../data/meta.ts";
import { rehypeClassName, rehypeStyle } from "../rehype.ts";
import type { Route } from "./+types/doc.ts";

type MenuItem = {
  pathname: string;
  title: string;
  order: number;
  children: MenuItem[];
};

function menu(pathname: string, itemsSource: typeof docs) {
  const items = (
    JSON.parse(JSON.stringify(itemsSource)) as typeof itemsSource
  ).map((x: (typeof itemsSource)[number]) => ({
    ...x.attributes,
    selected:
      pathname === x.attributes.pathname ||
      (!itemsSource.some(x => pathname === x.attributes.pathname) &&
        pathname.startsWith(x.attributes.pathname)),
    children: [],
  })) as MenuItem[];
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

function MenuList({ children }: { children: ReactNode }) {
  return (
    <ol
      className="group"
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

function MenuItem({ children, pathname, title }: MenuItem) {
  return (
    <li style={{ marginTop: "0.25em" }}>
      <NavLink to={pathname} end>
        {title}
      </NavLink>
      {children.length ? (
        <MenuList>
          {children
            .sort((a, b) =>
              a.order < b.order ? -1 : a.order > b.order ? 1 : 0,
            )
            .map(child => (
              <MenuItem key={child.pathname} {...child} />
            ))}
        </MenuList>
      ) : (
        <></>
      )}
    </li>
  );
}

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6, style: CSSProperties) {
  const Tag = `h${level}` as const;
  const component: Exclude<
    ComponentProps<typeof Markdown>["components"],
    null | undefined
  >[typeof Tag] = ({
    children: childrenProp,
    node: _node,
    style: styleProp,
    ...restProps
  }) => {
    let children: ReactNode = childrenProp;
    if (typeof children === "string") {
      const match = children.match(/^([0-9]+)\.\s+(.*)$/);
      if (match) {
        const [_match, step, content] = match;
        children = (
          <>
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
              <span style={{ fontSize: "0.5em" }}>{step}</span>
            </span>
            {` ${content}`}
          </>
        );
      }
    }
    const textContent = (function getText(node: ReactNode): string {
      if (typeof node === "string" || typeof node === "number") {
        return `${node}`;
      }
      if (node instanceof Array) {
        return node.map(getText).join("");
      }
      if (
        node &&
        typeof node === "object" &&
        "props" in node &&
        node.props &&
        typeof node.props === "object" &&
        "children" in node.props &&
        node.props.children
      ) {
        return getText(node.props.children as Parameters<typeof getText>[0]);
      }
      return "";
    })(children);
    const anchorId = slug(textContent);
    return (
      <Tag
        className="group"
        style={{
          lineHeight: 1.25,
          ...style,
          ...styleProp,
        }}
        {...restProps}
      >
        <span
          id={anchorId}
          style={{
            position: "relative",
            top: "-6rem",
          }}
        />
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
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-link"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
        </a>
        {children}
      </Tag>
    );
  };
  return component;
}

export async function loader({ params }: Route.LoaderArgs) {
  const pathname = `/docs/${params["*"]}`;
  const doc = docs.find(
    doc =>
      doc.attributes.pathname === pathname ||
      doc.attributes.pathname === `${pathname}/`,
  );
  if (!doc) {
    throw new Response("Not Found", {
      status: 404,
      statusText: "Not Found",
      headers: { "Content-Type": "text/plain" },
    });
  }

  const { prelude: stream } = await prerenderToNodeStream(
    <Markdown
      rehypePlugins={[
        rehypeRaw,
        [rehypeClassName, { tr: "group" }],
        [
          rehypeStyle,
          {
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
          },
        ],
      ]}
      remarkPlugins={[remarkGfm]}
      components={{
        a({
          children,
          className = "",
          href = "",
          ref: _ref,
          style = {},
          ...restProps
        }) {
          const to = href
            .replace(/\/index.md$/, "/")
            .replace(/\.md$/, "/")
            .replace(
              /^\.\//,
              doc.attributes.index
                ? doc.attributes.pathname
                : doc.attributes.pathname.replace(/\/[^/]+\/$/, "/"),
            );
          return (
            <AnchorLink
              href={to}
              className={className}
              style={style}
              {...restProps}
            >
              {children}
            </AnchorLink>
          );
        },
        blockquote: ({
          children: childrenProp,
          style,
          node: _node,
          ...restProps
        }) => {
          const children = (function alertify(
            alert,
            node: ReactNode,
          ): ReactNode {
            if (isValidElement(node)) {
              return cloneElement(
                node,
                {},
                ...Children.map(
                  node.props &&
                    typeof node.props === "object" &&
                    "children" in node.props
                    ? node.props.children
                    : [],
                  child => {
                    if (typeof child === "string") {
                      const match = child.match(/^\s*\[!([A-Z]+)\]/);
                      if (
                        match &&
                        (match[1] === "WARNING" || match[1] === "NOTE")
                      ) {
                        return (
                          <>
                            {alert(match[1])}
                            {child.substring(match[0].length)}
                          </>
                        );
                      }
                    }
                    return Children.map(child, x =>
                      alertify(alert, x as ReactNode),
                    );
                  },
                ),
              );
            }
            return node;
          })(
            (type: "WARNING" | "NOTE") => (
              <span style={{ display: "block" }}>
                <strong
                  style={{
                    color: type === "WARNING" ? V.orange30 : V.blue30,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375em",
                  }}
                >
                  <svg
                    viewBox="0 0 16 16"
                    style={{
                      minWidth: "1em",
                      maxWidth: "1em",
                      minHeight: "1em",
                      maxHeight: "1em",
                      transform: "translateY(-0.0625em)",
                    }}
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
              </span>
            ),
            createElement("div", { children: childrenProp }),
          );
          return (
            <blockquote
              style={pipe(
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
                  ...style,
                },
                on(not(dark), {
                  boxShadow: `inset 0 0 0 1px ${V.gray20}`,
                }),
                on(dark, {
                  borderColor: V.pink60,
                  background: V.gray85,
                  color: V.gray30,
                }),
              )}
              {...restProps}
            >
              {children}
            </blockquote>
          );
        },
        code: props => {
          const { children, className, node: _node, ref, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          return match?.[1] ? (
            <div {...rest} ref={ref as Ref<HTMLDivElement> | undefined}>
              <SyntaxHighlighter language={match?.[1]}>
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code
              {...rest}
              className={className}
              style={pipe(
                {
                  color: V.teal60,
                  font: "inherit",
                  fontFamily: "'Inconsolata Variable', monospace",
                },
                on(dark, { color: V.teal30 }),
              )}
            >
              {children}
            </code>
          );
        },
        h1: createHeading(1, {
          fontSize: "3rem",
          fontWeight: 400,
          marginBlock: "1.25rem",
        }),
        h2: createHeading(2, {
          fontSize: "2.2rem",
          fontWeight: 400,
          marginBlock: "1.75rem",
        }),
        h3: createHeading(3, {
          fontSize: "1.8rem",
          fontWeight: 400,
          marginBlock: "2rem",
        }),
        h4: createHeading(4, {
          fontSize: "1.4rem",
          fontWeight: 400,
          marginBlock: "2.25rem",
        }),
        h5: createHeading(5, {
          fontSize: "1rem",
          fontWeight: 700,
          marginBlock: "2.5rem",
        }),
        h6: createHeading(6, {
          fontSize: "0.75rem",
          fontWeight: 700,
          marginBlock: "2.625rem",
        }),
        hr: ({ style, ...restProps }) => (
          <hr
            style={pipe(
              {
                margin: "2rem 0",
                border: 0,
                width: "100%",
                height: 1,
                background: V.gray10,
                ...style,
              },
              on("@media (prefers-color-scheme: dark)", {
                background: V.gray80,
              }),
            )}
            {...restProps}
          />
        ),
        p: ({ node: _node, style, ...restProps }) => (
          <p
            style={pipe(
              {
                margin: "1em 0",
                ...style,
              },
              on(or("th > &:only-child", "td > &:only-child"), {
                margin: 0,
              }),
            )}
            {...restProps}
          />
        ),
        pre: ({ children, node: _node, style, ...restProps }) => (
          <pre
            style={pipe(
              {
                padding: "1rem 1.5rem",
                background: V.white,
                marginBlock: "1.5rem",
                overflow: "auto",
                ...style,
              },
              on(not(dark), {
                boxShadow: `inset 0 0 0 1px ${V.gray20}`,
              }),
              on(dark, {
                background: V.gray85,
              }),
            )}
            {...restProps}
          >
            <Preformatted as="div">{children}</Preformatted>
          </pre>
        ),
      }}
    >
      {doc.body}
    </Markdown>,
  );

  const body = await new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", chunk => chunks.push(Buffer.from(chunk)));
    stream.on("error", err => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });

  return {
    ...doc,
    body,
  };
}

export const meta: Route.MetaFunction = createMetaDescriptors(({ data }) => ({
  title: data.attributes.title,
  description: data.attributes.description,
}));

export default function Doc({ loaderData: doc }: Route.ComponentProps) {
  return (
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
              and(or(hover, "&:active"), "@media (prefers-color-scheme: dark)"),
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
            <ExpandMoreIcon />
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
              doc.attributes.pathname,
              docs.filter(({ attributes: { order } }) => order >= 0),
            )
              .sort((a, b) =>
                a.order < b.order ? -1 : a.order > b.order ? 1 : 0,
              )
              .map(props => (
                <MenuItem key={props.pathname} {...props} />
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
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: doc.body }}
            />
            {doc.attributes.editURL ? (
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
                <NavLink to={doc.attributes.editURL}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25em",
                    }}
                  >
                    <span style={{ display: "inline-flex" }} aria-hidden="true">
                      <EditIcon />
                    </span>
                    <span>Suggest an edit</span>
                  </div>
                </NavLink>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div style={{ height: "2rem" }} />
      </main>
    </div>
  );
}
