import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { pipe } from "remeda";
import * as V from "varsace";

import {
  Block,
  CodeSandboxIcon,
  GitHubIcon,
  MenuBookIcon,
  PageMeta,
  Preformatted,
  ScreenReaderOnly,
  SyntaxHighlighter,
} from "./components.tsx";
import {
  and,
  dark,
  intent,
  intentAdjacentSibling,
  not,
  on,
  or,
} from "./css.ts";

export function Home() {
  return (
    <>
      <PageMeta description="Hooks add CSS features to native inline styles, with no build steps and minimal runtime." />
      <section
        style={pipe(
          {
            color: V.white,
            padding: "4rem 0",
            textAlign: "center",
            lineHeight: 1.25,
          },
          on(dark, {
            background: V.gray85,
          }),
          on(not(dark), {
            background: `linear-gradient(transparent, transparent calc(100% - 2px), ${V.gray10} calc(100% - 2px))`,
          }),
        )}
      >
        <Block>
          <h1
            style={pipe(
              {
                margin: 0,
                fontSize: "3rem",
                lineHeight: 1,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: V.gray50,
              },
              on("@media (width >= 44em)", {
                fontSize: "3.75rem",
              }),
            )}
          >
            Do the{" "}
            <em
              style={{
                color: V.pink30,
                fontStyle: "normal",
              }}
            >
              impossible
            </em>
            <br
              style={pipe(
                {},
                on("@media (width >= 69em)", {
                  display: "none",
                }),
              )}
            />{" "}
            with inline styles.
          </h1>
          <p
            style={pipe(
              {
                margin: 0,
                marginTop: "2rem",
                color: V.black,
                fontSize: "1rem",
                lineHeight: 1.25,
              },
              on("@media (width >= 44em)", {
                fontSize: "1.375rem",
                lineHeight: "calc(14 / 11)",
              }),
              on("@media (width >= 69em)", {
                marginTop: "1rem",
              }),
              on(dark, {
                color: V.white,
              }),
            )}
          >
            Hooks add CSS features to native{" "}
            <br
              style={pipe(
                {},
                on("@media (width >= 28em)", {
                  display: "none",
                }),
              )}
            />{" "}
            inline styles,{" "}
            <br
              style={pipe(
                {},
                on(or("@media (width < 28em)", "@media (width >= 69em)"), {
                  display: "none",
                }),
              )}
            />
            with no build steps{" "}
            <br
              style={pipe(
                {},
                on("@media (width >= 28em)", {
                  display: "none",
                }),
              )}
            />
            and minimal runtime.
          </p>
          <div
            style={pipe(
              {
                marginTop: "2rem",
                display: "inline-flex",
                gap: "1rem",
              },
              on("@media (width >= 69em)", {
                marginTop: "4rem",
              }),
            )}
          >
            <CtaButton to="/docs" theme="primary" icon={<MenuBookIcon />}>
              Docs
            </CtaButton>
            <div
              style={pipe(
                {
                  display: "contents",
                },
                on("@media (width >= 44em)", {
                  display: "none",
                }),
              )}
            >
              <CtaButton
                to="https://github.com/css-hooks/css-hooks"
                icon={<GitHubIcon />}
              >
                Star
              </CtaButton>
            </div>
            <div
              style={pipe(
                {
                  display: "none",
                },
                on("@media (width >= 44em)", {
                  display: "contents",
                }),
              )}
            >
              <CtaButton
                to="https://githubbox.com/css-hooks/css-hooks/tree/master/examples/react"
                icon={<CodeSandboxIcon />}
              >
                Demo
              </CtaButton>
            </div>
          </div>
        </Block>
      </section>
      <PseudoClassesDemo />
      <SelectorDemo />
      <ResponsiveDemo />
      <Section title="Benefits">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "4rem 8rem",
          }}
        >
          <Feature
            color="purple"
            iconPath="M96 208H48c-8.8 0-16-7.2-16-16s7.2-16 16-16h48c8.8 0 16 7.2 16 16s-7.2 16-16 16zm28.1-67.9c-4.2 0-8.3-1.7-11.3-4.7l-33.9-33.9c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0l33.9 33.9c6.3 6.2 6.3 16.4 0 22.6c-3 3-7 4.7-11.3 4.7zM192 112c-8.8 0-16-7.2-16-16V48c0-8.8 7.2-16 16-16s16 7.2 16 16v48c0 8.8-7.2 16-16 16zm67.9 28.1c-8.8 0-16-7.2-16-16c0-4.2 1.7-8.3 4.7-11.3l33.9-33.9c6.2-6.2 16.4-6.2 22.6 0c6.2 6.2 6.2 16.4 0 22.6l-33.9 33.9c-3 3-7.1 4.7-11.3 4.7zM90.2 309.8c-8.8 0-16-7.2-16-16c0-4.2 1.7-8.3 4.7-11.3l33.9-33.9c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6l-33.9 33.9c-3 3-7.1 4.7-11.3 4.7zm144-142.8c-18.4-18.7-48.5-19-67.2-.7s-19 48.5-.7 67.2l.7.7l39.5 39.5c3.1 3.1 8.2 3.1 11.3 0l55.9-55.9c3.1-3.1 3.1-8.2 0-11.3L234.2 167zM457 389.8L307.6 240.4c-3.1-3.1-8.2-3.1-11.3 0l-55.9 55.9c-3.1 3.1-3.1 8.2 0 11.3L389.8 457c18.4 18.7 48.5 19 67.2.7c18.7-18.4 19-48.5.7-67.2c-.2-.2-.4-.5-.7-.7z"
            headline="Inline styles made practical"
          >
            Hooks take the simplest styling approach to the next level, removing
            limitations to make it a viable solution for real-world use cases.
          </Feature>
          <Feature
            color="yellow"
            iconPath="M288 464h-64a16 16 0 0 0 0 32h64a16 16 0 0 0 0-32Zm16-48h-96a16 16 0 0 0 0 32h96a16 16 0 0 0 0-32Zm65.42-353.31C339.35 32.58 299.07 16 256 16A159.62 159.62 0 0 0 96 176c0 46.62 17.87 90.23 49 119.64l4.36 4.09C167.37 316.57 192 339.64 192 360v24a16 16 0 0 0 16 16h24a8 8 0 0 0 8-8V274.82a8 8 0 0 0-5.13-7.47A130.73 130.73 0 0 1 208.71 253a16 16 0 1 1 18.58-26c7.4 5.24 21.65 13 28.71 13s21.31-7.78 28.73-13a16 16 0 0 1 18.56 26a130.73 130.73 0 0 1-26.16 14.32a8 8 0 0 0-5.13 7.47V392a8 8 0 0 0 8 8h24a16 16 0 0 0 16-16v-24c0-19.88 24.36-42.93 42.15-59.77l4.91-4.66C399.08 265 416 223.61 416 176a159.16 159.16 0 0 0-46.58-113.31Z"
            headline="Intuitive state-driven styling"
          >
            Effortlessly define styles for states like hover, focus, and active.
            Create engaging UIs without the complexity of external CSS.
          </Feature>
          <Feature
            color="teal"
            iconPath="M202.24 74C166.11 56.75 115.61 48.3 48 48a31.36 31.36 0 0 0-17.92 5.33A32 32 0 0 0 16 79.9V366c0 19.34 13.76 33.93 32 33.93c71.07 0 142.36 6.64 185.06 47a4.11 4.11 0 0 0 6.94-3V106.82a15.89 15.89 0 0 0-5.46-12A143 143 0 0 0 202.24 74Zm279.68-20.7A31.33 31.33 0 0 0 464 48c-67.61.3-118.11 8.71-154.24 26a143.31 143.31 0 0 0-32.31 20.78a15.93 15.93 0 0 0-5.45 12v337.13a3.93 3.93 0 0 0 6.68 2.81c25.67-25.5 70.72-46.82 185.36-46.81a32 32 0 0 0 32-32v-288a32 32 0 0 0-14.12-26.61Z"
            headline="Reusable knowledge"
          >
            Hooks enhance the way you already write inline styles, rather than
            forcing you to learn non-standard utility class syntax.
          </Feature>
          <Feature
            color="green"
            iconPath="M425.7 118.25A240 240 0 0 0 76.32 447l.18.2c.33.35.64.71 1 1.05c.74.84 1.58 1.79 2.57 2.78a41.17 41.17 0 0 0 60.36-.42a157.13 157.13 0 0 1 231.26 0a41.18 41.18 0 0 0 60.65.06l3.21-3.5l.18-.2a239.93 239.93 0 0 0-10-328.76ZM240 128a16 16 0 0 1 32 0v32a16 16 0 0 1-32 0ZM128 304H96a16 16 0 0 1 0-32h32a16 16 0 0 1 0 32Zm48.8-95.2a16 16 0 0 1-22.62 0l-22.63-22.62a16 16 0 0 1 22.63-22.63l22.62 22.63a16 16 0 0 1 0 22.62Zm149.3 23.1l-47.5 75.5a31 31 0 0 1-7 7a30.11 30.11 0 0 1-35-49l75.5-47.5a10.23 10.23 0 0 1 11.7 0a10.06 10.06 0 0 1 2.3 14Zm31.72-23.1a16 16 0 0 1-22.62-22.62l22.62-22.63a16 16 0 0 1 22.63 22.63Zm65.88 227.6ZM416 304h-32a16 16 0 0 1 0-32h32a16 16 0 0 1 0 32Z"
            headline="Predictable performance"
          >
            Hooks are pure, don&apos;t depend on style injection, and avoid
            shipping large volumes of irrelevant, render-blocking CSS.
          </Feature>
          <Feature
            color="blue"
            iconPath={[
              "M503.58 126.2a16.85 16.85 0 0 0-27.07-4.55l-51.15 51.15a11.15 11.15 0 0 1-15.66 0l-22.48-22.48a11.17 11.17 0 0 1 0-15.67l50.88-50.89a16.85 16.85 0 0 0-5.27-27.4c-39.71-17-89.08-7.45-120 23.29c-26.81 26.61-34.83 68-22 113.7a11 11 0 0 1-3.16 11.1L114.77 365.1a56.76 56.76 0 1 0 80.14 80.18L357 272.08a11 11 0 0 1 10.9-3.17c45 12 86 4 112.43-22c15.2-15 25.81-36.17 29.89-59.71c3.83-22.2 1.41-44.44-6.64-61Z",
              "M.94-11.59-43.72-38.4-74.07-66.22l-66.07 70.61c28.24 30 53.8 57.85 65 70.88l.07.08A30 30 0 0 0 383.72 464h1.1a30.11 30.11 0 0 0 21-8.62l.07-.07l33.43-33.37a29.46 29.46 0 0 0-2-43.53ZM118.54 214.55a20.48 20.48 0 0 0-3-10.76a2.76 2.76 0 0 1 2.62-4.22h.06c.84.09 5.33.74 11.7 4.61c4.73 2.87 18.23 12.08 41.73 35.54a34.23 34.23 0 0 0 7.22 22.12l66.23-61.55a33.73 33.73 0 0 0-21.6-9.2a2.65 2.65 0 0 1-.21-.26l-.65-.69l-24.54-33.84a28.45 28.45 0 0 1-4-26.11a35.23 35.23 0 0 1 11.78-16.35c5.69-4.41 18.53-9.72 29.44-10.62a52.92 52.92 0 0 1 15.19.94a65.57 65.57 0 0 1 7.06 2.13a15.46 15.46 0 0 0 2.15.63a16 16 0 0 0 16.38-25.06c-.26-.35-1.32-1.79-2.89-3.73a91.85 91.85 0 0 0-9.6-10.36c-8.15-7.36-29.27-19.77-57-19.77a123.13 123.13 0 0 0-46.3 9c-38.37 15.45-63.47 36.58-75.01 47.79l-.09.09A222.14 222.14 0 0 0 63.7 129.5a27 27 0 0 0-4.7 11.77a7.33 7.33 0 0 1-7.71 6.17H50.2a20.65 20.65 0 0 0-14.59 5.9L6.16 182.05l-.32.32a20.89 20.89 0 0 0-.24 28.72c.19.2.37.39.57.58L53.67 258a21 21 0 0 0 14.65 6a20.65 20.65 0 0 0 14.59-5.9l29.46-28.79a20.51 20.51 0 0 0 6.17-14.76Z",
            ]}
            headline="Extreme maintainability"
          >
            Inline styles tightly integrate with markup, promoting local
            reasoning and allowing you to change components quickly and easily.
          </Feature>
          <Feature
            color="pink"
            iconPath={[
              "M256 428c-52.35 0-111.39-11.61-157.93-31c-17.07-7.19-31.69-18.82-43.64-28a4 4 0 0 0-6.43 3.18v12.58c0 28.07 23.49 53.22 66.14 70.82C152.29 471.33 202.67 480 256 480s103.7-8.67 141.86-24.42C440.51 438 464 412.83 464 384.76v-12.58a4 4 0 0 0-6.43-3.18c-11.95 9.17-26.57 20.81-43.65 28c-46.54 19.39-105.57 31-157.92 31Zm208-301.49c-.81-27.65-24.18-52.4-66-69.85C359.74 40.76 309.34 32 256 32s-103.74 8.76-141.91 24.66c-41.78 17.41-65.15 42.11-66 69.69L48 144c0 6.41 5.2 16.48 14.63 24.73c11.13 9.73 27.65 19.33 47.78 27.73C153.24 214.36 207.67 225 256 225s102.76-10.68 145.59-28.58c20.13-8.4 36.65-18 47.78-27.73C458.8 160.49 464 150.42 464 144Z",
              "M413.92 226c-46.53 19.43-105.57 31-157.92 31s-111.39-11.57-157.93-31c-17.07-7.15-31.69-18.79-43.64-28a4 4 0 0 0-6.43 3.22V232c0 6.41 5.2 14.48 14.63 22.73c11.13 9.74 27.65 19.33 47.78 27.74C153.24 300.34 207.67 311 256 311s102.76-10.68 145.59-28.57c20.13-8.41 36.65-18 47.78-27.74C458.8 246.47 464 238.41 464 232v-30.78a4 4 0 0 0-6.43-3.18c-11.95 9.17-26.57 20.81-43.65 27.96Z",
              "M413.92 312c-46.54 19.41-105.57 31-157.92 31s-111.39-11.59-157.93-31c-17.07-7.17-31.69-18.81-43.64-28a4 4 0 0 0-6.43 3.2V317c0 6.41 5.2 14.47 14.62 22.71c11.13 9.74 27.66 19.33 47.79 27.74C153.24 385.32 207.66 396 256 396s102.76-10.68 145.59-28.57c20.13-8.41 36.65-18 47.78-27.74C458.8 331.44 464 323.37 464 317v-29.8a4 4 0 0 0-6.43-3.18c-11.95 9.17-26.57 20.81-43.65 27.98Z",
            ]}
            headline="Server-side reliability"
          >
            Directly embedded within HTML markup without side effects, hooks
            make server-side rendering simple and reliable. It just works.
          </Feature>
        </div>
      </Section>
      <Section title="Frameworks">
        <div
          style={pipe(
            {
              marginTop: "1.5rem",
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "2rem",
            },
            on("@media (width >= 44em)", {
              gridTemplateColumns: "repeat(2, 1fr)",
            }),
            on("@media (width >= 69em)", {
              gridTemplateColumns: "repeat(4, 1fr)",
            }),
          )}
        >
          <DesignedFor
            framework="React"
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
            framework="Preact"
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
          <DesignedFor
            framework="Solid"
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
                    <stop offset="0.1" stopColor="#76b3e1" />
                    <stop offset="0.3" stopColor="#dcf2fd" />
                    <stop offset="1" stopColor="#76b3e1" />
                  </linearGradient>
                  <linearGradient
                    id="b"
                    x1="95.8"
                    x2="74"
                    y1="32.6"
                    y2="105.2"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#76b3e1" />
                    <stop offset="0.5" stopColor="#4377bb" />
                    <stop offset="1" stopColor="#1f3b77" />
                  </linearGradient>
                  <linearGradient
                    id="c"
                    x1="18.4"
                    x2="144.3"
                    y1="64.2"
                    y2="149.8"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#315aa9" />
                    <stop offset="0.5" stopColor="#518ac8" />
                    <stop offset="1" stopColor="#315aa9" />
                  </linearGradient>
                  <linearGradient
                    id="d"
                    x1="75.2"
                    x2="24.4"
                    y1="74.5"
                    y2="260.8"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#4377bb" />
                    <stop offset="0.5" stopColor="#1a336b" />
                    <stop offset="1" stopColor="#1a336b" />
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
            framework="Qwik"
            logo={
              <svg
                width="500"
                height="506"
                viewBox="0 0 500 506"
                fill="none"
                style={{ height: 160, maxWidth: "100%" }}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M250 449.707L431.102 505.511L343.037 423.652L129.174 224.859L179.178 174.86L156.157 16.117L8.34822 193.702C-2.78296 212.982 -2.78273 236.736 8.34883 256.016L102.191 418.551C113.323 437.831 133.894 449.707 156.156 449.707L250 449.707Z"
                  fill="#18B6F6"
                />
                <path
                  d="M343.843 0L156.157 1.74069e-05C133.894 1.94717e-05 113.323 11.8771 102.192 31.1573L8.34822 193.702L156.157 16.117L370.826 224.859L330.828 264.86L343.037 423.652L431.102 505.511C436.18 507.075 440.635 501.755 438.204 497.031L397.809 418.551L491.651 256.016C502.783 236.736 502.783 212.982 491.652 193.702L397.808 31.1572C386.677 11.8771 366.106 -2.06475e-06 343.843 0Z"
                  fill="#AC7EF4"
                />
                <path
                  d="M370.826 224.859L156.157 16.117L179.178 174.86L129.174 224.859L343.037 423.652L330.828 264.86L370.826 224.859Z"
                  fill="white"
                />
              </svg>
            }
          />
        </div>
      </Section>
      <Section title="Opinions">
        <div
          style={pipe(
            {
              display: "grid",
              gap: "2rem",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(24rem, 100%), 1fr))",
              padding: "2rem",
              background: V.gray05,
            },
            on(dark, {
              background: V.gray95,
            }),
          )}
        >
          <Testimonial
            href="https://twitter.com/markdalgleish/status/1729399475494608923"
            author={
              <TestimonialAuthor
                name="Mark Dalgleish"
                handle="markdalgleish"
                avatar="https://github.com/markdalgleish.png"
              />
            }
          >
            <p style={{ margin: 0 }}>
              Check out CSS Hooks. This is *very* cool.
            </p>
            <p style={{ margin: 0 }}>
              It lets you write type-safe inline styles (literally the{" "}
              {"`style`"}
              attribute *BUT* with support for a custom set of pseudo-classes,
              selectors, media/container queries — and nested too!
            </p>
          </Testimonial>
          <Testimonial
            href="https://twitter.com/ryanflorence/status/1729501647313748410"
            author={
              <TestimonialAuthor
                name="Ryan Florence"
                handle="ryanflorence"
                avatar="https://github.com/ryanflorence.png"
              />
            }
          >
            <p style={{ margin: 0 }}>
              That&apos;s how I always wished the style prop worked!
            </p>
          </Testimonial>
          <Testimonial
            href="https://twitter.com/mryechkin/status/1730695960781545538"
            author={
              <TestimonialAuthor
                name="Mykhaylo"
                handle="mryechkin"
                avatar="https://github.com/mryechkin.png"
              />
            }
          >
            <p style={{ margin: 0 }}>
              I absolutely love it. There&apos;s just something
              &quot;fresh&quot; about it. Simple to get started, practically no
              overhead, and it just makes sense. Best part is that it does this
              all using native CSS features, nothing fancy - just really
              cleverly done.
            </p>
          </Testimonial>
          <Testimonial
            href="https://twitter.com/nicolas_dev_/status/1730744552372273644"
            author={
              <TestimonialAuthor
                name="Nicolas"
                handle="nicolas_dev_"
                avatar="https://pbs.twimg.com/profile_images/1524863101992157184/HtBSEHbV_400x400.jpg"
              />
            }
          >
            <p style={{ margin: 0 }}>
              Looks exactly like what I always wanted the style property to be
            </p>
            <p style={{ margin: 0 }}>Will be trying it out for sure!</p>
          </Testimonial>
          <Testimonial
            href="https://twitter.com/Julien_Delort/status/1730949885891842315"
            author={
              <TestimonialAuthor
                name="Julien Delort"
                handle="Julien_Delort"
                avatar="https://github.com/JulienDelort.png"
              />
            }
          >
            <p style={{ margin: 0 }}>
              I was _hooked_ at &quot;no build step&quot;!
            </p>
          </Testimonial>
          <Testimonial
            href="https://twitter.com/b_e_n_t_e_n_/status/1733210680030072993"
            author={
              <TestimonialAuthor
                name="Benton Boychuk-Chorney"
                handle="b_e_n_t_e_n_"
                avatar="https://github.com/b3nten.png"
              />
            }
          >
            <p style={{ margin: 0 }}>
              I&apos;m curious if there is a &quot;catch&quot; to css hooks,
              because from first glance it seems too good to be true!
            </p>
          </Testimonial>
        </div>
      </Section>
      <div style={{ height: "4rem" }} />
    </>
  );
}

