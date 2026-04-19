import type { CSSProperties, ReactElement, ReactNode } from "react";
import { Fragment, useState } from "react";
import { prerenderToNodeStream } from "react-dom/static";
import { Link } from "react-router";
import { pipe } from "remeda";

import { version } from "../../package.json";
import { Block } from "../components/block.tsx";
import { Hr } from "../components/hr.tsx";
import { CheckIcon, ContentCopyIcon } from "../components/icons.tsx";
import { Preformatted } from "../components/preformatted.tsx";
import { ScreenReaderOnly } from "../components/screen-reader-only.tsx";
import { SyntaxHighlighter } from "../components/syntax-highlighter.tsx";
import {
  and,
  dark,
  extractClassName,
  intent,
  intentAdjacentSibling,
  light,
  merge,
  not,
  on,
  or,
  withAlpha,
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
} from "../design/colors.ts";
import { monospace } from "../design/typography.ts";
import type { Route } from "./+types/home.ts";

export async function loader() {
  const [pseudoClasses, selectors, responsive] = await Promise.all(
    [
      <PseudoClassesDemoSource key="pseudo-classes" />,
      <SelectorsDemoSource key="selectors" />,
      <ResponsiveDemoSource key="responsive" />,
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
        style={{
          position: "relative",
          overflowX: "clip",
          fontSize: "1rem",
          marginTop: "calc(-48px - 2em)",
          width: "100%",
        }}
      >
        {/* Zone A: content */}
        <div
          style={pipe(
            {
              position: "relative",
              overflow: "hidden",
              paddingTop: "8.75em",
              paddingBottom: "8em",
            },
            on(not(dark), {
              background: [
                "radial-gradient(80% 60% at 50% -10%, rgba(0, 0, 0, 0.04), transparent 60%)",
                "radial-gradient(60% 40% at 50% 80%, rgba(124, 58, 237, 0.12), rgba(124, 58, 237, 0.04) 40%, transparent 70%)",
                "linear-gradient(to bottom, #ffffff, #f7f7fb)",
              ].join(", "),
            }),
          )}
        >
          {/* Ambient glow clipped to Zone A */}
          <div
            role="presentation"
            style={pipe(
              {},
              on(dark, {
                position: "absolute",
                pointerEvents: "none",
                left: "50%",
                top: "40%",
                width: "130%",
                height: "100%",
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient( ellipse at bottom, rgba(100, 70, 255, 0.65) 0%, rgba(70, 40, 220, 0.45) 40%, rgba(40, 20, 140, 0.25) 65%, rgba(0, 0, 0, 0) 100%)",
                filter: "blur(40px)",
              }),
            )}
          />
          <Block>
            <div
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "0.5em",
              }}
            >
              <h1
                style={pipe(
                  {
                    margin: 0,
                    fontSize: "4em",
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.125,
                    color: gray(75),
                  },
                  on(not(dark), {
                    color: purple(76),
                    textShadow: "0 0 20px rgba(124, 58, 237, 0.08)",
                  }),
                  on(dark, {
                    color: "inherit",
                  }),
                )}
              >
                <strong
                  style={pipe(
                    { fontWeight: 600, color: purple(61) },
                    on(dark, {
                      color: "inherit",
                    }),
                  )}
                >
                  CSS power.
                </strong>
                <br />
                Inline style simplicity.
              </h1>
              <p
                style={pipe(
                  {
                    fontSize: "1.5em",
                    color: gray(60),
                    maxWidth: "48ch",
                  },
                  on(not(dark), {
                    color: purple(60),
                  }),
                  on(dark, {
                    color: gray(25),
                  }),
                )}
              >
                The styling system that gives native inline styles
                pseudo-classes, media queries, container queries, feature
                queries, and selector logic.
              </p>
              <div
                style={{
                  display: "inline-flex",
                  gap: 16,
                  marginTop: "1em",
                }}
              >
                <div style={{ display: "grid", minWidth: 240 }}>
                  <CtaButton to="/docs" theme="primary">
                    Documentation
                  </CtaButton>
                </div>
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
                  <div style={{ display: "grid", minWidth: 240 }}>
                    <CtaButton to="https://github.com/css-hooks/css-hooks">
                      Star
                    </CtaButton>
                  </div>
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
                  <div style={{ display: "grid", minWidth: 240 }}>
                    <CtaButton
                      to={`https://stackblitz.com/github/css-hooks/css-hooks/tree/v${version}/example?file=src/app.tsx`}
                    >
                      View Demo
                    </CtaButton>
                  </div>
                </div>
              </div>
            </div>
          </Block>
        </div>
        {/* Zone B: stripe anchor + below-stripe space */}{" "}
        <div
          style={{
            position: "relative",
            marginTop: "-4em",
            paddingBottom: "4em",
          }}
        >
          {(
            [
              {
                left: "50%",
                top: 0,
                width: "180%",
                height: "80px",
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(ellipse at center, ${withAlpha(purple(50), 0.15)} 0%, transparent 70%)`,
                filter: "blur(40px)",
              },
              {
                left: "50%",
                top: 0,
                width: "150%",
                height: "5em",
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(ellipse at center, ${withAlpha(purple(30), 0.55)} 0%, ${withAlpha(purple(45), 0.35)} 30%, ${withAlpha(purple(60), 0.15)} 55%, transparent 75%)`,
                filter: "blur(12px)",
              },
              {
                left: "50%",
                top: "1em",
                width: "70%",
                height: "5em",
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(ellipse at center, ${withAlpha(blue(40), 0.35)} 0%, ${withAlpha(blue(55), 0.15)} 35%, transparent 70%)`,
                filter: "blur(16px)",
              },
              {
                left: "50%",
                top: 0,
                width: "28%",
                height: "8em",
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(ellipse at center, ${white} 0%, ${withAlpha(purple(10), 0.95)} 10%, ${withAlpha(purple(20), 0.75)} 22%, ${withAlpha(purple(40), 0.45)} 40%, ${withAlpha(purple(60), 0.15)} 60%, transparent 75%)`,
                filter: "blur(14px)",
              },
              {
                left: "50%",
                top: 0,
                width: "55%",
                height: "3em",
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(ellipse at center, ${white} 0%, ${withAlpha(purple(20), 0.7)} 25%, transparent 65%)`,
                filter: "blur(8px)",
              },
              {
                left: "50%",
                top: 0,
                width: "120%",
                height: "6px",
                transform: "translate(-50%, -50%)",
                background: `linear-gradient(to right, transparent 0%, ${withAlpha(purple(30), 0.9)} 20%, ${white} 50%, ${withAlpha(purple(30), 0.9)} 80%, transparent 100%)`,
                filter: "blur(3px)",
              },
              {
                left: "50%",
                top: 0,
                width: "100%",
                height: "1px",
                transform: "translate(-50%, -50%)",
                background: `linear-gradient(to right, transparent 0%, ${withAlpha(white, 0.8)} 50%, transparent 100%)`,
                opacity: 0.8,
              },
            ] satisfies CSSProperties[]
          ).map((style, key) => (
            <div
              key={key}
              role="presentation"
              style={pipe(
                {},
                on(dark, style),
                merge({
                  position: "absolute",
                  pointerEvents: "none",
                }),
              )}
            />
          ))}
        </div>
      </section>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 48,
          marginBlock: 96,
        }}
      >
        <Demo
          icon={<PseudoClassesIcon />}
          title="Pseudo-classes"
          source={demoSource.pseudoClasses}
          preview={<PseudoClassesDemoPreview />}
        />
        <Demo
          icon={<SelectorsIcon />}
          title="Selectors"
          source={demoSource.selectors}
          preview={<SelectorsDemoPreview />}
        />
        <Demo
          icon={<ResponsiveIcon />}
          title="Responsive design"
          source={demoSource.responsive}
          preview={<ResponsiveDemoPreview />}
        />
        <section>
          <ScreenReaderOnly>
            <h1>Benefits</h1>
          </ScreenReaderOnly>
          <Block>
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {[
                {
                  label: "Expressive",
                  colorFn: purple,
                  headline: "Best of both worlds",
                  body: (
                    <>
                      Stop bouncing between files. Use pseudo-classes,
                      selectors, and responsive queries directly within the{" "}
                      <Code>style</Code> prop. You get the power of CSS where it
                      makes the most sense—on the target element itself—without
                      the <Code>className</Code> overhead.
                    </>
                  ),
                },
                {
                  label: "Colocated",
                  colorFn: blue,
                  headline: "Local reasoning",
                  body: (
                    <>
                      Keep styles and markup in the same context. When
                      components are self-contained, you stop hunting through
                      external stylesheets to find a layout bug. You can
                      refactor confidently, knowing your changes are scoped
                      exactly where they&apos;re written.
                    </>
                  ),
                },
                {
                  label: "Type-safe",
                  colorFn: teal,
                  headline: "Strictly typed styles",
                  body: (
                    <>
                      Catch errors in your editor, not the browser. Every
                      property and value is fully typed, eliminating magic
                      strings and non-standard shorthands. Because styles are
                      just plain objects, your existing refactoring tools and
                      type-checking work out of the box—no custom IDE plugins or
                      complex configurations required.
                    </>
                  ),
                },
                {
                  label: "Deterministic",
                  colorFn: pink,
                  headline: "No more cascade",
                  body: (
                    <>
                      Eliminate the complexities of specificity, source order,
                      and cascade layers. By defining styles directly on the
                      target element, you ensure that they render exactly as
                      intended. Since the styling logic lives in your component
                      rather than a complex global stylesheet, you can say
                      goodbye to hydration mismatches and flashes of unstyled
                      content.
                    </>
                  ),
                },
                {
                  label: "Efficient",
                  colorFn: green,
                  headline: "Static stability, dynamic delivery",
                  body: (
                    <>
                      This approach combines the modularity of runtime CSS-in-JS
                      with the performance of static CSS. A tiny stylesheet
                      added once at startup handles the plumbing, and CSS
                      variable fallbacks handle the rest—ensuring that your
                      styling payload stays proportional to your{" "}
                      <strong>active UI</strong> instead of your{" "}
                      <strong>entire application</strong>. All without the
                      overhead of client-side style injection.
                    </>
                  ),
                },
              ].map(({ label, colorFn, headline, body }) => {
                const itemStyle: CSSProperties = {
                  flexBasis: "calc((640px - 100%) * 999)",
                  flexGrow: 1,
                  maxWidth: "100%",
                };
                return (
                  <Fragment key={label}>
                    <Hr />
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 16,
                      }}
                    >
                      <div
                        style={{
                          ...itemStyle,
                          minWidth: "25%",
                          display: "flex",
                          flexDirection: "column",
                          gap: 12,
                        }}
                      >
                        <span
                          style={pipe(
                            {
                              display: "inline-block",
                              alignSelf: "flex-start",
                              fontSize: "0.75em",
                              lineHeight: 1,
                              fontWeight: 700,
                              letterSpacing: "0.0125em",
                              textTransform: "uppercase",
                              paddingBlock: 4,
                              paddingInline: 8,
                              borderRadius: 999,
                              background: withAlpha(colorFn(50), 0.12),
                              color: colorFn(60),
                              boxShadow: `0 0 0 1px ${withAlpha(colorFn(50), 0.25)}`,
                            },
                            on(dark, {
                              background: withAlpha(colorFn(40), 0.15),
                              color: colorFn(30),
                              boxShadow: `0 0 0 1px ${withAlpha(colorFn(40), 0.3)}`,
                            }),
                          )}
                        >
                          {label}
                        </span>
                        <h3
                          style={pipe(
                            {
                              margin: 0,
                              fontSize: 20,
                              fontWeight: 700,
                              letterSpacing: "-0.0125em",
                              lineHeight: 1.25,
                              color: gray(65),
                            },
                            on(dark, {
                              color: gray(10),
                            }),
                          )}
                        >
                          {headline}
                        </h3>
                      </div>
                      <p
                        style={pipe(
                          {
                            ...itemStyle,
                            minWidth: "55%",
                            margin: 0,
                            lineHeight: 1.75,
                            color: gray(60),
                          },
                          on(dark, { color: gray(35) }),
                        )}
                      >
                        {body}
                      </p>
                    </div>
                  </Fragment>
                );
              })}
              <Hr />
            </div>
          </Block>
        </section>
        <section>
          <ScreenReaderOnly>
            <h1>Packages</h1>
          </ScreenReaderOnly>
          <Block>
            <div
              style={pipe(
                {
                  display: "grid",
                  gap: 32,
                },
                on("@container (width >= 64ch)", {
                  gridTemplateColumns: "repeat(2, 1fr)",
                }),
                on("@container (width >= 112ch)", {
                  gridTemplateColumns: "repeat(4, 1fr)",
                }),
              )}
            >
              {[
                {
                  framework: "React",
                  logo: (
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
                  ),
                },
                {
                  framework: "Preact",
                  logo: (
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
                  ),
                },
                {
                  framework: "Solid",
                  logo: (
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
                      />
                      <path
                        fill="url(#a)"
                        d="M163 35S110-4 69 5l-3 1c-6 2-11 5-14 9l-2 3-15 26 26 5c11 7 25 10 38 7l46 9 18-30z"
                        opacity="0.3"
                      />
                      <path
                        fill="#518ac8"
                        d="M52 35l-4 1c-17 5-22 21-13 35 10 13 31 20 48 15l62-21S92 26 52 35z"
                      />
                      <path
                        fill="url(#b)"
                        d="M52 35l-4 1c-17 5-22 21-13 35 10 13 31 20 48 15l62-21S92 26 52 35z"
                        opacity="0.3"
                      />
                      <path
                        fill="url(#c)"
                        d="M134 80a45 45 0 00-48-15L24 85 4 120l112 19 20-36c4-7 3-15-2-23z"
                      />
                      <path
                        fill="url(#d)"
                        d="M114 115a45 45 0 00-48-15L4 120s53 40 94 30l3-1c17-5 23-21 13-34z"
                      />
                    </svg>
                  ),
                },
                {
                  framework: "Qwik",
                  logo: (
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
                  ),
                },
              ].map(({ framework, logo }) => (
                <div
                  key={framework}
                  style={pipe(
                    {
                      fontSize: "1rem",
                      background: gray(10),
                      color: gray(80),
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: 32,
                      gap: 24,
                      borderRadius: 6,
                    },
                    on(dark, {
                      background: gray(85),
                      color: gray(10),
                    }),
                  )}
                >
                  <h1
                    style={pipe(
                      {
                        margin: 0,
                        fontWeight: 400,
                        fontSize: "2em",
                      },
                      on(not(dark), {
                        color: gray(55),
                      }),
                    )}
                  >
                    {framework}
                  </h1>
                  <div style={{ order: 99 }}>
                    <CtaButton
                      to={`/docs/quickstart/${framework.toLowerCase()}`}
                      theme="subtle"
                    >
                      Quickstart
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
                  <div style={{ order: 100 }}>
                    <InstallCommand framework={framework} />
                  </div>
                </div>
              ))}
            </div>
          </Block>
        </section>
        <Section title="Opinions">
          <div
            style={pipe(
              {
                display: "grid",
                gap: 32,
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(32ch, 100%), 1fr))",
                padding: 32,
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
                &quot;fresh&quot; about it. Simple to get started, practically
                no overhead, and it just makes sense. Best part is that it does
                this all using native CSS features, nothing fancy - just really
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
      </div>
    </>
  );
}

function InstallCommand({ framework }: { framework: string }) {
  const [copied, setCopied] = useState(false);
  const command = `npm i @css-hooks/${framework.toLowerCase()}`;
  return (
    <div
      style={pipe(
        {
          display: "flex",
          alignItems: "center",
          gap: "0.5em",
          fontFamily: monospace,
          fontSize: "0.75em",
          color: gray(55),
        },
        on(dark, {
          color: gray(47),
        }),
      )}
    >
      <span>{command}</span>
      <button
        title={copied ? "Copied!" : "Copy to clipboard"}
        onClick={() => {
          navigator.clipboard.writeText(command).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          });
        }}
        style={pipe(
          {
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: "inherit",
            display: "flex",
            alignItems: "center",
            borderRadius: 4,
            outlineWidth: 0,
            outlineStyle: "solid",
            outlineColor: purple(20),
            outlineOffset: 2,
          },
          on(and(intent, light), {
            color: gray(65),
          }),
          on(and("&:active", light), {
            color: gray(75),
          }),
          on(and(intent, dark), {
            color: gray(25),
          }),
          on(and("&:active", dark), {
            color: white,
          }),
          on(dark, {
            outlineColor: purple(50),
          }),
          on("&:focus-visible", {
            outlineWidth: 2,
          }),
        )}
      >
        {copied ? <CheckIcon /> : <ContentCopyIcon />}
      </button>
    </div>
  );
}

function CtaButton({
  theme = "secondary",
  ...linkProps
}: {
  children: ReactNode;
  to: string;
  theme?: "primary" | "secondary" | "subtle";
}) {
  const primary = `&.a`;
  const secondary = "&.b";
  const subtle = `&.c`;
  return (
    <Link
      className={extractClassName({ primary, secondary, subtle }[theme])}
      style={pipe(
        {
          display: "inline-flex",
          justifyContent: "center",
          textDecoration: "none",
          paddingBlock: 16,
          paddingInline: 48,
          fontSize: "1.25em",
          letterSpacing: "-0.025em",
          fontWeight: 400,
          lineHeight: 1,
          borderRadius: 6,
          outlineWidth: 0,
          outlineStyle: "solid",
          outlineColor: purple(20),
          outlineOffset: 2,
        },
        on("&:focus-visible", {
          outlineWidth: 2,
        }),
        on(
          light,
          pipe(
            {
              background: white,
              color: black,
            },
            on(
              primary,
              pipe(
                {
                  background: purple(61),
                },
                on(intent, {
                  background: purple(64),
                }),
                on("&:active", {
                  background: purple(67),
                }),
              ),
            ),
            on(
              secondary,
              pipe(
                {
                  color: purple(61),
                },
                on(intent, {
                  color: purple(64),
                }),
                on("&:active", {
                  color: purple(67),
                }),
              ),
            ),
            on(
              subtle,
              pipe(
                {
                  background: gray(12),
                  color: gray(55),
                },
                on(intent, {
                  background: gray(15),
                  color: gray(58),
                }),
                on("&:active", {
                  background: gray(18),
                  color: gray(61),
                }),
              ),
            ),
          ),
        ),
        on(
          dark,
          pipe(
            {
              background: black,
              color: white,
              outlineColor: purple(50),
            },
            on(
              primary,
              pipe(
                {
                  background: gray(15),
                  color: purple(90),
                },
                on(intent, {
                  background: gray(12),
                }),
                on("&:active", {
                  background: gray(9),
                }),
              ),
            ),
            on(
              secondary,
              pipe(
                {
                  background: purple(90),
                },
                on(intent, {
                  background: purple(88),
                }),
                on("&:active", {
                  background: purple(86),
                }),
              ),
            ),
            on(
              subtle,
              pipe(
                {
                  background: gray(80),
                },
                on(intent, {
                  background: gray(78),
                }),
                on("&:active", {
                  background: gray(76),
                }),
              ),
            ),
          ),
        ),
        on(or(and(light, primary), and(dark, secondary), and(dark, subtle)), {
          color: white,
        }),
      )}
      {...linkProps}
    />
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
    <section>
      <Block>
        <ScreenReaderOnly>
          <h1>{title}</h1>
        </ScreenReaderOnly>
        <div style={{ fontSize: "1rem" }}>{children}</div>
      </Block>
    </section>
  );
}

function CodeWindow({ children }: { children: ReactNode }) {
  const bg = pipe(
    { backgroundColor: white },
    on(dark, { backgroundColor: withAlpha(gray(95), 0.45) }),
  );
  const border = pipe(
    { borderColor: gray(19) },
    on(dark, { borderColor: withAlpha(gray(55), 0.25) }),
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        height: "100%",
      }}
    >
      <div
        style={pipe(
          {
            display: "flex",
            padding: 7,
            gap: 4,
            borderWidth: 1,
            borderStyle: "solid",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          },
          merge(bg),
          merge(border),
        )}
      >
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={pipe(
              {
                width: 12,
                aspectRatio: 1,
                borderRadius: 999,
                background: gray(19),
              },
              on(dark, { background: withAlpha(white, 0.15) }),
            )}
          />
        ))}
      </div>
      <div
        style={pipe(
          {
            flex: 1,
            borderWidth: 1,
            borderStyle: "solid",
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            padding: "1rem",
            overflow: "auto",
          },
          merge(bg),
          merge(border),
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
  icon,
}: {
  source: string;
  preview: ReactNode;
  title: ReactNode;
  icon: ReactNode;
}) {
  return (
    <section>
      <Block>
        <div
          style={pipe(
            {
              position: "relative",
              overflow: "hidden",
              borderRadius: 16,
              background: gray(11),
              padding: 24,
              boxShadow: `inset 0 1px 0 ${gray(19)}, 0 2px 8px ${withAlpha(black, 0.15)}`,
            },
            on(dark, {
              background: [
                `radial-gradient(ellipse 120% 100% at center top, ${withAlpha(gray(50), 0.3)}, ${withAlpha(gray(55), 0.1)} 55%, transparent 85%)`,
                gray(93),
              ].join(", "),
              boxShadow: `inset 0 1px 0 ${withAlpha(white, 0.07)}, 0 2px 8px ${black}`,
            }),
          )}
        >
          {/* Card header */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div
              style={pipe(
                {
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  border: `1px solid ${gray(19)}`,
                  backgroundColor: gray(14),
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  color: gray(51),
                },
                on(dark, {
                  border: `1px solid ${withAlpha(gray(55), 0.25)}`,
                  backgroundColor: withAlpha(gray(60), 0.3),
                  color: gray(40),
                }),
              )}
            >
              {icon}
            </div>
            <span
              style={pipe(
                {
                  color: gray(70),
                  fontWeight: 700,
                  fontSize: "1rem",
                  letterSpacing: "-0.01em",
                },
                on(dark, { color: gray(20) }),
              )}
            >
              {title}
            </span>
          </div>
          {/* Panels */}
          <div
            style={pipe(
              {
                position: "relative",
                zIndex: 1,
                display: "flex",
                alignItems: "stretch",
                flexDirection: "column-reverse",
                gap: 16,
              },
              on("@media (width >= 44em)", {
                flexDirection: "row",
              }),
            )}
          >
            <div style={{ flex: 1 }}>
              <CodeWindow>
                <Preformatted dangerouslySetInnerHTML={{ __html: source }} />
              </CodeWindow>
            </div>
            <div
              style={pipe(
                {
                  flex: 1,
                  minHeight: 280,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 8,
                  backgroundColor: white,
                  backgroundSize: "5px 24px, 24px 5px",
                  border: `1px solid ${gray(19)}`,
                },
                on(dark, {
                  backgroundColor: withAlpha(gray(95), 0.25),
                  border: `1px solid ${withAlpha(gray(55), 0.25)}`,
                }),
              )}
            >
              {preview}
            </div>
          </div>
        </div>
      </Block>
    </section>
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
            gap: 16,
            padding: "2rem",
            outlineWidth: 0,
            outlineOffset: 2,
            outlineColor: purple(20),
            outlineStyle: "solid",
          },
          on("&:focus-visible", {
            outlineWidth: 2,
          }),
          on("&:active", {
            boxShadow: `0 0 0 1px ${gray(20)}`,
          }),
          on(dark, {
            boxShadow: `inset 0 0 0 1px ${gray(70)}`,
            background: gray(90),
            outlineColor: purple(50),
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
            gap: "1em",
            marginTop: "1em",
          }}
        >
          {children}
        </div>
      </a>
    </blockquote>
  );
}

function DemoIconSvg({ children }: { children: ReactElement }) {
  const size = "14px";
  return (
    <svg
      aria-hidden
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

function PseudoClassesIcon() {
  return (
    <DemoIconSvg>
      <path
        d="M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z"
        fill="currentColor"
      />
    </DemoIconSvg>
  );
}

function SelectorsIcon() {
  return (
    <DemoIconSvg>
      <path
        d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"
        fill="currentColor"
      />
    </DemoIconSvg>
  );
}

function ResponsiveIcon() {
  return (
    <DemoIconSvg>
      <path
        d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z"
        fill="currentColor"
      />
    </DemoIconSvg>
  );
}

function Code({ children }: { children?: ReactNode }) {
  return <code style={{ fontFamily: monospace }}>{children}</code>;
}
