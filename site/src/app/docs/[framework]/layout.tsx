"use client";

import { Fragment, ReactNode } from "react";
import NextLink from "next/link";
import Link from "@/components/Link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import PageBlock from "@/components/PageBlock";
import RadioLink from "@/components/RadioLink";
import Typography from "@/components/Typography";
import { css } from "@/css";
import { exhausted } from "@/util/exhausted";
import frameworks from "./frameworks";
import guides from "./guides";
import GitHubIcon from "@/components/GitHubIcon";
import CodeSandboxIcon from "@/components/CodeSandboxIcon";
import * as V from "varsace";

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
        style={css({
          padding: "2rem",
          background: V.gray10,
          "@media (prefers-color-scheme: dark)": { background: V.gray85 },
        })}
      >
        <PageBlock
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
          }}
        >
          <NextLink href="/" style={{ textDecoration: "none", flex: 1 }}>
            <Logo size="2rem" />
          </NextLink>
          <Link
            href={`https://codesandbox.io/p/sandbox/github/css-hooks/css-hooks/tree/master/examples/${params.framework}?file=/src/App.tsx:1,1`}
          >
            <CodeSandboxIcon aria-label="Try in CodeSandbox" height="1.5rem" />
          </Link>
          <Link href="https://github.com/css-hooks/css-hooks">
            <GitHubIcon aria-label="Source code on GitHub" height="1.5rem" />
          </Link>
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
                    style={{
                      ...style,
                      color: V.gray50,
                    }}
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
                      <NextLink
                        href={pathname.replace(
                          `/${params.framework}/`,
                          `/${framework}/`,
                        )}
                        style={style}
                      >
                        {renderChildren(
                          framework[0].toUpperCase() + framework.substring(1),
                        )}
                      </NextLink>
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
                    style={{
                      ...style,
                      color: V.gray50,
                    }}
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
                      <NextLink href={href} style={style}>
                        {renderChildren(name)}
                      </NextLink>
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
