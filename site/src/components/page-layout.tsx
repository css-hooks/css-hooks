import { css } from "../css.js";
import { Anchor } from "./anchor.js";
import { Logo } from "./logo.js";
import * as Icon from "./icons.js";
import * as V from "varsace";
import { JSXChildren } from "hastx/jsx-runtime";
import { ScreenReaderOnly } from "./screen-reader-only.js";
import { ThemeSwitcher } from "./theme-switcher.js";

export function PageLayout({
  children,
  pathname,
}: {
  children?: JSXChildren;
  pathname: string;
}) {
  return (
    <div
      style={css({
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        on: $ => [
          $("@supports (height: 100dvh)", {
            minHeight: "100dvh",
          }),
        ],
      })}
    >
      <header
        style={css({
          position: "sticky",
          zIndex: 2,
          top: 0,
          right: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          WebkitBackdropFilter: "blur(32px)",
          backdropFilter: "blur(32px)",
          color: V.black,
          padding: "1.5rem",
          borderStyle: "solid",
          borderWidth: 0,
          borderBottomWidth: 2,
          borderColor: V.gray10,
          on: $ => [
            $("@media (prefers-color-scheme: dark)", {
              borderColor: V.gray95,
              color: V.white,
            }),
          ],
        })}
      >
        <a
          href="/"
          style={{
            textDecoration: "none",
          }}
        >
          <Logo />
        </a>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "1em",
          }}
        >
          <Anchor href="/docs" selected={pathname === "/docs/"}>
            <Icon.MenuBook />
            <ScreenReaderOnly>Documentation</ScreenReaderOnly>
          </Anchor>
          <Anchor href="https://github.com/css-hooks/css-hooks">
            <Icon.GitHub />
            <ScreenReaderOnly>Source on GitHub</ScreenReaderOnly>
          </Anchor>
          <ThemeSwitcher />
        </div>
      </header>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
      <footer>
        <div
          style={css({
            padding: "1rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "center",
            textAlign: "center",
            gap: "0.5rem 2rem",
            on: ($, { not }) => [
              $("@media (prefers-color-scheme: dark)", {
                background: V.gray95,
              }),
              $(not("@media (prefers-color-scheme: dark)"), {
                boxShadow: `0 -2px 0 0 ${V.gray10}`,
              }),
            ],
          })}
        >
          <Logo size="1.5rem" />
          <div
            style={{
              flexBasis: "calc((60rem - 100%) * 999)",
              flexGrow: 1,
            }}
          />
          <nav
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "inherit",
            }}
          >
            {[
              ["Documentation", "/docs"],
              ["GitHub", "https://github.com/css-hooks/css-hooks"],
              ["NPM", "https://www.npmjs.com/org/css-hooks"],
              ["X", "https://www.x.com/csshooks"],
              ["Facebook", "https://www.facebook.com/csshooks"],
            ].map(([children, href]) => (
              <Anchor href={href}>{children}</Anchor>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
