import assert from "node:assert";
import events from "node:events";
import { after, afterEach, before, beforeEach, describe, it } from "node:test";

import Color from "color";
import type * as CSS from "csstype";
import * as lightningcss from "lightningcss";
import type { Browser, Page } from "playwright";
import { chromium, firefox, webkit } from "playwright";
import { pipe } from "remeda";

import { buildHooksSystem } from "./index.ts";

events.setMaxListeners(50);

const browsers = { chromium, firefox, webkit };

const selectedBrowser =
  (Object.keys(browsers) as (keyof typeof browsers)[]).find(
    browser => browser === process.env["BROWSER"],
  ) || "chromium";

const browserType = browsers[selectedBrowser];

function useMode(mode: "development" | "production") {
  const backup = process.env["NODE_ENV"];
  process.env["NODE_ENV"] = mode;
  return function revert() {
    process.env["NODE_ENV"] = backup;
  };
}

function withMode<T>(mode: Parameters<typeof useMode>[0], f: () => T): T {
  let teardown = () => {};
  try {
    teardown = useMode(mode);
    return f();
  } finally {
    teardown();
  }
}

describe(`in ${selectedBrowser}`, () => {
  const createHooks = buildHooksSystem<CSS.Properties>();

  let browser: Browser, page: Page;

  before(async () => {
    browser = await browserType.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setContent(
      "<!DOCTYPE html><html><head></head><body></body></html>",
    );
  });

  afterEach(async () => {
    await page.close();
  });

  after(async () => {
    await browser.close();
  });

  function createStyledElement(
    tag: keyof HTMLElementTagNameMap,
    style: CSS.Properties,
  ) {
    return page.evaluate(
      ({ tag, style }) => {
        const el = document.createElement(tag);
        el.setAttribute("style", style);
        document.body.appendChild(el);
      },
      {
        tag,
        style: Object.entries(style)
          .map(
            ([property, value]) =>
              `${
                property.startsWith("--")
                  ? property
                  : property.replace(/[A-Z]/g, x => `-${x.toLowerCase()}`)
              }:${value}`,
          )
          .join(";"),
      },
    );
  }

  function getComputedPropertyValue(
    selector: string,
    property: keyof CSSStyleDeclaration,
  ) {
    return page.evaluate(
      ({ selector, property }) => {
        const el = document.querySelector(selector);
        if (!el) {
          throw new Error(
            `No element matches the provided selector: ${selector}`,
          );
        }
        const computedStyle = getComputedStyle(el);
        const value = computedStyle[property as keyof CSSStyleDeclaration];
        if (typeof value !== "string" && typeof value !== "number") {
          throw new Error(
            `Unexpected value type for property "${String(property)}"`,
          );
        }
        return value;
      },
      { selector, property },
    );
  }

  function queryAndSetClassName(selector: string, className: string) {
    return page.evaluate(
      ({ selector, className }) => {
        const el = document.querySelector(selector);
        if (el) {
          el.className = className;
        }
      },
      { selector, className },
    );
  }

  for (const mode of ["development", "production"] as const) {
    describe(`in ${mode} mode`, () => {
      let teardown = () => {};

      before(() => {
        teardown = useMode(mode);
      });

      after(teardown);

      it("supports basic selector hooks", async () => {
        const { styleSheet, on } = createHooks("&:hover");

        await page.addStyleTag({ content: styleSheet() });

        const expectedDefaultColor = Color("gray"),
          expectedHoverColor = Color("blue");

        await createStyledElement(
          "button",
          pipe(
            {
              color: expectedDefaultColor.string(),
            },
            on("&:hover", {
              color: expectedHoverColor.string(),
            }),
          ),
        );

        const actualDefaultColor = Color(
          await getComputedPropertyValue("button", "color"),
        );

        assert.deepStrictEqual(actualDefaultColor, expectedDefaultColor);

        await page.hover("button");

        const actualHoverColor = Color(
          await getComputedPropertyValue("button", "color"),
        );

        assert.deepStrictEqual(actualHoverColor, expectedHoverColor);
      });
    });

    it("supports at-rule hooks", async () => {
      const { styleSheet, on } = createHooks("@media (width < 600px)");

      await page.addStyleTag({ content: styleSheet() });

      const expectedDefaultPadding = "64px",
        expectedMobilePadding = "16px";

      await createStyledElement(
        "div",
        pipe(
          {
            padding: expectedDefaultPadding,
          },
          on("@media (width < 600px)", {
            padding: expectedMobilePadding,
          }),
        ),
      );

      const actualDefaultPadding = await getComputedPropertyValue(
        "div",
        "paddingTop",
      );

      assert.strictEqual(actualDefaultPadding, expectedDefaultPadding);

      await page.setViewportSize({ width: 480, height: 800 });

      const actualMobilePadding = await getComputedPropertyValue(
        "div",
        "paddingTop",
      );

      assert.strictEqual(actualMobilePadding, expectedMobilePadding);
    });

    it("supports combinational logic", async () => {
      const { styleSheet, on, and, or, not } = createHooks("&.a", "&.b", "&.c");

      await page.addStyleTag({ content: styleSheet() });

      const expectedDefaultFontSize = "18px",
        expectedConditionMetFontSize = "24px";

      await createStyledElement(
        "div",
        pipe(
          {
            fontSize: expectedDefaultFontSize,
          },
          on(and("&.a", not(or("&.b", "&.c"))), {
            fontSize: expectedConditionMetFontSize,
          }),
        ),
      );

      let actualDefaultFontSize = await getComputedPropertyValue(
        "div",
        "fontSize",
      );

      assert.strictEqual(actualDefaultFontSize, expectedDefaultFontSize);

      for (const className of ["a b", "a c"]) {
        await queryAndSetClassName("div", className);
        actualDefaultFontSize = await getComputedPropertyValue(
          "div",
          "fontSize",
        );
        assert.deepStrictEqual(actualDefaultFontSize, expectedDefaultFontSize);
      }

      assert.strictEqual(actualDefaultFontSize, expectedDefaultFontSize);

      for (const className of ["a", "a d"]) {
        await queryAndSetClassName("div", className);
        const actualConditionMetFontSize = await getComputedPropertyValue(
          "div",
          "fontSize",
        );
        assert.strictEqual(
          actualConditionMetFontSize,
          expectedConditionMetFontSize,
        );
      }
    });

    it("supports @starting-style hooks", async () => {
      const { styleSheet, on } = createHooks("@starting-style");

      await page.addStyleTag({ content: styleSheet() });

      await createStyledElement(
        "div",
        pipe(
          {
            width: "100px",
            height: "100px",
            backgroundColor: "black",
            opacity: 1,
            transition: "opacity 1s",
          },
          on("@starting-style", {
            opacity: 0,
          }),
        ),
      );

      const screenshotBefore = await page.locator("div").screenshot();

      await page.waitForTimeout(300);

      const screenshotAfter = await page.locator("div").screenshot();

      assert.notDeepStrictEqual(screenshotBefore, screenshotAfter);
    });

    it("falls back to the previous cascade layer when the condition is not met", async () => {
      const { styleSheet, on } = createHooks("&:hover");

      const expectedDefaultColor = Color("gray"),
        expectedHoverColor = Color("blue");

      await page.addStyleTag({
        content: `button { color: ${expectedDefaultColor.string()} } ${styleSheet()}`,
      });

      await createStyledElement(
        "button",
        pipe(
          {},
          on("&:hover", {
            color: expectedHoverColor.string(),
          }),
        ),
      );

      const actualDefaultColor = Color(
        await getComputedPropertyValue("button", "color"),
      );

      assert.deepStrictEqual(actualDefaultColor, expectedDefaultColor);

      await page.hover("button");

      const actualHoverColor = Color(
        await getComputedPropertyValue("button", "color"),
      );

      assert.deepStrictEqual(actualHoverColor, expectedHoverColor);
    });
  }
});

