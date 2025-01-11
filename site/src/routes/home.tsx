import type { ReactElement, ReactNode } from "react";
import { useState } from "react";
import { prerenderToNodeStream } from "react-dom/static";
import { Link } from "react-router";
import { pipe } from "remeda";

import { Block } from "../components/block.tsx";
import { DemoIcon, GitHubIcon, MenuBookIcon } from "../components/icons.tsx";
import { Preformatted } from "../components/preformatted.tsx";
import { ScreenReaderOnly } from "../components/screen-reader-only.tsx";
import { SyntaxHighlighter } from "../components/syntax-highlighter.tsx";
import {
  and,
  dark,
  intent,
  intentAdjacentSibling,
  not,
  on,
  or,
} from "../css.ts";
import {
  black,
  blue,
  gray,
  green,
  pink,
  purple,
  red,
  teal,
  white,
  yellow,
} from "../design/colors.ts";
import type { Route } from "./+types/home.ts";

export async function loader() {
  const [pseudoClasses, selectors, responsive] = await Promise.all(
    [
      <PseudoClassesDemoSource />,
      <SelectorsDemoSource />,
      <ResponsiveDemoSource />,
    ].map(async jsx => {
      const { prelude: stream } = await prerenderToNodeStream(jsx);
      return await new Promise<string>((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on("data", chunk => chunks.push(Buffer.from(chunk)));
        stream.on("error", err => reject(err));
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      });
    }),
  );
  if (!pseudoClasses || !selectors || !responsive) {
    throw new Response("A demo source was unexpectedly empty.", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
  return { demoSource: { pseudoClasses, selectors, responsive } };
}

export default function Home({
  loaderData: { demoSource },
}: Route.ComponentProps) {
  return (
    <>
      <section
        style={pipe(
          {
            color: white,
            padding: "4rem 0",
            textAlign: "center",
            lineHeight: 1.25,
            background: gray(11),
          },
          on(dark, {
            background: gray(85),
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
                color: gray(45),
              },
              on(dark, {
                color: gray(55),
              }),
              on("@media (width >= 44em)", {
                fontSize: "3.75rem",
              }),
            )}
          >
            Do the{" "}
            <em
              style={pipe(
                {
                  color: pink(45),
                  fontStyle: "normal",
                },
                on(dark, {
                  color: pink(30),
                }),
              )}
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
                color: gray(70),
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
                color: white,
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
                to="https://stackblitz.com/github/css-hooks/css-hooks/tree/master/example?file=src/app.tsx"
                icon={<DemoIcon />}
              >
                Demo
              </CtaButton>
            </div>
          </div>
        </Block>
      </section>
      <Demo
        title="Pseudo-classes"
        source={demoSource.pseudoClasses}
        preview={<PseudoClassesDemoPreview />}
      />
      <Demo
        title="Selectors"
        source={demoSource.selectors}
        preview={<SelectorsDemoPreview />}
      />
      <Demo
        title="Responsive design"
        source={demoSource.responsive}
        preview={<ResponsiveDemoPreview />}
      />
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
            icon={
              <FeatureIconSvg>
                <path
                  d="M7.5 5.6L10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29c-.39-.39-1.02-.39-1.41 0L1.29 18.96c-.39.39-.39 1.02 0 1.41l2.34 2.34c.39.39 1.02.39 1.41 0L16.7 11.05c.39-.39.39-1.02 0-1.41l-2.33-2.35zm-1.03 5.49l-2.12-2.12 2.44-2.44 2.12 2.12-2.44 2.44z"
                  fill="currentColor"
                />
              </FeatureIconSvg>
            }
            headline="Inline styles made practical"
          >
            Hooks take the simplest styling approach to the next level, removing
            limitations to make it a viable solution for real-world use cases.
          </Feature>
          <Feature
            color="yellow"
            icon={
              <FeatureIconSvg>
                <path
                  d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z"
                  fill="currentColor"
                />
              </FeatureIconSvg>
            }
            headline="Intuitive state-driven styling"
          >
            Effortlessly define styles for states like hover, focus, and active.
            Create engaging UIs without the complexity of external CSS.
          </Feature>
          <Feature
            color="teal"
            icon={
              <FeatureIconSvg>
                <path
                  d="M21,5c-1.11-0.35-2.33-0.5-3.5-0.5c-1.95,0-4.05,0.4-5.5,1.5c-1.45-1.1-3.55-1.5-5.5-1.5S2.45,4.9,1,6v14.65 c0,0.25,0.25,0.5,0.5,0.5c0.1,0,0.15-0.05,0.25-0.05C3.1,20.45,5.05,20,6.5,20c1.95,0,4.05,0.4,5.5,1.5c1.35-0.85,3.8-1.5,5.5-1.5 c1.65,0,3.35,0.3,4.75,1.05c0.1,0.05,0.15,0.05,0.25,0.05c0.25,0,0.5-0.25,0.5-0.5V6C22.4,5.55,21.75,5.25,21,5z M21,18.5 c-1.1-0.35-2.3-0.5-3.5-0.5c-1.7,0-4.15,0.65-5.5,1.5V8c1.35-0.85,3.8-1.5,5.5-1.5c1.2,0,2.4,0.15,3.5,0.5V18.5z"
                  fill="currentColor"
                />
                <g>
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
                </g>
              </FeatureIconSvg>
            }
            headline="Reusable knowledge"
          >
            Hooks enhance the way you already write inline styles, rather than
            forcing you to learn non-standard utility class syntax.
          </Feature>
          <Feature
            color="green"
            icon={
              <FeatureIconSvg>
                <path
                  d="M20.38 8.57l-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 15.58 6.85l1.85-1.23A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1 10 10 0 0 0-.27-10.44zm-9.79 6.84a2 2 0 0 0 2.83 0l5.66-8.49-8.49 5.66a2 2 0 0 0 0 2.83z"
                  fill="currentColor"
                />
              </FeatureIconSvg>
            }
            headline="Predictable performance"
          >
            Hooks are pure, don&apos;t depend on style injection, and avoid
            shipping large volumes of irrelevant, render-blocking CSS.
          </Feature>
          <Feature
            color="blue"
            icon={
              <FeatureIconSvg>
                <rect
                  height="8.48"
                  transform="matrix(0.7071 -0.7071 0.7071 0.7071 -6.8717 17.6255)"
                  width="3"
                  x="16.34"
                  y="12.87"
                  fill="currentColor"
                />
                <path
                  d="M17.5,10c1.93,0,3.5-1.57,3.5-3.5c0-0.58-0.16-1.12-0.41-1.6l-2.7,2.7L16.4,6.11l2.7-2.7C18.62,3.16,18.08,3,17.5,3 C15.57,3,14,4.57,14,6.5c0,0.41,0.08,0.8,0.21,1.16l-1.85,1.85l-1.78-1.78l0.71-0.71L9.88,5.61L12,3.49 c-1.17-1.17-3.07-1.17-4.24,0L4.22,7.03l1.41,1.41H2.81L2.1,9.15l3.54,3.54l0.71-0.71V9.15l1.41,1.41l0.71-0.71l1.78,1.78 l-7.41,7.41l2.12,2.12L16.34,9.79C16.7,9.92,17.09,10,17.5,10z"
                  fill="currentColor"
                />
              </FeatureIconSvg>
            }
            headline="Extreme maintainability"
          >
            Inline styles tightly integrate with markup, promoting local
            reasoning and allowing you to change components quickly and easily.
          </Feature>
          <Feature
            color="pink"
            icon={
              <FeatureIconSvg>
                <path
                  d="M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
                  fill="currentColor"
                />
              </FeatureIconSvg>
            }
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
              background: gray(10),
            },
            on(dark, {
              background: gray(95),
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
          gap: "0.75rem",
          backgroundColor: gray(50),
          color: white,
          textDecoration: "none",
          padding: "0.5em 0.75em",
          fontSize: "1.5rem",
          letterSpacing: "-0.03em",
          fontWeight: 700,
          lineHeight: 1,
          outlineStyle: "solid",
          outlineColor: blue(20),
          outlineWidth: 0,
          outlineOffset: 2,
        },
        on(dark, {
          backgroundColor: gray(60),
          outlineColor: blue(50),
        }),
        on("&.primary", {
          backgroundColor: purple(55),
        }),
        on(and("&.primary", dark), {
          backgroundColor: purple(65),
        }),
        on(intent, {
          backgroundColor: blue(45),
        }),
        on(and(dark, intent), {
          backgroundColor: blue(60),
        }),
        on("&:active", {
          backgroundColor: red(45),
        }),
        on(and(dark, "&:active"), {
          backgroundColor: red(50),
        }),
        on("&:focus-visible", {
          outlineWidth: 2,
        }),
      )}
    >
      {icon ? (
        <div
          style={{
            width: "1em",
            height: "1em",
            display: "grid",
            placeItems: "center",
          }}
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
            color: gray(50),
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
          color: gray(30),
        },
        on(dark, {
          color: gray(70),
        }),
      )}
    >
      <div
        style={pipe(
          {
            background: gray(12),
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
            background: gray(85),
          }),
        )}
      >
        {[red(30), yellow(30), green(30)].map(color => (
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
            background: white,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "currentColor",
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            padding: "1rem",
            overflow: "auto",
          },
          on(dark, {
            background: gray(85),
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
    <Section
      title={
        <span style={pipe({ color: pink(45) }, on(dark, { color: pink(30) }))}>
          {title}
        </span>
      }
    >
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
            <Preformatted dangerouslySetInnerHTML={{ __html: source }} />
          </CodeWindow>
        </div>
        <div
          style={pipe(
            {
              minHeight: 256,
              flex: 1,
              display: "grid",
              placeItems: "center",
              backgroundColor: white,
              backgroundImage: `linear-gradient(45deg, ${gray(15)} 25%, transparent 25%), linear-gradient(-45deg, ${gray(15)} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${gray(15)} 75%), linear-gradient(-45deg, transparent 75%, ${gray(15)} 75%)`,
              backgroundSize: "24px 24px",
              backgroundPosition: "0 0, 0 12px, 12px -12px, -12px 0px",
            },
            on(dark, {
              backgroundColor: gray(90),
              backgroundImage: `linear-gradient(45deg, ${gray(85)} 25%, transparent 25%), linear-gradient(-45deg, ${gray(85)} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${gray(85)} 75%), linear-gradient(-45deg, transparent 75%, ${gray(85)} 75%)`,
            }),
          )}
        >
          {preview}
        </div>
      </div>
    </Section>
  );
}

function PseudoClassesDemoSource() {
  return (
    <SyntaxHighlighter language="tsx">{`<button
  style={pipe(
    {
      background: "${blue(60)}",
      color: "${white}",
    },
    on("&:hover", {
      background: "${blue(50)}",
    }),
    on("&:active", {
      background: "${red(50)}",
    })
  })}
>
  Save changes
</button>`}</SyntaxHighlighter>
  );
}

function PseudoClassesDemoPreview() {
  return (
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
          background: blue(60),
          color: white,
        },
        on("&:hover", {
          background: blue(50),
        }),
        on("&:active", {
          background: red(50),
        }),
      )}
    >
      Save changes
    </button>
  );
}