function CtaButton({
  children: label,
  to,
  icon,
  theme = "secondary",
}: {
  children: ReactNode;
  to: string;
  icon?: ReactNode;
  theme?: "primary" | "secondary";
}) {
  return (
    <Link
      to={to}
      className={theme === "primary" ? "primary" : ""}
      style={pipe(
        {
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          backgroundColor: V.gray50,
          color: V.white,
          textDecoration: "none",
          padding: "0.5em 0.75em",
          fontSize: "1.5rem",
          letterSpacing: "-0.03em",
          fontWeight: 700,
          lineHeight: 1,
          outlineStyle: "solid",
          outlineColor: V.blue20,
          outlineWidth: 0,
          outlineOffset: 2,
        },
        on(dark, {
          backgroundColor: V.gray60,
          outlineColor: V.blue50,
        }),
        on("&.primary", {
          backgroundColor: V.purple50,
        }),
        on(and("&.primary", dark), {
          backgroundColor: V.purple60,
        }),
        on(intent, {
          backgroundColor: V.blue40,
        }),
        on(and(dark, intent), {
          backgroundColor: V.blue50,
        }),
        on("&:active", {
          backgroundColor: V.red40,
        }),
        on(and(dark, "&:active"), {
          backgroundColor: V.red50,
        }),
        on("&:focus-visible", {
          outlineWidth: 2,
        }),
      )}
    >
      {icon ? (
        <div
          style={pipe(
            {
              width: "1em",
              height: "1em",
              display: "grid",
              placeItems: "center",
            },
            on(not("&:empty"), {
              paddingRight: "0.5em",
            }),
            on("&:empty", {
              width: 0,
            }),
          )}
        >
          {icon}
        </div>
      ) : (
        <></>
      )}
      <div>{label}</div>
    </Link>
  );
}

