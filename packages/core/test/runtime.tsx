import assert from "node:assert";
import events from "node:events";
import { after, afterEach, before, beforeEach, describe, it } from "node:test";

import Color from "color";
import type * as CSS from "csstype";
import * as lightningcss from "lightningcss";
import type { Browser, Page } from "playwright";
import { chromium, firefox, webkit } from "playwright";

import { createHooksSystem } from "../src/index.ts";
// eslint-disable-next-line unused-imports/no-unused-imports
import { jsx } from "./jsx.ts";

events.setMaxListeners(50);

const browsers = { chromium, firefox, webkit };
const selectedBrowser =
  (Object.keys(browsers) as (keyof typeof browsers)[]).find(
    browser => browser === process.env["BROWSER"],
  ) || "chromium";

function useMode(mode: "development" | "production") {
  const previousMode = process.env["NODE_ENV"];
  process.env["NODE_ENV"] = mode;
  return () => {
    process.env["NODE_ENV"] = previousMode;
  };
}

function withMode<T>(mode: Parameters<typeof useMode>[0], f: () => T): T {
  const restoreMode = useMode(mode);
  try {
    return f();
  } finally {
    restoreMode();
  }
}

describe("`mergeStyles` function", () => {
  const { mergeStyles } = createHooksSystem();

  it("merges an override style without modifying either input", () => {
    const baseStyle = { color: "red", display: "block" };
    const overrideStyle = { color: "blue", opacity: 0.5 };

    const style = mergeStyles(baseStyle, overrideStyle);

    assert.deepEqual(style, {
      display: "block",
      color: "blue",
      opacity: 0.5,
    });
    assert.notStrictEqual(style, baseStyle);
    assert.deepEqual(baseStyle, { color: "red", display: "block" });
    assert.deepEqual(overrideStyle, { color: "blue", opacity: 0.5 });
  });

  it("moves override properties after base properties", () => {
    const style = mergeStyles({ marginTop: 8, margin: 0 }, { marginTop: 16 });

    assert.deepEqual(Object.keys(style), ["margin", "marginTop"]);
  });

  it("ignores absent styles", () => {
    const baseStyle = { color: "red" };
    const style = mergeStyles(baseStyle, undefined);

    assert.deepEqual(style, baseStyle);
    style satisfies typeof baseStyle;
  });

  it("hydrates conditional fallback markers", () => {
    const { on } = createHooksSystem().createHooks("&:hover");
    const conditionalStyle = on("&:hover", { color: "blue" });

    assert.match(
      conditionalStyle.color,
      /var\(--ch-revert-layer,revert-layer\)/,
    );

    const style = mergeStyles({ color: "red" }, conditionalStyle);
    assert.doesNotMatch(style.color, /--ch-revert-layer/);
    assert.match(style.color, /red/);
  });

  it("uses the specified stringify function when merging values", () => {
    const { createHooks, mergeStyles } = createHooksSystem<CSS.Properties>(
      (value, propertyName) =>
        `${propertyName}__${
          typeof value === "string" || typeof value === "number" ? value : ""
        }`,
    );
    const { on } = createHooks("&.class");
    const { fontSize = "" } = mergeStyles(
      {
        fontSize: "18px",
      },
      on("&.class", {
        fontSize: "24px",
      }),
    );

    assert.match(fontSize.toString(), /fontSize__18px/);
    assert.match(fontSize.toString(), /fontSize__24px/);
  });

  it("produces the same result twice given the same style object reference", () => {
    // This is to avoid issues in React Strict Mode. See #167.

    const { createHooks, mergeStyles } = createHooksSystem<CSS.Properties>();
    const { on } = createHooks("&:hover");

    const style: CSS.Properties = { color: "blue" };

    const expected = mergeStyles(
      style,
      on("&:hover", {
        color: "red",
      }),
    );

    const actual = mergeStyles(
      style,
      on("&:hover", {
        color: "red",
      }),
    );

    assert.deepStrictEqual(actual, expected);
  });

  it("skips a conditional value that can't be stringified", () => {
    const { createHooks, mergeStyles } = createHooksSystem<
      CSS.Properties<string | number>
    >(value => (typeof value === "string" ? value : null));
    const { on } = createHooks("&:hover");
    const expected = "100px";
    const { width: actual } = mergeStyles(
      { width: expected },
      on("&:hover", { width: 200 }),
    );

    assert.strictEqual(actual, expected);
  });

  it('uses "revert-layer" in place of a fallback value that can\'t be stringified', () => {
    const { createHooks, mergeStyles } = createHooksSystem<
      CSS.Properties<string | number>
    >(value => (typeof value === "string" ? value : null));
    const { on } = createHooks("&:hover");
    const { width } = mergeStyles(
      { width: 100 },
      on("&:hover", { width: "200px" }),
    );

    assert.match(
      width,
      /var\(--[a-z0-9_-]+1,200px\)var\(--[a-z0-9_-]+0,revert-layer\)/,
    );
  });

  it("produces inline styles without unnecessary whitespace in production mode", () => {
    const { createHooks, mergeStyles } = createHooksSystem<CSS.Properties>();
    const { on, and, or, not } = createHooks("&:hover", "&.a", "&.b", "&.c");
    const foo = and("&.a", not(or("&.b", "&.c")));
    const [development, production] = (
      ["development", "production"] as const
    ).map(x =>
      Object.entries(
        withMode(x, () =>
          mergeStyles(
            {
              color: "red",
            },
            on(and(foo, not(or(foo, "&:hover"))), {
              color: "blue",
            }),
          ),
        ),
      )
        .map(
          ([property, value]) =>
            `${
              property.startsWith("--")
                ? property
                : property.replace(/[A-Z]/g, x => `-${x.toLowerCase()}`)
            }:${value}`,
        )
        .join(";"),
    );

    const expected = development
      ? lightningcss
          .transformStyleAttribute({
            code: Buffer.from(development),
            minify: true,
          })
          .code.toString()
      : undefined;

    assert.strictEqual(production, expected);
  });
});

