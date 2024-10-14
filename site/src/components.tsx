import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import { forwardRef, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
  NavLink as ReactRouterNavLink,
  Outlet,
  useLocation,
} from "react-router-dom";
import { pipe } from "remeda";
import * as V from "varsace";
import type { z } from "zod";

import type { syntaxHighlighterLanguageParser } from "./common.js";
import { and, dark, hover, not, on, styleSheet } from "./css.js";

function ArrowDropDownIcon() {
  return (
    <IconSvg>
      <path d="M7 10l5 5 5-5H7z" fill="currentColor" />
    </IconSvg>
  );
}

export function Block({ children }: { children?: ReactNode }) {
  return (
    <div
      style={{
        width: "calc(100vw - 4rem)",
        maxWidth: "80rem",
        margin: "0 auto",
      }}
    >
      {children}
    </div>
  );
}

export function CodeSandboxIcon() {
  return (
    <IconSvg viewBox="0 0 256 296">
      <path
        d="M115.498 261.088v-106.61L23.814 101.73v60.773l41.996 24.347v45.7l49.688 28.54zm23.814.627l50.605-29.151V185.78l42.269-24.495v-60.011l-92.874 53.621v106.82zm80.66-180.887l-48.817-28.289l-42.863 24.872l-43.188-24.897l-49.252 28.667l91.914 52.882l92.206-53.235zM0 222.212V74.495L127.987 0L256 74.182v147.797l-128.016 73.744L0 222.212z"
        fill="currentColor"
      />
    </IconSvg>
  );
}

function DarkModeIcon() {
  return (
    <IconSvg>
      <path
        d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"
        fill="currentColor"
      />
    </IconSvg>
  );
}

export function EditIcon() {
  return (
    <IconSvg viewBox="0 -960 960 960">
      <path
        d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
        fill="currentColor"
      />
    </IconSvg>
  );
}

export function Emblem() {
  return (
    <svg
      viewBox="0 0 334 400"
      style={{
        minWidth: "0.835em",
        width: "0.835em",
        minHeight: "1em",
        height: "1em",
      }}
    >
      <path
        style={pipe(
          {
            fill: V.blue40,
          },
          on(dark, {
            fill: V.blue30,
          }),
        )}
        d={`M53.97 301.25c-10.82-29.94 17.02-61.84 30.92-85.7 2.11-3.63 5.34-4.47 7.42-7.61 1.89-2.85 3.85-5.78 6.2-8.35 39.77-43.45 92.75-94.89 91.75-161.36-.16-10.85-2.6-21.67-5.68-32.18a.66.66 0 0 1 1.18-.55c12.98 19.36 21.86 38.8 19.91 62q-2.75 32.73-20.62 61.43c-12.8 20.56-28.8 40.08-45.65 57.46q-18.38 18.98-34.91 39.56-9.79 12.19-12.28 15.76c-9.12 13.11-17.88 32.62-16.54 48.48 2.39 28.3 29.27 37.48 53.6 37.38 22.93-.09 44.59-11.89 59.52-29.04q7.47-8.58 14.29-17.68c10.2-13.62 19.82-27.62 33.21-38.37 6.41-5.14 15.39-10.23 23.03-15.44q.73-.5.32.28c-.81 1.53-2.33 3.01-3 4.39-14.02 28.86-30.43 54.44-52.37 78.56-25.61 28.14-60.26 42.83-98.49 34.32-23.76-5.3-43.4-20.1-51.81-43.34Z`}
      />
      <path
        style={pipe(
          {
            fill: V.gray50,
          },
          on(dark, {
            fill: V.gray30,
          }),
        )}
        d={`M16.19 224.94c6.46-12.92 12.73-24.06 21.38-35.58q12.57-16.75 26.89-32c26.85-28.61 45-54 65.37-86.3 5.88-9.33 10.46-18.93 15.04-28.8a.48.48 0 0 1 .92.25q-2.69 26.77-12.42 51.84c-10.8 27.84-29.9 51.97-49.7 73.32-9.45 10.19-17.96 19.16-25.33 28.77-1.93 2.51-4.46 4.55-6.1 7.03q-4.32 6.49-7.66 13.53c-7 14.77-14 30.95-16.9 47.08-2.7 15-1.61 31.31 1.95 46.15 4.69 19.54 21.41 38.03 37.67 49.2q4.63 3.18 18.61 10.55 4.02 2.12 8.13 3.05c23.18 5.24 46.03 7.14 69.25.09 28.81-8.75 52.07-28.09 71.87-51.53q24.09-28.53 43.97-60.2c9.61-15.31 18.47-31.67 31.3-44.98 5.32-5.52 13.22-11.26 19.48-17.37a.41.41 0 0 1 .64.51c-10.26 16.88-16.09 36.07-25.58 53.46-21.46 39.3-46.77 75.08-80.21 104.66-17.45 15.44-38.35 27.07-60.21 34.65q-12.25 4.25-25.63 5.37c-7.35.61-15.79-.14-23.67-.49-20.09-.89-35.98-7.54-52.99-17.88-14.03-8.53-28.62-18.76-38.27-32.38q-16.01-22.61-20.71-50c-4.24-24.71 1.79-49.77 12.91-72Z`}
      />
    </svg>
  );
}