it("uses the specified stringify function when merging values", () => {
  const createHooks = buildHooksSystem<CSS.Properties>(
    (value, propertyName) =>
      `${propertyName}__${
        typeof value === "string" || typeof value === "number" ? value : ""
      }`,
  );
  const { on } = createHooks("&.class");
  const { fontSize = "" } = pipe(
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

it("uses fixed-width hashes without known polynomial collisions", () => {
  const createHooks = buildHooksSystem();
  const { styleSheet } = createHooks("&.Aa", "&.BB");
  const propertyNames = [...styleSheet().matchAll(/--([^:]+):/g)].map(match => {
    const propertyName = match[1];
    assert(propertyName);
    return propertyName;
  });

  assert(propertyNames.every(name => /^[a-z0-9_-]{7}[01]$/.test(name)));
  assert.strictEqual(
    new Set(propertyNames.map(name => name.slice(0, -1))).size,
    2,
  );
});

describe("in production mode (vs. debug)", () => {
  const createHooks = buildHooksSystem<CSS.Properties>();

  const { styleSheet, on, and, or, not } = createHooks(
    "&:hover",
    "&.a",
    "&.b",
    "&.c",
  );
  const foo = and("&.a", not(or("&.b", "&.c")));

  it("produces a style sheet without unnecessary white space", () => {
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

  it("produces inline styles without unnecessary whitespace", () => {
    const [development, production] = (
      ["development", "production"] as const
    ).map(x =>
      Object.entries(
        withMode(x, () =>
          pipe(
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

    const actual = production;

    assert.strictEqual(actual, expected);
  });
});

it("produces the same result twice given the same style object reference", () => {
  // This is to avoid issues in React Strict Mode. See #167.
  const createHooks = buildHooksSystem<CSS.Properties>();

  const { on } = createHooks("&:hover");

  const style: CSS.Properties = {
    color: "blue",
  };

  const expected = pipe(
    style,
    on("&:hover", {
      color: "red",
    }),
  );

  const actual = pipe(
    style,
    on("&:hover", {
      color: "red",
    }),
  );

  assert.deepStrictEqual(actual, expected);
});

it("skips a conditional value that can't be stringified", () => {
  const createHooks = buildHooksSystem<CSS.Properties<string | number>>(
    value => (typeof value === "string" ? value : null),
  );
  const { on } = createHooks("&:hover");
  const expected = "100px";
  const { width: actual } = pipe(
    { width: expected },
    on("&:hover", { width: 200 }),
  );
  assert.strictEqual(actual, expected);
});

it('uses "revert-layer" in place of a fallback value that can\'t be stringified', () => {
  const createHooks = buildHooksSystem<CSS.Properties<string | number>>(
    value => (typeof value === "string" ? value : null),
  );
  const { on } = createHooks("&:hover");
  const { width } = pipe({ width: 100 }, on("&:hover", { width: "200px" }));
  assert.match(
    width,
    /var\(--[a-z0-9_-]+1,200px\)var\(--[a-z0-9_-]+0,revert-layer\)/,
  );
});

// type-level tests

// conflict protection
{
  const createHooks = buildHooksSystem<
    CSS.Properties<number>,
    { margin: "marginTop"; padding: "paddingTop" }
  >();

  const { on } = createHooks("&");

  // defined in conflict map
  pipe(
    {
      color: "red",
      // @ts-expect-error shorthand/longhand conflict
      marginTop: 0,
    },
    on("&", {
      margin: 1,
    }),
  );

  // both properties defined in conflict map but don't conflict with each other
  pipe(
    {
      margin: 0,
    },
    on("&", {
      padding: 1,
    }),
  );

  // property not defined in conflict map - no conflict
  pipe(
    {
      color: "red",
    },
    on("&", {
      margin: 0,
    }),
  );

  pipe(
    {
      paddingTop: 0,
    },
    // @ts-expect-error conflicts detected across transforms
    on("&", {
      margin: 0,
    }),
    on("&", {
      padding: 0,
    }),
  );
}

// exact style inference across transforms
{
  const createHooks = buildHooksSystem<
    {
      color?: string;
      textDecoration?: string;
      textDecorationColor?: string;
    },
    { textDecoration: "textDecorationColor" }
  >();
  const { on } = createHooks("&");

  const style = pipe(
    { color: "red", textDecoration: "none" },
    on("&", { color: "green" as const }),
    on("&", { color: "blue" as const }),
    on("&", { textDecoration: "underline" as const }),
  );

  style satisfies { color: "blue"; textDecoration: "underline" };
}

// optional conflicts in a contextually inferred style
{
  type CSSProperties = {
    background?: string;
    backgroundAttachment?: string;
    flexDirection?: "row" | "column";
    minHeight?: string;
  };

  const createHooks = buildHooksSystem<
    CSSProperties,
    { background: "backgroundAttachment" }
  >();
  const { on } = createHooks("&");

  pipe(
    { flexDirection: "column" },
    on("&", { minHeight: "100dvh" }),
    on("&", { background: "black" }),
  );
}
