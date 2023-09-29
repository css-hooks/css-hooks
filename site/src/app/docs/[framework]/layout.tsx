"use client";

import { Fragment, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import PageBlock from "@/components/PageBlock";
import RadioLink from "@/components/RadioLink";
import Typography from "@/components/Typography";
import hooks from "@/css-hooks";
import { exhausted } from "@/util/exhausted";
import frameworks from "./frameworks";
import guides from "./guides";
import GitHubIcon from "@/components/GitHubIcon";
import CodeSandboxIcon from "@/components/CodeSandboxIcon";

export default function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: { framework: (typeof frameworks)[number] };
}) {
  const pathname = usePathname();
  return (
    <>
      <header
        style={hooks({
          padding: "2rem",
          background: "var(--gray-100)",
          dark: { background: "var(--gray-950)" },
        })}
      >
        <PageBlock
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
          }}
        >
          <Link href="/" style={{ textDecoration: "none", flex: 1 }}>
            <Logo size="2rem" />
          </Link>
          <a
            href={`https://codesandbox.io/p/sandbox/github/css-hooks/css-hooks/tree/master/examples/${params.framework}?file=/src/App.tsx:1,1`}
            style={hooks({
              color: "var(--gray-500)",
              hover: { color: "var(--blue-700)" },
              active: { color: "var(--red-600)" },
              dark: {
                hover: { color: "var(--blue-300)" },
                active: { color: "var(--red-400)" },
              },
            })}
          >
            <CodeSandboxIcon aria-label="Try in CodeSandbox" height="1.5rem" />
          </a>
          <a
            href="https://github.com/css-hooks/css-hooks"
            style={hooks({
              color: "var(--gray-500)",
              hover: { color: "var(--blue-700)" },
              active: { color: "var(--red-600)" },
              dark: {
                hover: { color: "var(--blue-300)" },
                active: { color: "var(--red-400)" },
              },
            })}
          >
            <GitHubIcon aria-label="Source code on GitHub" height="1.5rem" />
          </a>
        </PageBlock>
      </header>
      <PageBlock
        style={{
          marginTop: "2rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
        }}
      >
        <nav style={{ flex: 1, minWidth: "20ch" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              marginBlock: "1.5rem",
            }}
          >
            <Typography variant="boldLarge">
              {({ className, style, ...restProps }) =>
                exhausted(restProps) && (
                  <h1
                    className={className}
                    style={hooks({
                      ...style,
                      color: "var(--gray-400)",
                      dark: { color: "var(--gray-600)" },
                    })}
                  >
                    Framework
                  </h1>
                )
              }
            </Typography>
            {[
              frameworks.map(framework => (
                <Fragment key={framework}>
                  <RadioLink checked={params.framework === framework}>
                    {({ renderChildren, style }) => (
                      <Link
                        href={pathname.replace(
                          `/${params.framework}/`,
                          `/${framework}/`,
                        )}
                        style={style}
                      >
                        {renderChildren(
                          framework[0].toUpperCase() + framework.substring(1),
                        )}
                      </Link>
                    )}
                  </RadioLink>
                </Fragment>
              )),
            ]}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              marginBlock: "1.5rem",
            }}
          >
            <Typography variant="boldLarge">
              {({ className, style, ...restProps }) =>
                exhausted(restProps) && (
                  <h1
                    className={className}
                    style={hooks({
                      ...style,
                      color: "var(--gray-400)",
                      dark: { color: "var(--gray-600)" },
                    })}
                  >
                    Guides
                  </h1>
                )
              }
            </Typography>
            {guides
              .map(([name, slug]) => [
                name,
                `/docs/${params.framework}/${slug}`,
              ])
              .map(([name, href]) => (
                <Fragment key={href}>
                  <RadioLink checked={href === pathname}>
                    {({ renderChildren, style }) => (
                      <Link href={href} style={style}>
                        {renderChildren(name)}
                      </Link>
                    )}
                  </RadioLink>
                </Fragment>
              ))}
          </div>
          <Typography variant="regularBase">
            {({ className, style, ...restProps }) =>
              exhausted(restProps) && (
                <ul
                  className={className}
                  style={{
                    ...style,
                    display: "flex",
                    flexDirection: "column",
                    gap: "1em",
                    listStyle: "none",
                    padding: 0,
                  }}
                ></ul>
              )
            }
          </Typography>
        </nav>
        <div style={{ flex: 3, minWidth: "40ch" }}>{children}</div>
      </PageBlock>
    </>
  );
}