function Section({
  children,
  title,
}: {
  children?: ReactNode;
  title?: ReactNode;
}) {
  return (
    <section
      className="section"
      style={pipe(
        {
          fontSize: "2rem",
          marginTop: "4rem",
        },
        on(".section &", {
          fontSize: "1.5rem",
          marginTop: "2rem",
        }),
      )}
    >
      <Block>
        <h1
          style={{
            fontSize: "inherit",
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: "-0.03em",
            margin: 0,
            color: V.gray50,
          }}
        >
          {title}
        </h1>
        <div style={{ marginTop: "1.5rem", fontSize: "1rem" }}>{children}</div>
      </Block>
    </section>
  );
}

function CodeWindow({ children }: { children: ReactNode }) {
  return (
    <div
      style={pipe(
        {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          color: V.gray20,
        },
        on(dark, {
          color: V.gray70,
        }),
      )}
    >
      <div
        style={pipe(
          {
            background: V.gray05,
            display: "flex",
            padding: 8,
            gap: 4,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "currentColor",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderBottomWidth: 0,
          },
          on(dark, {
            background: V.gray85,
          }),
        )}
      >
        {[V.red30, V.yellow30, V.green30].map(color => (
          <div
            key={color}
            style={pipe(
              {
                fontSize: 12,
                width: "1em",
                height: "1em",
                borderRadius: 999,
                background: color,
              },
              on(dark, {
                background: "currentColor",
              }),
            )}
          />
        ))}
      </div>
      <div
        style={pipe(
          {
            background: V.white,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "currentColor",
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            padding: "1rem",
            overflow: "auto",
          },
          on(dark, {
            background: V.gray85,
          }),
        )}
      >
        {children}
      </div>
    </div>
  );
}

