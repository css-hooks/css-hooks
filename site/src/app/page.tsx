import Logo from "@/components/Logo";
import PageBlock from "@/components/PageBlock";
import SyntaxHighlighter from "@/components/SyntaxHighlighter";
import * as prettier from "prettier/standalone";
import * as prettierEstree from "prettier/plugins/estree";
import * as prettierTypescript from "prettier/plugins/typescript";
import hooks from "@/css-hooks";
import Code from "@/components/Code";
import Typography from "@/components/Typography";
import { exhausted } from "@/util/exhausted";
import { ReactNode } from "react";
import CtaButton from "@/components/CtaButton";
import Link from "next/link";
import frameworks from "./docs/[framework]/frameworks";

const codeExample = `
<a
  href="https://css-hooks.com/"
  style={hooks({
    color: "#03f",
    dark: {
      color: "#4d70ff",
    },
    hover: {
      color: "#09f",
    },
    active: {
      color: "#e33",
    },
  })}>
  Hooks
</a>
`;

export default async function Home() {
  const formattedCodeExample = (
    await prettier.format(codeExample, {
      plugins: [prettierEstree, prettierTypescript],
      parser: "typescript",
    })
  ).replace(/;$/gm, "");
  return (
    <>
      <header
        style={hooks({
          background: "var(--gray-100)",
          dark: { background: "var(--gray-950)" },
        })}
      >
        <PageBlock
          style={{
            paddingTop: "2rem",
            paddingBottom: "2rem",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
            gap: "2rem 8rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "2rem",
            }}
          >
            <Logo size="2rem" />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
            >
              <Typography variant="bold3XL">
                {({ className, style, ...restProps }) =>
                  exhausted(restProps) && (
                    <h1 className={className} style={style}>
                      Inline styles doing what we thought they couldn&apos;t.
                    </h1>
                  )
                }
              </Typography>
              <Typography variant="regularXL">
                {({ className, style, ...restProps }) =>
                  exhausted(restProps) && (
                    <p
                      className={className}
                      style={{
                        ...style,
                        flex: 1,
                        margin: 0,
                      }}
                    >
                      Hooks bring advanced CSS capabilities to native inline
                      styles, with practically zero runtime, no build steps, and
                      a tiny CSS footprint.
                    </p>
                  )
                }
              </Typography>
            </div>
            <CtaButton>
              {({ className, style, ...restProps }) =>
                exhausted(restProps) && (
                  <Link
                    href="/docs/react/getting-started"
                    className={className}
                    style={style}
                  >
                    Documentation
                  </Link>
                )
              }
            </CtaButton>
          </div>
          <section
            style={hooks({
              background: "var(--white)",
              padding: "2rem",
              dark: { background: "var(--black)" },
            })}
          >
            <Typography variant="codeBase">
              {({ className, style, ...restProps }) =>
                exhausted(restProps) && (
                  <pre className={className} style={style}>
                    <SyntaxHighlighter language="tsx">
                      {formattedCodeExample}
                    </SyntaxHighlighter>
                  </pre>
                )
              }
            </Typography>
          </section>
        </PageBlock>
      </header>
      <main>
        <PageBlock
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "4rem 8rem",
            marginTop: "4rem",
          }}
        >
          <Feature
            color="yellow"
            headline="Intuitive state-driven styling"
            iconPath="M288 464h-64a16 16 0 0 0 0 32h64a16 16 0 0 0 0-32Zm16-48h-96a16 16 0 0 0 0 32h96a16 16 0 0 0 0-32Zm65.42-353.31C339.35 32.58 299.07 16 256 16A159.62 159.62 0 0 0 96 176c0 46.62 17.87 90.23 49 119.64l4.36 4.09C167.37 316.57 192 339.64 192 360v24a16 16 0 0 0 16 16h24a8 8 0 0 0 8-8V274.82a8 8 0 0 0-5.13-7.47A130.73 130.73 0 0 1 208.71 253a16 16 0 1 1 18.58-26c7.4 5.24 21.65 13 28.71 13s21.31-7.78 28.73-13a16 16 0 0 1 18.56 26a130.73 130.73 0 0 1-26.16 14.32a8 8 0 0 0-5.13 7.47V392a8 8 0 0 0 8 8h24a16 16 0 0 0 16-16v-24c0-19.88 24.36-42.93 42.15-59.77l4.91-4.66C399.08 265 416 223.61 416 176a159.16 159.16 0 0 0-46.58-113.31Z"
          >
            Effortlessly define styles for states like <Code>hover</Code>,{" "}
            <Code>focus</Code>, and <Code>active</Code>. Create engaging UIs
            without the complexity of external CSS.
          </Feature>
          <Feature
            color="purple"
            headline="Inline styles made practical"
            iconPath="M96 208H48c-8.8 0-16-7.2-16-16s7.2-16 16-16h48c8.8 0 16 7.2 16 16s-7.2 16-16 16zm28.1-67.9c-4.2 0-8.3-1.7-11.3-4.7l-33.9-33.9c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0l33.9 33.9c6.3 6.2 6.3 16.4 0 22.6c-3 3-7 4.7-11.3 4.7zM192 112c-8.8 0-16-7.2-16-16V48c0-8.8 7.2-16 16-16s16 7.2 16 16v48c0 8.8-7.2 16-16 16zm67.9 28.1c-8.8 0-16-7.2-16-16c0-4.2 1.7-8.3 4.7-11.3l33.9-33.9c6.2-6.2 16.4-6.2 22.6 0c6.2 6.2 6.2 16.4 0 22.6l-33.9 33.9c-3 3-7.1 4.7-11.3 4.7zM90.2 309.8c-8.8 0-16-7.2-16-16c0-4.2 1.7-8.3 4.7-11.3l33.9-33.9c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6l-33.9 33.9c-3 3-7.1 4.7-11.3 4.7zm144-142.8c-18.4-18.7-48.5-19-67.2-.7s-19 48.5-.7 67.2l.7.7l39.5 39.5c3.1 3.1 8.2 3.1 11.3 0l55.9-55.9c3.1-3.1 3.1-8.2 0-11.3L234.2 167zM457 389.8L307.6 240.4c-3.1-3.1-8.2-3.1-11.3 0l-55.9 55.9c-3.1 3.1-3.1 8.2 0 11.3L389.8 457c18.4 18.7 48.5 19 67.2.7c18.7-18.4 19-48.5.7-67.2c-.2-.2-.4-.5-.7-.7z"
          >
            Hooks take the simplest styling approach to the next level, removing
            limitations to create a viable solution for real-world use cases.
          </Feature>
          <Feature
            color="blue"
            headline="Reusable knowledge"
            iconPath="M202.24 74C166.11 56.75 115.61 48.3 48 48a31.36 31.36 0 0 0-17.92 5.33A32 32 0 0 0 16 79.9V366c0 19.34 13.76 33.93 32 33.93c71.07 0 142.36 6.64 185.06 47a4.11 4.11 0 0 0 6.94-3V106.82a15.89 15.89 0 0 0-5.46-12A143 143 0 0 0 202.24 74Zm279.68-20.7A31.33 31.33 0 0 0 464 48c-67.61.3-118.11 8.71-154.24 26a143.31 143.31 0 0 0-32.31 20.78a15.93 15.93 0 0 0-5.45 12v337.13a3.93 3.93 0 0 0 6.68 2.81c25.67-25.5 70.72-46.82 185.36-46.81a32 32 0 0 0 32-32v-288a32 32 0 0 0-14.12-26.61Z"
          >
            Hooks enhance the way you already write inline styles, rather than
            imposing new syntax or non-standard utility classes.
          </Feature>
          <Feature
            color="green"
            headline="Predictable performance"
            iconPath="M425.7 118.25A240 240 0 0 0 76.32 447l.18.2c.33.35.64.71 1 1.05c.74.84 1.58 1.79 2.57 2.78a41.17 41.17 0 0 0 60.36-.42a157.13 157.13 0 0 1 231.26 0a41.18 41.18 0 0 0 60.65.06l3.21-3.5l.18-.2a239.93 239.93 0 0 0-10-328.76ZM240 128a16 16 0 0 1 32 0v32a16 16 0 0 1-32 0ZM128 304H96a16 16 0 0 1 0-32h32a16 16 0 0 1 0 32Zm48.8-95.2a16 16 0 0 1-22.62 0l-22.63-22.62a16 16 0 0 1 22.63-22.63l22.62 22.63a16 16 0 0 1 0 22.62Zm149.3 23.1l-47.5 75.5a31 31 0 0 1-7 7a30.11 30.11 0 0 1-35-49l75.5-47.5a10.23 10.23 0 0 1 11.7 0a10.06 10.06 0 0 1 2.3 14Zm31.72-23.1a16 16 0 0 1-22.62-22.62l22.62-22.63a16 16 0 0 1 22.63 22.63Zm65.88 227.6ZM416 304h-32a16 16 0 0 1 0-32h32a16 16 0 0 1 0 32Z"
          >
            Hooks are pure, don&apos;t depend on runtime CSS magic, and avoid
            shipping large volumes of irrelevant, render-blocking CSS.
          </Feature>
          <Feature
            color="gray"
            headline="Extreme maintainability"
            iconPath={[
              "M503.58 126.2a16.85 16.85 0 0 0-27.07-4.55l-51.15 51.15a11.15 11.15 0 0 1-15.66 0l-22.48-22.48a11.17 11.17 0 0 1 0-15.67l50.88-50.89a16.85 16.85 0 0 0-5.27-27.4c-39.71-17-89.08-7.45-120 23.29c-26.81 26.61-34.83 68-22 113.7a11 11 0 0 1-3.16 11.1L114.77 365.1a56.76 56.76 0 1 0 80.14 80.18L357 272.08a11 11 0 0 1 10.9-3.17c45 12 86 4 112.43-22c15.2-15 25.81-36.17 29.89-59.71c3.83-22.2 1.41-44.44-6.64-61Z",
              "M437.33 378.41c-13.94-11.59-43.72-38.4-74.07-66.22l-66.07 70.61c28.24 30 53.8 57.85 65 70.88l.07.08A30 30 0 0 0 383.72 464h1.1a30.11 30.11 0 0 0 21-8.62l.07-.07l33.43-33.37a29.46 29.46 0 0 0-2-43.53ZM118.54 214.55a20.48 20.48 0 0 0-3-10.76a2.76 2.76 0 0 1 2.62-4.22h.06c.84.09 5.33.74 11.7 4.61c4.73 2.87 18.23 12.08 41.73 35.54a34.23 34.23 0 0 0 7.22 22.12l66.23-61.55a33.73 33.73 0 0 0-21.6-9.2a2.65 2.65 0 0 1-.21-.26l-.65-.69l-24.54-33.84a28.45 28.45 0 0 1-4-26.11a35.23 35.23 0 0 1 11.78-16.35c5.69-4.41 18.53-9.72 29.44-10.62a52.92 52.92 0 0 1 15.19.94a65.57 65.57 0 0 1 7.06 2.13a15.46 15.46 0 0 0 2.15.63a16 16 0 0 0 16.38-25.06c-.26-.35-1.32-1.79-2.89-3.73a91.85 91.85 0 0 0-9.6-10.36c-8.15-7.36-29.27-19.77-57-19.77a123.13 123.13 0 0 0-46.3 9c-38.37 15.45-63.47 36.58-75.01 47.79l-.09.09A222.14 222.14 0 0 0 63.7 129.5a27 27 0 0 0-4.7 11.77a7.33 7.33 0 0 1-7.71 6.17H50.2a20.65 20.65 0 0 0-14.59 5.9L6.16 182.05l-.32.32a20.89 20.89 0 0 0-.24 28.72c.19.2.37.39.57.58L53.67 258a21 21 0 0 0 14.65 6a20.65 20.65 0 0 0 14.59-5.9l29.46-28.79a20.51 20.51 0 0 0 6.17-14.76Z",
            ]}
          >
            Inline styles tightly integrate with markup, promoting local
            reasoning and allowing you to change components quickly and easily.
          </Feature>
          <Feature
            color="pink"
            headline="Server-side reliability"
            iconPath={[
              "M256 428c-52.35 0-111.39-11.61-157.93-31c-17.07-7.19-31.69-18.82-43.64-28a4 4 0 0 0-6.43 3.18v12.58c0 28.07 23.49 53.22 66.14 70.82C152.29 471.33 202.67 480 256 480s103.7-8.67 141.86-24.42C440.51 438 464 412.83 464 384.76v-12.58a4 4 0 0 0-6.43-3.18c-11.95 9.17-26.57 20.81-43.65 28c-46.54 19.39-105.57 31-157.92 31Zm208-301.49c-.81-27.65-24.18-52.4-66-69.85C359.74 40.76 309.34 32 256 32s-103.74 8.76-141.91 24.66c-41.78 17.41-65.15 42.11-66 69.69L48 144c0 6.41 5.2 16.48 14.63 24.73c11.13 9.73 27.65 19.33 47.78 27.73C153.24 214.36 207.67 225 256 225s102.76-10.68 145.59-28.58c20.13-8.4 36.65-18 47.78-27.73C458.8 160.49 464 150.42 464 144Z",
              "M413.92 226c-46.53 19.43-105.57 31-157.92 31s-111.39-11.57-157.93-31c-17.07-7.15-31.69-18.79-43.64-28a4 4 0 0 0-6.43 3.22V232c0 6.41 5.2 14.48 14.63 22.73c11.13 9.74 27.65 19.33 47.78 27.74C153.24 300.34 207.67 311 256 311s102.76-10.68 145.59-28.57c20.13-8.41 36.65-18 47.78-27.74C458.8 246.47 464 238.41 464 232v-30.78a4 4 0 0 0-6.43-3.18c-11.95 9.17-26.57 20.81-43.65 27.96Z",
              "M413.92 312c-46.54 19.41-105.57 31-157.92 31s-111.39-11.59-157.93-31c-17.07-7.17-31.69-18.81-43.64-28a4 4 0 0 0-6.43 3.2V317c0 6.41 5.2 14.47 14.62 22.71c11.13 9.74 27.66 19.33 47.79 27.74C153.24 385.32 207.66 396 256 396s102.76-10.68 145.59-28.57c20.13-8.41 36.65-18 47.78-27.74C458.8 331.44 464 323.37 464 317v-29.8a4 4 0 0 0-6.43-3.18c-11.95 9.17-26.57 20.81-43.65 27.98Z",
            ]}
          >
            Directly embedded within HTML markup without side effects, hooks
            make server-side rendering simple and reliable. It just works.
          </Feature>
        </PageBlock>
        <PageBlock
          style={{
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
            marginTop: "4rem",
          }}
        >
          <DesignedFor
            framework="react"
            logo={
              <svg
                style={{
                  height: 160,
                  maxWidth: "100%",
                  color: "#149eca",
                }}
                viewBox="-11.5 -10.23174 23 20.46348"
              >
                <circle cx="0" cy="0" r="2.05" fill="currentColor" />
                <g stroke="currentColor" strokeWidth="1" fill="none">
                  <ellipse rx="11" ry="4.2" />
                  <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                  <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                </g>
              </svg>
            }
          />
          <DesignedFor
            framework="solid"
            logo={
              <svg
                style={{ height: 160, maxWidth: "100%" }}
                viewBox="0 0 166 155.3"
              >
                <defs>
                  <linearGradient
                    id="a"
                    x1="27.5"
                    x2="152"
                    y1="3"
                    y2="63.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0.1" stopColor="#76b3e1"></stop>
                    <stop offset="0.3" stopColor="#dcf2fd"></stop>
                    <stop offset="1" stopColor="#76b3e1"></stop>
                  </linearGradient>
                  <linearGradient
                    id="b"
                    x1="95.8"
                    x2="74"
                    y1="32.6"
                    y2="105.2"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#76b3e1"></stop>
                    <stop offset="0.5" stopColor="#4377bb"></stop>
                    <stop offset="1" stopColor="#1f3b77"></stop>
                  </linearGradient>
                  <linearGradient
                    id="c"
                    x1="18.4"
                    x2="144.3"
                    y1="64.2"
                    y2="149.8"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#315aa9"></stop>
                    <stop offset="0.5" stopColor="#518ac8"></stop>
                    <stop offset="1" stopColor="#315aa9"></stop>
                  </linearGradient>
                  <linearGradient
                    id="d"
                    x1="75.2"
                    x2="24.4"
                    y1="74.5"
                    y2="260.8"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#4377bb"></stop>
                    <stop offset="0.5" stopColor="#1a336b"></stop>
                    <stop offset="1" stopColor="#1a336b"></stop>
                  </linearGradient>
                </defs>
                <path
                  fill="#76b3e1"
                  d="M163 35S110-4 69 5l-3 1c-6 2-11 5-14 9l-2 3-15 26 26 5c11 7 25 10 38 7l46 9 18-30z"
                ></path>
                <path
                  fill="url(#a)"
                  d="M163 35S110-4 69 5l-3 1c-6 2-11 5-14 9l-2 3-15 26 26 5c11 7 25 10 38 7l46 9 18-30z"
                  opacity="0.3"
                ></path>
                <path
                  fill="#518ac8"
                  d="M52 35l-4 1c-17 5-22 21-13 35 10 13 31 20 48 15l62-21S92 26 52 35z"
                ></path>
                <path
                  fill="url(#b)"
                  d="M52 35l-4 1c-17 5-22 21-13 35 10 13 31 20 48 15l62-21S92 26 52 35z"
                  opacity="0.3"
                ></path>
                <path
                  fill="url(#c)"
                  d="M134 80a45 45 0 00-48-15L24 85 4 120l112 19 20-36c4-7 3-15-2-23z"
                ></path>
                <path
                  fill="url(#d)"
                  d="M114 115a45 45 0 00-48-15L4 120s53 40 94 30l3-1c17-5 23-21 13-34z"
                ></path>
              </svg>
            }
          />
          <DesignedFor
            framework="preact"
            logo={
              <svg
                viewBox="0 0 512 512"
                style={{ height: 160, maxWidth: "100%" }}
              >
                <g transform="translate(256,256)">
                  <path
                    d="M0,-256 222,-128 222,128 0,256 -222,128 -222,-128z"
                    fill="#673ab8"
                  />
                  <ellipse
                    cx="0"
                    cy="0"
                    strokeWidth="16"
                    rx="75"
                    ry="196"
                    fill="none"
                    stroke="#ffffff"
                    transform="rotate(52.5)"
                  />

                  <ellipse
                    cx="0"
                    cy="0"
                    strokeWidth="16"
                    rx="75"
                    ry="196"
                    fill="none"
                    stroke="#ffffff"
                    transform="rotate(-52.5)"
                  />

                  <circle cx="0" cy="0" r="34" fill="#ffffff" />
                </g>
              </svg>
            }
          />
        </PageBlock>
      </main>
    </>
  );
}