function SelectorsDemoSource() {
  return (
    <SyntaxHighlighter language="tsx">{`<label>
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
</label>`}</SyntaxHighlighter>
  );
}

function SelectorsDemoPreview() {
  return (
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
  );
}

function ResponsiveDemoSource() {
  return (
    <SyntaxHighlighter language="tsx">{`<span
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
</span>`}</SyntaxHighlighter>
  );
}

function ResponsiveDemoPreview() {
  const scale = 150;

  const [width, setWidth] = useState(scale);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={pipe(
          {
            background: white,
            color: black,
            fontFamily: "sans-serif",
            fontWeight: 700,
            fontSize: "3rem",
            height: scale,
            width,
            display: "grid",
            placeItems: "center",
            containerType: "inline-size",
          },
          on(dark, {
            background: black,
            color: white,
          }),
          on(not(dark), {
            boxShadow: `inset 0 0 0 1px ${gray(20)}`,
          }),
        )}
      >
        <span
          style={pipe(
            {
              fontSize: "0.5em",
            },
            on(or("@container (width < 50px)", "@container (width >= 100px)"), {
              display: "none",
            }),
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
          style={{ width: scale }}
          max={scale}
          value={width}
          onInput={e => {
            setWidth(parseInt(e.currentTarget.value));
          }}
        />
      </label>
    </div>
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
          background: gray(10),
          color: gray(80),
          padding: 32,
          display: "flex",
          flexDirection: "column",
          gap: 48,
          alignItems: "center",
        },
        on(dark, {
          background: gray(85),
          color: gray(10),
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
              color: gray(70),
            },
            on(dark, {
              color: gray(40),
            }),
          )}
        >
          Designed for
        </span>
        <span
          style={pipe(
            {
              display: "inline-block",
              fontSize: "2rem",
              marginTop: "0.25em",
            },
            on(not(dark), {
              color: gray(50),
            }),
          )}
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
      <div
        style={pipe(
          { gridArea: "handle", color: gray(50) },
          on(dark, { color: gray(45) }),
        )}
      >{`@${handle}`}</div>
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
            background: white,
            flexDirection: "column",
            gap: "1rem",
            padding: "2rem",
            outlineWidth: 0,
            outlineOffset: 2,
            outlineColor: blue(20),
            outlineStyle: "solid",
          },
          on("&:focus-visible", {
            outlineWidth: 2,
          }),
          on("&:active", {
            boxShadow: `0 0 0 1px ${red(20)}`,
          }),
          on(dark, {
            boxShadow: `inset 0 0 0 1px ${gray(70)}`,
            background: gray(90),
            outlineColor: blue(50),
          }),
          on(and(dark, "&:active"), {
            background: gray(85),
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

function FeatureIconSvg({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  const size = "1.5rem";
  return (
    <svg
      viewBox="0 0 24 24"
      style={{
        minWidth: size,
        maxWidth: size,
        minHeight: size,
        maxHeight: size,
      }}
    >
      {children}
    </svg>
  );
}

function Feature({
  children,
  color,
  headline,
  icon,
}: {
  children: ReactNode;
  color: "blue" | "pink" | "yellow" | "green" | "teal" | "purple";
  headline: ReactNode;
  icon: ReactElement;
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
            color: blue(55),
          }),
          on(".pink &", {
            color: pink(55),
          }),
          on(".yellow &", {
            color: yellow(55),
          }),
          on(".green &", {
            color: green(55),
          }),
          on(".teal &", {
            color: teal(55),
          }),
          on(".purple &", {
            color: purple(55),
          }),
          on(and(dark, ".blue &"), {
            color: blue(20),
          }),
          on(and(dark, ".pink &"), {
            color: pink(20),
          }),
          on(and(dark, ".yellow &"), {
            color: yellow(20),
          }),
          on(and(dark, ".green &"), {
            color: green(20),
          }),
          on(and(dark, ".teal &"), {
            color: teal(20),
          }),
          on(and(dark, ".purple &"), {
            color: purple(20),
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
              background: blue(15),
              boxShadow: `0 0 0 1px ${blue(30)}`,
            }),
            on(".pink &", {
              background: pink(15),
              boxShadow: `0 0 0 1px ${pink(30)}`,
            }),
            on(".yellow &", {
              background: yellow(15),
              boxShadow: `0 0 0 1px ${yellow(30)}`,
            }),
            on(".green &", {
              background: green(15),
              boxShadow: `0 0 0 1px ${green(30)}`,
            }),
            on(".teal &", {
              background: teal(15),
              boxShadow: `0 0 0 1px ${teal(30)}`,
            }),
            on(".purple &", {
              background: purple(15),
              boxShadow: `0 0 0 1px ${purple(30)}`,
            }),
            on(and(dark, ".blue &"), {
              background: blue(50),
              boxShadow: `0 0 32px 0 ${blue(60)}`,
            }),
            on(and(dark, ".pink &"), {
              background: pink(50),
              boxShadow: `0 0 32px 0 ${pink(60)}`,
            }),
            on(and(dark, ".yellow &"), {
              background: yellow(50),
              boxShadow: `0 0 32px 0 ${yellow(70)}`,
            }),
            on(and(dark, ".green &"), {
              background: green(50),
              boxShadow: `0 0 32px 0 ${green(70)}`,
            }),
            on(and(dark, ".teal &"), {
              background: teal(50),
              boxShadow: `0 0 32px 0 ${teal(70)}`,
            }),
            on(and(dark, ".purple &"), {
              background: purple(50),
              boxShadow: `0 0 32px 0 ${purple(60)}`,
            }),
          )}
        >
          {icon}
        </div>
        <span style={{ fontWeight: 700 }}>{headline}</span>
      </div>
      <p style={{ margin: 0, lineHeight: 1.5 }}>{children}</p>
    </section>
  );
}