export function ExpandMoreIcon() {
  return (
    <IconSvg viewBox="0 -960 960 960">
      <path
        d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"
        fill="currentColor"
      />
    </IconSvg>
  );
}

export function GitHubIcon() {
  return (
    <IconSvg viewBox="0 0 24 24">
      <path
        d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
        fill="currentColor"
      />
    </IconSvg>
  );
}

function LightModeIcon() {
  return (
    <IconSvg>
      <path
        d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41 s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z"
        fill="currentColor"
      />
    </IconSvg>
  );
}

export function MenuBookIcon() {
  return (
    <IconSvg>
      <path
        d="M21,5c-1.11-0.35-2.33-0.5-3.5-0.5c-1.95,0-4.05,0.4-5.5,1.5c-1.45-1.1-3.55-1.5-5.5-1.5S2.45,4.9,1,6v14.65 c0,0.25,0.25,0.5,0.5,0.5c0.1,0,0.15-0.05,0.25-0.05C3.1,20.45,5.05,20,6.5,20c1.95,0,4.05,0.4,5.5,1.5c1.35-0.85,3.8-1.5,5.5-1.5 c1.65,0,3.35,0.3,4.75,1.05c0.1,0.05,0.15,0.05,0.25,0.05c0.25,0,0.5-0.25,0.5-0.5V6C22.4,5.55,21.75,5.25,21,5z M21,18.5 c-1.1-0.35-2.3-0.5-3.5-0.5c-1.7,0-4.15,0.65-5.5,1.5V8c1.35-0.85,3.8-1.5,5.5-1.5c1.2,0,2.4,0.15,3.5,0.5V18.5z"
        fill="currentColor"
      />
      <path
        d="M17.5,10.5c0.88,0,1.73,0.09,2.5,0.26V9.24C19.21,9.09,18.36,9,17.5,9c-1.7,0-3.24,0.29-4.5,0.83v1.66 C14.13,10.85,15.7,10.5,17.5,10.5z"
        fill="currentColor"
      />
      <path
        d="M13,12.49v1.66c1.13-0.64,2.7-0.99,4.5-0.99c0.88,0,1.73,0.09,2.5,0.26V11.9c-0.79-0.15-1.64-0.24-2.5-0.24 C15.8,11.66,14.26,11.96,13,12.49z"
        fill="currentColor"
      />
      <path
        d="M17.5,14.33c-1.7,0-3.24,0.29-4.5,0.83v1.66c1.13-0.64,2.7-0.99,4.5-0.99c0.88,0,1.73,0.09,2.5,0.26v-1.52 C19.21,14.41,18.36,14.33,17.5,14.33z"
        fill="currentColor"
      />
    </IconSvg>
  );
}

function IconSvg({ style, ...restProps }: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      style={{
        minWidth: "1.125em",
        maxWidth: "1.125em",
        minHeight: "1.125em",
        maxHeight: "1.125em",
        margin: "-0.0625em",
        ...style,
      }}
      {...restProps}
    />
  );
}

export function Logo({ size = "2rem" }: { size?: CSSProperties["fontSize"] }) {
  return (
    <div
      style={{
        fontFamily: "'Assistant', sans-serif",
        fontSize: size,
        letterSpacing: "-0.05em",
        display: "flex",
        alignItems: "center",
        gap: "0.125em",
        lineHeight: 1,
      }}
    >
      <Emblem />
      <div
        style={pipe(
          {
            color: V.gray90,
          },
          on(dark, {
            color: V.white,
          }),
        )}
      >
        CSS Hooks
      </div>
    </div>
  );
}