it("produces JSON-serializable conditional styles", () => {
  const { on } = createHooksSystem().createHooks("&:hover");
  const conditionalStyle = on("&:hover", { color: "blue" });

  assert.deepEqual(
    JSON.parse(JSON.stringify(conditionalStyle)),
    conditionalStyle,
  );
});

describe("`styleSheet` function", () => {
  it("produces a style sheet without unnecessary white space in production mode", () => {
    const { createHooks } = createHooksSystem<CSS.Properties>();
    const { styleSheet } = createHooks("&:hover", "&.a", "&.b", "&.c");
    const { code: expected } = lightningcss.transform({
      filename: "production.min.css",
      code: Buffer.from(styleSheet()),
      minify: true,
    });

    const actual = withMode("production", styleSheet);

    // Note that universal selector (`*`) and `;` are excluded to eliminate
    // trivial differences:
    assert.strictEqual(
      actual.replace(/[*;]/g, ""),
      expected.toString().replace(/[*;]/g, ""),
    );
  });
});

describe(`in ${selectedBrowser}`, () => {
  const { createHooks, mergeStyles } = createHooksSystem<CSS.Properties>();

  let browser: Browser;
  let page: Page;

  before(async () => {
    browser = await browsers[selectedBrowser].launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  after(async () => {
    await browser.close();
  });

  function render(element: string, css: string) {
    return page.setContent(`<style>${css}</style>${element}`);
  }

  function computedStyle(
    selector: string,
    property: "color" | "fontSize" | "paddingTop",
  ) {
    return page
      .locator(selector)
      .evaluate(
        (element, property) => getComputedStyle(element)[property],
        property,
      );
  }

  async function assertColor(selector: string, expected: string) {
    assert.deepStrictEqual(
      Color(await computedStyle(selector, "color")),
      Color(expected),
    );
  }

  function setClassName(selector: string, className: string) {
    return page.locator(selector).evaluate((element, className) => {
      element.setAttribute("class", className);
    }, className);
  }

  for (const mode of ["development", "production"] as const) {
    describe(`in ${mode} mode`, () => {
      let restoreMode = () => {};

      before(() => {
        restoreMode = useMode(mode);
      });

      after(() => {
        restoreMode();
      });

      it("supports selector hooks", async () => {
        const { styleSheet, on } = createHooks("&:hover");

        await render(
          <div
            id="target"
            style={mergeStyles(
              { color: "gray", height: "1px", width: "1px" },
              on("&:hover", { color: "blue" }),
            )}
          />,
          styleSheet(),
        );

        await assertColor("#target", "gray");
        await page.hover("#target");
        await assertColor("#target", "blue");
      });

      it("applies flags to an element and its descendants", async () => {
        const { styleSheet, on, enable, disable } = createHooks("%dark");

        const themeAwareStyle = mergeStyles(
          { color: "yellow" },
          on("%dark", { color: "purple" }),
        );

        await render(
          <div>
            <div id="dark-unset" style={themeAwareStyle} />
            <div
              id="dark-enabled"
              style={mergeStyles(enable("%dark"), themeAwareStyle)}
            >
              <div id="dark-enabled-child" style={themeAwareStyle} />
              <div
                id="dark-disabled"
                style={mergeStyles(disable("%dark"), themeAwareStyle)}
              >
                <div id="dark-disabled-child" style={themeAwareStyle} />
                <div
                  id="dark-reenabled"
                  style={mergeStyles(enable("%dark"), themeAwareStyle)}
                >
                  <div id="dark-reenabled-child" style={themeAwareStyle} />
                </div>
              </div>
            </div>
          </div>,
          styleSheet(),
        );

        for (const selector of [
          "#dark-unset",
          "#dark-disabled",
          "#dark-disabled-child",
        ]) {
          await assertColor(selector, "yellow");
        }
        for (const selector of [
          "#dark-enabled",
          "#dark-enabled-child",
          "#dark-reenabled",
          "#dark-reenabled-child",
        ]) {
          await assertColor(selector, "purple");
        }
      });

      it("composes flags with selector hooks", async () => {
        const { styleSheet, on, and, enable } = createHooks(
          "%dark",
          "&.active",
        );

        await render(
          <div style={enable("%dark")}>
            <div
              id="target"
              style={mergeStyles(
                { color: "yellow" },
                on(and("%dark", "&.active"), { color: "purple" }),
              )}
            />
          </div>,
          styleSheet(),
        );

        await assertColor("#target", "yellow");
        await setClassName("#target", "active");
        await assertColor("#target", "purple");
      });

      it("conditionally sets flags with selector hooks", async () => {
        const { styleSheet, on, enable, disable } = createHooks(
          "%dark",
          "&.dark",
        );
        const themeAwareStyle = mergeStyles(
          { color: "yellow" },
          on("%dark", { color: "purple" }),
        );

        await render(
          <div
            id="controller"
            style={mergeStyles(
              disable("%dark"),
              on("&.dark", enable("%dark")),
              themeAwareStyle,
            )}
          >
            <div id="child" style={themeAwareStyle} />
          </div>,
          styleSheet(),
        );

        await assertColor("#controller", "yellow");
        await assertColor("#child", "yellow");

        await setClassName("#controller", "dark");

        await assertColor("#controller", "purple");
        await assertColor("#child", "purple");
      });

      it("evaluates flag controls against inherited state and other declarations against current state", async () => {
        const { styleSheet, on, enable, disable } = createHooks("%dark");
        const themeAwareStyle = mergeStyles(
          { color: "yellow" },
          on("%dark", { color: "purple" }),
        );
        const invertedThemeStyle = mergeStyles(
          { color: "yellow" },
          enable("%dark"),
          on("%dark", mergeStyles({ color: "purple" }, disable("%dark"))),
        );

        await render(
          <div style={enable("%dark")}>
            <div id="inverted" style={invertedThemeStyle}>
              <div id="inverted-child" style={themeAwareStyle} />
              <div id="restored" style={invertedThemeStyle}>
                <div id="restored-child" style={themeAwareStyle} />
              </div>
            </div>
          </div>,
          styleSheet(),
        );

        await assertColor("#inverted", "yellow");
        await assertColor("#inverted-child", "yellow");
        await assertColor("#restored", "purple");
        await assertColor("#restored-child", "purple");
      });

      it("supports at-rule hooks", async () => {
        const { styleSheet, on } = createHooks("@media (width < 600px)");

        await render(
          <div
            id="target"
            style={mergeStyles(
              { padding: "64px" },
              on("@media (width < 600px)", { padding: "16px" }),
            )}
          />,
          styleSheet(),
        );

        assert.strictEqual(
          await computedStyle("#target", "paddingTop"),
          "64px",
        );

        await page.setViewportSize({ width: 480, height: 800 });

        assert.strictEqual(
          await computedStyle("#target", "paddingTop"),
          "16px",
        );
      });

      it("supports @scope hooks", async () => {
        const scope = "@scope (#scope) to (#limit)";
        const { styleSheet, on } = createHooks(scope);
        const style = mergeStyles(
          { color: "gray" },
          on(scope, { color: "blue" }),
        );

        await render(
          <div id="scope" style={style}>
            <div id="scoped-child" style={style} />
            <div id="limit" style={style}>
              <div id="limited-child" style={style} />
            </div>
          </div>,
          styleSheet(),
        );

        await assertColor("#scope", "blue");
        await assertColor("#scoped-child", "blue");
        await assertColor("#limit", "gray");
        await assertColor("#limited-child", "gray");
      });

      it("supports combinational logic", async () => {
        const { styleSheet, on, and, or, not } = createHooks(
          "&.a",
          "&.b",
          "&.c",
        );

        await render(
          <div
            id="target"
            style={mergeStyles(
              { fontSize: "18px" },
              on(and("&.a", not(or("&.b", "&.c"))), {
                fontSize: "24px",
              }),
            )}
          />,
          styleSheet(),
        );

        for (const className of ["", "a b", "a c"]) {
          await setClassName("#target", className);
          assert.strictEqual(
            await computedStyle("#target", "fontSize"),
            "18px",
          );
        }

        for (const className of ["a", "a d"]) {
          await setClassName("#target", className);
          assert.strictEqual(
            await computedStyle("#target", "fontSize"),
            "24px",
          );
        }
      });

      it("supports @starting-style hooks", async () => {
        const { styleSheet, on } = createHooks("@starting-style");

        await render(
          <div
            id="target"
            style={mergeStyles(
              {
                width: "100px",
                height: "100px",
                backgroundColor: "black",
                opacity: 1,
                transition: "opacity 1s",
              },
              on("@starting-style", { opacity: 0 }),
            )}
          />,
          styleSheet(),
        );

        const screenshotBefore = await page.locator("#target").screenshot();
        await page.waitForTimeout(300);
        const screenshotAfter = await page.locator("#target").screenshot();

        assert.notDeepStrictEqual(screenshotBefore, screenshotAfter);
      });

      it("falls back to the previous cascade layer", async () => {
        const { styleSheet, on } = createHooks("&:hover");

        await render(
          <div
            id="target"
            style={on("&:hover", {
              color: "blue",
            })}
          />,
          `#target { color: gray; height: 1px; width: 1px } ${styleSheet()}`,
        );

        await assertColor("#target", "gray");
        await page.hover("#target");
        await assertColor("#target", "blue");
      });
    });
  }
});
