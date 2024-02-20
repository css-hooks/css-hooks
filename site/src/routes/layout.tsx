import { component$, Slot } from "@builder.io/qwik";
import {
  useLocation,
  type DocumentHead,
  type RequestHandler,
} from "@builder.io/qwik-city";
import * as V from "varsace";
import { Anchor } from "~/components/anchor";
import { Logo } from "~/components/logo";
import { ThemeSwitcher } from "~/components/theme-switcher";
import { css } from "~/css";
import * as Icon from "~/components/icons";
import { ScreenReaderOnly } from "~/components/screen-reader-only";

type Meta = Exclude<Exclude<DocumentHead, Function>["meta"], undefined>;

class MetaBuilder {
  constructor(readonly meta: Meta) {}

  concat(callback: (meta: Meta) => Meta): MetaBuilder {
    return new MetaBuilder(this.meta.concat(callback(this.meta)));
  }

  build() {
    return this.meta;
  }
}

export const head: DocumentHead = ({ head, url }) => ({
  title: `${head.title ? `${head.title} — ` : ""}CSS Hooks`,
  meta: new MetaBuilder(head.meta)
    .concat(meta =>
      meta.some(m => m.property === "og:image")
        ? []
        : [{ property: "og:image", content: `${url.origin}/opengraph.png` }],
    )
    .concat(meta =>
      meta.some(m => m.property === "og:title")
        ? []
        : [{ property: "og:title", content: head.title || "CSS Hooks" }],
    )
    .concat(meta =>
      meta.some(m => m.property === "og:description")
        ? []
        : head.meta
            .filter(m => m.name === "description")
            .map(({ content }) => ({ property: "og:description", content })),
    )
    .concat(meta =>
      meta.some(m => m.property === "og:url")
        ? []
        : [{ property: "og:url", content: url.toString() }],
    )
    .concat(meta =>
      meta.some(m => m.property === "og:site_name")
        ? [{ property: "og:site_name", content: "CSS Hooks" }]
        : [],
    )
    .concat(meta =>
      meta.some(m => m.property === "twitter:creator")
        ? []
        : [{ property: "twitter:creator", content: "agilecoder" }],
    )
    .concat(meta =>
      meta.some(m => m.property === "twitter:site")
        ? []
        : [{ property: "twitter:site", content: "csshooks" }],
    )
    .concat(meta =>
      meta.some(m => m.property === "twitter:image")
        ? []
        : meta
            .filter(m => m.property === "og:image")
            .map(({ content }) => ({ property: "twitter:image", content })),
    )
    .concat(meta =>
      meta.some(m => m.property === "twitter:title")
        ? []
        : meta
            .filter(m => m.property === "og:title")
            .map(({ content }) => ({ property: "twitter:title", content })),
    )
    .concat(meta =>
      meta.some(m => m.property === "twitter:description")
        ? []
        : meta
            .filter(m => m.property === "og:description")
            .map(({ content }) => ({
              property: "twitter:description",
              content,
            })),
    )
    .concat(meta =>
      meta.some(m => m.property === "twitter:card")
        ? []
        : [{ property: "twitter:card", content: "summary_large_image" }],
    )
    .build()
    .filter(
      ({ name, property }) =>
        !head.meta.some(m => m.name === name || m.property === property),
    ),
});

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  const {
    url: { pathname },
  } = useLocation();
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
        <Anchor
          href="/"
          style={{
            textDecoration: "none",
          }}
        >
          <Logo />
        </Anchor>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "1em",
          }}
        >
          <Anchor
            href="/docs"
            selected={pathname === "/docs/"}
            style={{ display: "inline-flex" }}
          >
            <Icon.MenuBook />
            <ScreenReaderOnly>Documentation</ScreenReaderOnly>
          </Anchor>
          <Anchor
            href="https://github.com/css-hooks/css-hooks"
            style={{ display: "inline-flex" }}
          >
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
        <Slot />
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
              <Anchor key={children} href={href}>
                {children}
              </Anchor>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
});