export const NavLink = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<typeof ReactRouterNavLink>
>(function NavLink({ className, style, ...restProps }, ref) {
  return (
    <ReactRouterNavLink
      ref={ref}
      style={pipe(
        {
          outlineWidth: 0,
          outlineOffset: 2,
          outlineStyle: "solid",
          outlineColor: V.blue20,
          color: V.blue50,
          ...style,
        },
        on("&:has(*)", {
          display: "inline-flex",
        }),
        on(not(hover), {
          textDecoration: "none",
        }),
        on(hover, {
          color: V.blue40,
        }),
        on("&:active", {
          color: V.red40,
        }),
        on(dark, {
          outlineColor: V.blue50,
          color: V.blue30,
        }),
        on(and(dark, hover), {
          color: V.blue20,
        }),
        on(and(dark, "&:active"), {
          color: V.red20,
        }),
        on("&:focus-visible", {
          outlineWidth: 2,
        }),
        on("&.selected", {
          color: "inherit",
        }),
      )}
      className={classNameProps =>
        `${classNameProps.isActive ? "selected" : ""}${className ? ` ${typeof className === "string" ? className : className(classNameProps)}` : ""}`
      }
      {...restProps}
    />
  );
});

const themes = ["light", "auto", "dark"] as const;
const defaultTheme = "auto" satisfies (typeof themes)[number];

export function Page() {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Assistant:wght@200..800&family=Inconsolata:wght@200..900&family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/modern-normalize/2.0.0/modern-normalize.min.css"
          rel="stylesheet"
        />
        <style>{styleSheet()}</style>
      </Helmet>
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          lineHeight: 1.25,
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Outlet />
      </div>
    </>
  );
}