function Demo({
  source,
  preview,
  title,
}: {
  source: string;
  preview: ReactNode;
  title: ReactNode;
}) {
  return (
    <Section title={<span style={{ color: V.pink30 }}>{title}</span>}>
      <div
        style={pipe(
          {
            marginTop: "-1.5rem",
            display: "flex",
            alignItems: "stretch",
            flexDirection: "column-reverse",
          },
          on("@media (width >= 44em)", {
            flexDirection: "row",
          }),
        )}
      >
        <div
          style={pipe(
            {
              padding: "1.5rem 0",
              flex: 1,
              zIndex: 1,
            },
            on("@media (width >= 44em)", {
              marginRight: -24,
            }),
            on("@media (width < 44em)", {
              marginTop: -24,
              padding: "0 12px",
            }),
          )}
        >
          <CodeWindow>
            <Preformatted>
              <SyntaxHighlighter language="tsx">{source}</SyntaxHighlighter>
            </Preformatted>
          </CodeWindow>
        </div>
        <div
          style={pipe(
            {
              minHeight: 256,
              flex: 1,
              display: "grid",
              placeItems: "center",
              backgroundColor: V.white,
              backgroundImage: `linear-gradient(45deg, ${V.gray05} 25%, transparent 25%), linear-gradient(-45deg, ${V.gray05} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${V.gray05} 75%), linear-gradient(-45deg, transparent 75%, ${V.gray05} 75%)`,
              backgroundSize: "24px 24px",
              backgroundPosition: "0 0, 0 12px, 12px -12px, -12px 0px",
            },
            on(dark, {
              backgroundColor: V.gray90,
              backgroundImage: `linear-gradient(45deg, ${V.gray85} 25%, transparent 25%), linear-gradient(-45deg, ${V.gray85} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${V.gray85} 75%), linear-gradient(-45deg, transparent 75%, ${V.gray85} 75%)`,
            }),
          )}
        >
          {preview}
        </div>
      </div>
    </Section>
  );
}

