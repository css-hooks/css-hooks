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
            <svg
              height="1.5rem"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 256 296"
              aria-label="Run in CodeSandbox"
            >
              <path
                d="M115.498 261.088v-106.61L23.814 101.73v60.773l41.996 24.347v45.7l49.688 28.54zm23.814.627l50.605-29.151V185.78l42.269-24.495v-60.011l-92.874 53.621v106.82zm80.66-180.887l-48.817-28.289l-42.863 24.872l-43.188-24.897l-49.252 28.667l91.914 52.882l92.206-53.235zM0 222.212V74.495L127.987 0L256 74.182v147.797l-128.016 73.744L0 222.212z"
                fill="currentColor"
              />
            </svg>
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
            <svg
              height="1.5rem"
              viewBox="0 0 98 96"
              aria-label="Source code on GitHub"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                fill="currentColor"
              />
            </svg>
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