function Feature({
  color = "gray",
  iconPath,
  headline,
  children,
}: {
  color: "gray" | "pink" | "yellow" | "green" | "blue" | "purple";
  iconPath: string | string[];
  headline: string;
  children: ReactNode;
}) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <div
          style={hooks({
            background: `var(--${color}-200)`,
            color: `var(--${color}-700)`,
            width: "3rem",
            height: "3rem",
            borderRadius: 9999,
            display: "grid",
            placeItems: "center",
            dark: {
              boxShadow: `0 0 32px 0 var(--${color}-950)`,
              background: `var(--${color}-900)`,
              color: `var(--${color}-400)`,
            },
          })}
        >
          <svg width="1.5rem" height="1.5rem" viewBox="0 0 512 512">
            {(typeof iconPath === "string" ? [iconPath] : iconPath).map(
              (p, i) => (
                <path key={i} fill="currentColor" d={p} />
              ),
            )}
          </svg>
        </div>
        <Typography
          variant="boldBase"
          style={hooks({
            color: `var(--${color}-700)`,
            dark: { color: `var(--${color}-${color == "gray" ? 4 : 5}00)` },
          })}
        >
          {headline}
        </Typography>
      </div>
      <Typography variant="regularBase">
        {({ className, style, ...restProps }) =>
          exhausted(restProps) && (
            <p className={className} style={{ ...style, margin: 0 }}>
              {children}
            </p>
          )
        }
      </Typography>
    </section>
  );
}