function PseudoClassesDemo() {
  const source = `
<button
  style={pipe(
    {
      background: "${V.blue50}",
      color: "${V.white}",
    },
    on("&:hover", {
      background: "${V.blue40}",
    }),
    on("&:active", {
      background: "${V.red40}",
    })
  })}
>
  Save changes
</button>
`.trim();
  return (
    <Demo
      source={source}
      title="Pseudo-classes"
      preview={
        <>
          <button
            style={pipe(
              {
                margin: 0,
                padding: "0.75em 1em",
                borderRadius: "0.5em",
                border: 0,
                fontFamily: "sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                lineHeight: 1,
                background: V.blue50,
                color: V.white,
              },
              on("&:hover", {
                background: V.blue40,
              }),
              on("&:active", {
                background: V.red40,
              }),
            )}
          >
            Save changes
          </button>
        </>
      }
    />
  );
}

function SelectorDemo() {
  const source = `
<label>
  <input type="checkbox" checked />
  <span
    style={pipe(
      {},
      on(":checked + &", {
        textDecoration: "line-through"
      })
    )}
  >
    Simplify CSS architecture
  </span>
</label>
`.trim();
  return (
    <Demo
      source={source}
      title="Selectors"
      preview={
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25em",
            fontFamily: "sans-serif",
            fontWeight: 700,
          }}
        >
          <input type="checkbox" defaultChecked />
          <span
            style={pipe(
              {},
              on(":checked + &", {
                textDecoration: "line-through",
              }),
            )}
          >
            Simplify CSS architecture
          </span>
        </label>
      }
    />
  );
}