export function PageLayout() {
  useEffect(() => {
    const script = document.createElement("script");
    script.textContent = `
      (function() {
        var theme = localStorage.getItem("theme");
        if (!~${JSON.stringify(themes)}.indexOf(theme)) {
          theme = ${JSON.stringify(defaultTheme)};
        }
        document.documentElement.setAttribute("data-theme", theme);
      })()
    `;
    document.head.insertBefore(script, document.head.firstChild);
    return () => {
      document.head.removeChild(script);
    };
  });

  const [themeSwitcherLabel, setThemeSwitcherLabel] =
    useState<HTMLLabelElement | null>(null);

  useEffect(() => {
    if (themeSwitcherLabel) {
      const script = document.createElement("script");
      script.textContent = `
        (function () {
          var switcher = document.currentScript.previousSibling;
          if (switcher instanceof HTMLSelectElement) {
            switcher.value = document.documentElement.getAttribute("data-theme") || "auto";
            switcher.addEventListener("change", function(e) {
              var theme = e.target.value;
              document.documentElement.setAttribute("data-theme", theme);
              localStorage.setItem("theme", theme);
            });
          }
        })()
      `;
      themeSwitcherLabel.appendChild(script);
      return () => {
        themeSwitcherLabel.removeChild(script);
      };
    }
    return undefined;
  }, [themeSwitcherLabel]);

  return (
    <>
      <Helmet>
        <style>{`html{overflow-y:scroll}`}</style>
      </Helmet>
      <div
        style={pipe(
          {
            background: V.white,
            color: V.gray90,
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          },
          on("@supports (height: 100dvh)", {
            minHeight: "100dvh",
          }),
          on(dark, {
            background: V.gray90,
            color: V.white,
          }),
        )}
      >
        <header
          style={pipe(
            {
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
            },
            on(dark, {
              borderColor: V.gray95,
              color: V.white,
            }),
          )}
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
            <NavLink to="/docs">
              <MenuBookIcon />
              <ScreenReaderOnly>Documentation</ScreenReaderOnly>
            </NavLink>
            <NavLink to="https://github.com/css-hooks/css-hooks">
              <GitHubIcon />
              <ScreenReaderOnly>Source on GitHub</ScreenReaderOnly>
            </NavLink>
            <div
              style={pipe(
                {
                  position: "relative",
                  display: "inline-flex",
                  outlineWidth: 0,
                  outlineStyle: "solid",
                  outlineColor: V.blue20,
                  outlineOffset: 2,
                  color: V.blue50,
                },
                on("&:has(:focus-visible)", {
                  outlineWidth: 2,
                }),
                on(hover, {
                  color: V.blue40,
                }),
                on("&:active", {
                  color: V.red40,
                }),
                on(dark, {
                  outlineColor: V.blue50,
                  color: V.blue30,
                }),
                on(and(dark, hover), {
                  color: V.blue20,
                }),
                on(and(dark, "&:active"), {
                  color: V.red20,
                }),
              )}
            >
              <div style={{ display: "inline-flex" }}>
                <div
                  style={pipe(
                    {
                      display: "none",
                    },
                    on(dark, {
                      display: "contents",
                    }),
                  )}
                >
                  <DarkModeIcon />
                </div>
                <div
                  style={pipe(
                    {
                      display: "none",
                    },
                    on(not(dark), {
                      display: "contents",
                    }),
                  )}
                >
                  <LightModeIcon />
                </div>
                <ArrowDropDownIcon />
              </div>
              <label ref={setThemeSwitcherLabel}>
                <ScreenReaderOnly>Theme</ScreenReaderOnly>
                <select
                  defaultValue={defaultTheme}
                  style={{
                    fontSize: 0,
                    position: "absolute",
                    inset: 0,
                    opacity: 0,
                  }}
                >
                  {themes.map(theme => (
                    <option
                      key={theme}
                      style={{
                        fontSize: "1rem",
                        background: V.white,
                        color: V.black,
                      }}
                    >
                      {theme}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </header>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Outlet />
        </div>
        <footer>
          <div
            style={pipe(
              {
                padding: "1rem",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-end",
                justifyContent: "center",
                textAlign: "center",
                gap: "0.5rem 2rem",
              },
              on(dark, {
                background: V.gray95,
              }),
              on(not(dark), {
                boxShadow: `0 -2px 0 0 ${V.gray10}`,
              }),
            )}
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
              {(
                [
                  ["Documentation", "/docs"],
                  ["GitHub", "https://github.com/css-hooks/css-hooks"],
                  ["NPM", "https://www.npmjs.com/org/css-hooks"],
                  ["X", "https://www.x.com/csshooks"],
                  ["Facebook", "https://www.facebook.com/csshooks"],
                ] as const
              ).map(([children, to]) => (
                <NavLink key={to} to={to}>
                  {children}
                </NavLink>
              ))}
            </nav>
          </div>
        </footer>{" "}
      </div>
    </>
  );
}

export function PageMeta({
  description,
  title,
}: {
  description?: string;
  title?: string;
}) {
  const siteName = "CSS Hooks";
  const url = `${import.meta.env.VITE_APP_URL}${useLocation().pathname}`;
  const ogImageURL = `${import.meta.env.VITE_APP_URL}/img/1200/630/opengraph.png`;
  return (
    <Helmet>
      <title>
        {`${title ? `${title} — ` : ""}`}
        {siteName}
      </title>
      <link rel="manifest" href="/manifest.json" />
      <link rel="canonical" href={url} />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/img/180/180/icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/img/32/32/icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/img/16/16/icon.png"
      />
      <meta name="description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImageURL} />
      <meta property="og:title" content={title || siteName} />
      <meta property="og:description" content={description} />
      <meta property="twitter:creator" content="agilecoder" />
      <meta property="twitter:site" content="csshooks" />
      <meta property="twitter:image" content={ogImageURL} />
      <meta property="twitter:title" content={title || siteName} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}

export function ScreenReaderOnly({ children }: { children?: ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        border: 0,
      }}
    >
      {children}
    </div>
  );
}

export function Preformatted({
  as: Tag = "pre",
  children,
}: {
  as?: "pre" | "div";
  children?: ReactNode;
}) {
  return (
    <Tag
      style={{
        fontFamily: "'Inconsolata', monospace",
        fontSize: "1rem",
        marginBlock: 0,
      }}
    >
      {children}
    </Tag>
  );
}

export function SyntaxHighlighter({
  children,
  language,
}: {
  children: string;
  language: z.infer<typeof syntaxHighlighterLanguageParser>;
}) {
  const [highlighted, setHighlighted] = useState(children);
  useEffect(() => {
    let canceler = false;
    fetch("/highlight", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lang: language, code: children }),
    })
      .then(x => x.text())
      .then(x => {
        if (!canceler) {
          setHighlighted(x);
        }
      })
      .catch(error => {
        console.error(error);
      });
    return () => {
      canceler = true;
    };
  }, [children]);
  return (
    <code
      style={{ font: "inherit" }}
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}