function DesignedFor({
  framework,
  logo,
}: {
  framework: (typeof frameworks)[number];
  logo: ReactNode;
}) {
  return (
    <div
      className="group"
      style={hooks({
        flexBasis: "calc((44rem - 100%) * 999)",
        flexGrow: 1,
        background: "var(--gray-100)",
        color: "var(--gray-800)",
        dark: {
          background: "var(--gray-950)",
          color: "var(--gray-100)",
        },
        padding: 32,
        display: "flex",
        flexDirection: "column",
        gap: 48,
        alignItems: "center",
      })}
    >
      <h1
        style={{
          margin: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="regularSmallCaps"
          style={hooks({
            color: "var(--gray-600)",
            dark: { color: "var(--gray-400)" },
          })}
        >
          Designed for
        </Typography>
        <Typography variant="regular2XL">
          {framework.replace(/^[a-z]/, x => x.toUpperCase())}
        </Typography>
      </h1>
      <CtaButton theme="gray">
        {({ className, style, ...restProps }) =>
          exhausted(restProps) && (
            <Link
              href={`/docs/${framework}/getting-started`}
              className={`${className} embedded`}
              style={{ ...style, order: 999 }}
            >
              Get started
            </Link>
          )
        }
      </CtaButton>
      <div
        style={hooks({
          opacity: 0.75,
          filter: "grayscale(0.5)",
          dark: {
            filter: "grayscale(0.75)",
          },
          previousHover: { opacity: 1, filter: "grayscale(0)" },
        })}
      >
        {logo}
      </div>
    </div>
  );
}