function ResponsiveDemo() {
  const source = `
<span
  style={pipe(
    {},
    on(or("@container (width < 50px)", "@container (width >= 100px)"), {
      display: "none"
    })
  )}
>
  sm
</span>
<span
  style={pipe(
    {},
    on("@container (width < 100px)", {
      display: "none"
    })
  )}
>
  lg
</span>
`.trim();

  const initialWidth = 150;

  return (
    <Demo
      source={source}
      title="Responsive design"
      preview={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={pipe(
              {
                background: V.white,
                color: V.black,
                fontFamily: "sans-serif",
                fontWeight: 700,
                fontSize: "3rem",
                height: initialWidth,
                width: initialWidth,
                display: "grid",
                placeItems: "center",
                containerType: "inline-size",
              },
              on(dark, {
                background: V.black,
                color: V.white,
              }),
              on(not(dark), {
                boxShadow: `inset 0 0 0 1px ${V.gray20}`,
              }),
            )}
          >
            <span
              style={pipe(
                {
                  fontSize: "0.5em",
                },
                on(
                  or(
                    "@container (width < 50px)",
                    "@container (width >= 100px)",
                  ),
                  {
                    display: "none",
                  },
                ),
              )}
            >
              sm
            </span>
            <span
              style={pipe(
                {},
                on("@container (width < 100px)", {
                  display: "none",
                }),
              )}
            >
              lg
            </span>
          </div>
          <label>
            <ScreenReaderOnly>Container width</ScreenReaderOnly>
            <input
              type="range"
              style={{ width: initialWidth }}
              max={initialWidth}
              defaultValue={initialWidth}
            />
          </label>
          <script>{`
            (function() {
              const label = document.currentScript.previousElementSibling;
              const input = label.querySelector("input");
              const container = label.previousElementSibling;
              input.addEventListener("input", () => container.style.width = input.value + "px");
            })()
          `}</script>
        </div>
      }
    />
  );
}

