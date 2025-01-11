import "./global.css";

import { useEffect, useState } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { pipe } from "remeda";
import * as v from "valibot";

import type { Route } from "./+types/root.ts";
import {
  ArrowDropDownIcon,
  DarkModeIcon,
  GitHubIcon,
  LightModeIcon,
  MenuBookIcon,
} from "./components/icons.tsx";
import { Logo } from "./components/logo.tsx";
import { NavLink } from "./components/nav-link.tsx";
import { ScreenReaderOnly } from "./components/screen-reader-only.tsx";
import { and, dark, hover, not, on, styleSheet } from "./css.ts";
import { createMetaDescriptors } from "./data/meta.ts";
import { black, blue, gray, red, white } from "./design/colors.ts";

export const meta: Route.MetaFunction = createMetaDescriptors({
  description:
    "Hooks add CSS features to native inline styles, with no build steps and minimal runtime.",
});

export const links: Route.LinksFunction = () => [
  ...[32, 128, 180, 192].map(x => ({
    rel: "icon",
    href: `/icons/${x}/${x}/icon.png`,
    sizes: `${x}x${x}`,
  })),
  {
    rel: "apple-touch-icon",
    href: "/icons/180/180/icon.png",
    sizes: "180x180",
  },
  {
    rel: "manifest",
    href: "/manifest.json",
  },
];

const themeAttr = "data-theme";
const themeKey = "pref.theme";
const themes = ["dark", "auto", "light"] as const;

function ThemeSwitcher() {
  const [theme, setTheme] = useState<(typeof themes)[number]>("auto");

  useEffect(() => {
    const root = document.documentElement;

    const sync = () => {
      const themeParseResult = v.safeParse(
        v.union(themes.map(theme => v.literal(theme))),
        root.getAttribute(themeAttr),
      );
      if (themeParseResult.success) {
        setTheme(themeParseResult.output);
      } else {
        root.setAttribute(themeAttr, "auto");
      }
    };

    sync();

    const obs = new MutationObserver(entries => {
      entries.slice(0, 1).forEach(sync);
    });

    obs.observe(root, { attributes: true, attributeFilter: [themeAttr] });

    return () => {
      obs.disconnect();
    };
  }, []);

  return (
    <div
      style={pipe(
        {
          position: "relative",
          display: "inline-flex",
          outlineWidth: 0,
          outlineStyle: "solid",
          outlineColor: blue(20),
          outlineOffset: 2,
          color: blue(60),
        },
        on("&:has(:focus-visible)", {
          outlineWidth: 2,
        }),
        on(hover, {
          color: blue(50),
        }),
        on("&:active", {
          color: red(50),
        }),
        on(dark, {
          outlineColor: blue(50),
          color: blue(30),
        }),
        on(and(dark, hover), {
          color: blue(20),
        }),
        on(and(dark, "&:active"), {
          color: red(20),
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
      <label>
        <ScreenReaderOnly>Theme</ScreenReaderOnly>
        <select
          style={{
            fontSize: 0,
            position: "absolute",
            inset: 0,
            opacity: 0,
          }}
          value={theme}
          onChange={e => {
            localStorage.setItem(themeKey, e.target.value);
            document.documentElement.setAttribute(themeAttr, e.target.value);
          }}
        >
          {themes.map(theme => (
            <option
              key={theme}
              style={{
                fontSize: "1rem",
                background: white,
                color: black,
              }}
            >
              {theme}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="auto" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {var t=localStorage.getItem(${JSON.stringify(themeKey)});if (${JSON.stringify(themes)}.includes(t)) {document.documentElement.setAttribute(${JSON.stringify(themeAttr)}, t)}})()`,
          }}
        />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <style dangerouslySetInnerHTML={{ __html: styleSheet() }} />
      </head>
      <body
        style={{
          fontFamily: "'Inter Variable', sans-serif",
          lineHeight: 1.25,
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={pipe(
            {
              background: white,
              color: gray(90),
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            },
            on("@supports (height: 100dvh)", {
              minHeight: "100dvh",
            }),
            on(dark, {
              background: gray(90),
              color: white,
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
                color: black,
                padding: "1.5rem",
                borderStyle: "solid",
                borderWidth: 0,
                borderBottomWidth: 2,
                borderColor: gray(10),
              },
              on(dark, {
                borderColor: gray(95),
                color: white,
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
                  background: gray(95),
                }),
                on(not(dark), {
                  boxShadow: `0 -2px 0 0 ${gray(10)}`,
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
          </footer>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