function DesignedFor({
  framework,
  logo,
}: {
  framework: string;
  logo: ReactNode;
}) {
  return (
    <div
      style={pipe(
        {
          background: V.gray05,
          color: V.gray80,
          padding: 32,
          display: "flex",
          flexDirection: "column",
          gap: 48,
          alignItems: "center",
        },
        on(dark, {
          background: V.gray85,
          color: V.gray10,
        }),
      )}
    >
      <h1
        style={{
          margin: 0,
          fontWeight: 400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span
          style={pipe(
            {
              fontSize: "0.625rem",
              lineHeight: 1,
              textTransform: "uppercase",
              letterSpacing: "0.01em",
              color: V.gray70,
            },
            on(dark, {
              color: V.gray40,
            }),
          )}
        >
          Designed for
        </span>
        <span
          style={{
            display: "inline-block",
            fontSize: "2rem",
            marginTop: "0.25em",
          }}
        >
          {framework}
        </span>
      </h1>
      <div style={{ order: 99 }}>
        <CtaButton to={`/docs/quickstart/${framework.toLowerCase()}`}>
          Get started
        </CtaButton>
      </div>
      <div
        style={pipe(
          {
            opacity: 0.75,
            filter: "grayscale(0.75)",
          },
          on(intentAdjacentSibling, {
            opacity: 1,
            filter: "grayscale(0)",
          }),
        )}
      >
        {logo}
      </div>
    </div>
  );
}

function TestimonialAuthor({
  name,
  handle,
  avatar,
}: {
  name: string;
  handle: string;
  avatar: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateAreas: "'avatar name' 'avatar handle'",
        gridTemplateColumns: "auto 1fr",
        gap: "0 1rem",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gridArea: "avatar" }}
      >
        <img
          src={avatar}
          alt={name}
          width={48}
          height={48}
          style={{ gridArea: "photo", borderRadius: 999 }}
        />
      </div>
      <div style={{ gridArea: "name" }}>{name}</div>
      <div style={{ gridArea: "handle", color: V.gray50 }}>{`@${handle}`}</div>
    </div>
  );
}

function Testimonial({
  author,
  children,
  href,
}: {
  author: ReactNode;
  children: ReactNode;
  href: string;
}) {
  return (
    <blockquote style={{ display: "contents" }} cite={href}>
      <a
        href={href}
        style={pipe(
          {
            textDecoration: "none",
            color: "inherit",
            background: V.white,
            flexDirection: "column",
            gap: "1rem",
            padding: "2rem",
            outlineWidth: 0,
            outlineOffset: 2,
            outlineColor: V.blue20,
            outlineStyle: "solid",
          },
          on("&:focus-visible", {
            outlineWidth: 2,
          }),
          on("&:active", {
            boxShadow: `0 0 0 1px ${V.red20}`,
          }),
          on(dark, {
            boxShadow: `inset 0 0 0 1px ${V.gray70}`,
            background: V.gray90,
            outlineColor: V.blue50,
          }),
          on(and(dark, "&:active"), {
            background: V.gray85,
          }),
        )}
      >
        <div>{author}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginTop: "1.5rem",
          }}
        >
          {children}
        </div>
      </a>
    </blockquote>
  );
}

function Feature({
  children,
  color,
  headline,
  iconPath,
}: {
  children: ReactNode;
  color: "blue" | "pink" | "yellow" | "green" | "teal" | "purple";
  headline: ReactNode;
  iconPath: string | string[];
}) {
  return (
    <section
      className={color}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <div
        style={pipe(
          {
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          },
          on(".blue &", {
            color: V.blue50,
          }),
          on(".pink &", {
            color: V.pink50,
          }),
          on(".yellow &", {
            color: V.yellow50,
          }),
          on(".green &", {
            color: V.green50,
          }),
          on(".teal &", {
            color: V.teal50,
          }),
          on(".purple &", {
            color: V.purple50,
          }),
          on(and(dark, ".blue &"), {
            color: V.blue20,
          }),
          on(and(dark, ".pink &"), {
            color: V.pink20,
          }),
          on(and(dark, ".yellow &"), {
            color: V.yellow20,
          }),
          on(and(dark, ".green &"), {
            color: V.green20,
          }),
          on(and(dark, ".teal &"), {
            color: V.teal20,
          }),
          on(and(dark, ".purple &"), {
            color: V.purple20,
          }),
        )}
      >
        <div
          style={pipe(
            {
              width: "3rem",
              minWidth: "3rem",
              height: "3rem",
              minHeight: "3rem",
              borderRadius: 9999,
              display: "grid",
              placeItems: "center",
            },
            on(".blue &", {
              background: V.blue10,
              boxShadow: `0 0 0 1px ${V.blue30}`,
            }),
            on(".pink &", {
              background: V.pink10,
              boxShadow: `0 0 0 1px ${V.pink30}`,
            }),
            on(".yellow &", {
              background: V.yellow10,
              boxShadow: `0 0 0 1px ${V.yellow30}`,
            }),
            on(".green &", {
              background: V.green10,
              boxShadow: `0 0 0 1px ${V.green30}`,
            }),
            on(".teal &", {
              background: V.teal10,
              boxShadow: `0 0 0 1px ${V.teal30}`,
            }),
            on(".purple &", {
              background: V.purple10,
              boxShadow: `0 0 0 1px ${V.purple30}`,
            }),
            on(and(dark, ".blue &"), {
              background: V.blue50,
              boxShadow: `0 0 32px 0 ${V.blue60}`,
            }),
            on(and(dark, ".pink &"), {
              background: V.pink50,
              boxShadow: `0 0 32px 0 ${V.pink60}`,
            }),
            on(and(dark, ".yellow &"), {
              background: V.yellow50,
              boxShadow: `0 0 32px 0 ${V.yellow70}`,
            }),
            on(and(dark, ".green &"), {
              background: V.green50,
              boxShadow: `0 0 32px 0 ${V.green70}`,
            }),
            on(and(dark, ".teal &"), {
              background: V.teal50,
              boxShadow: `0 0 32px 0 ${V.teal70}`,
            }),
            on(and(dark, ".purple &"), {
              background: V.purple50,
              boxShadow: `0 0 32px 0 ${V.purple60}`,
            }),
          )}
        >
          <svg width="1.5rem" height="1.5rem" viewBox="0 0 512 512">
            {(typeof iconPath === "string" ? [iconPath] : iconPath).map(p => (
              <path key={p} fill="currentColor" d={p} />
            ))}
          </svg>
        </div>
        <span style={{ fontWeight: 700 }}>{headline}</span>
      </div>
      <p style={{ margin: 0, lineHeight: 1.5 }}>{children}</p>
    </section>
  );
}
