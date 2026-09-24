import assert from "node:assert";
import events from "node:events";
import { after, afterEach, before, beforeEach, describe, it } from "node:test";

import Color from "color";
import type * as CSS from "csstype";
import * as lightningcss from "lightningcss";
import type { Browser, Page } from "playwright";
import { chromium, firefox, webkit } from "playwright";
import { pipe } from "remeda";

import type { Selector } from "./index.ts";
import { buildHooksSystem, mergeStyles } from "./index.ts";

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

describe("`mergeStyles` function", () => {
  it("merges an override style without modifying either input", () => {
    const baseStyle = { color: "red", display: "block" };
    const overrideStyle = { color: "blue", opacity: 0.5 };

    const style = pipe(baseStyle, mergeStyles(overrideStyle));

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
    const style = pipe(
      { marginTop: 8, margin: 0 },
      mergeStyles({ marginTop: 16 }),
    );

    assert.deepEqual(Object.keys(style), ["margin", "marginTop"]);
  });

  it("returns the base style when the override style is absent", () => {
    const baseStyle = { color: "red" };
    const style = pipe(baseStyle, mergeStyles(undefined));

    assert.strictEqual(style, baseStyle);
    style satisfies typeof baseStyle;
  });

  it("preserves exact style types", () => {
    const style = pipe(
      { color: "red", display: "block" } as const,
      mergeStyles({ color: "blue", opacity: 0.5 }),
    );

    style satisfies {
      color: "blue";
      display: "block";
      opacity: 0.5;
    };
  });
});

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
    parentSelector = "body",
  ) {
    return page.evaluate(
      ({ tag, style, parentSelector }) => {
        const el = document.createElement(tag);
        for (const [property, value] of Object.entries(style)) {
          el.style.setProperty(
            property.startsWith("--")
              ? property
              : property.replace(/[A-Z]/g, x => `-${x.toLowerCase()}`),
            String(value),
          );
        }
        document.querySelector(parentSelector)?.appendChild(el);
      },
      {
        tag,
        parentSelector,
        style,
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

      it("applies boolean flags to descendants", async () => {
        const { styleSheet, on, enable, disable } = createHooks("flag:dark");

        await page.addStyleTag({ content: styleSheet() });

        const expectedDefaultColor = Color("gray"),
          expectedEnabledColor = Color("blue");
        const consumerStyle = pipe(
          { color: expectedDefaultColor.string() },
          on("flag:dark", { color: expectedEnabledColor.string() }),
        );

        await createStyledElement("p", consumerStyle);
        await createStyledElement("main", {
          ...enable("dark"),
          ...consumerStyle,
        });
        await createStyledElement("span", consumerStyle, "main");
        await createStyledElement(
          "section",
          { ...disable("dark"), ...consumerStyle },
          "main",
        );
        await createStyledElement("i", consumerStyle, "section");
        await createStyledElement(
          "article",
          { ...enable("dark"), ...consumerStyle },
          "section",
        );
        await createStyledElement("strong", consumerStyle, "article");

        for (const selector of ["p", "main", "i", "article"]) {
          assert.deepStrictEqual(
            Color(await getComputedPropertyValue(selector, "color")),
            expectedDefaultColor,
          );
        }
        for (const selector of ["span", "section", "strong"]) {
          assert.deepStrictEqual(
            Color(await getComputedPropertyValue(selector, "color")),
            expectedEnabledColor,
          );
        }
      });

      it("composes flags with selector hooks", async () => {
        const { styleSheet, on, and, enable } = createHooks(
          "flag:dark",
          "&.active",
        );

        await page.addStyleTag({ content: styleSheet() });

        await createStyledElement("main", enable("dark"));
        await createStyledElement(
          "button",
          pipe(
            { color: "gray" },
            on(and("flag:dark", "&.active"), { color: "blue" }),
          ),
          "main",
        );

        assert.deepStrictEqual(
          Color(await getComputedPropertyValue("button", "color")),
          Color("gray"),
        );
        await queryAndSetClassName("button", "active");
        assert.deepStrictEqual(
          Color(await getComputedPropertyValue("button", "color")),
          Color("blue"),
        );
      });

      it("conditionally inverts flags for descendants", async () => {
        const { styleSheet, on, enable, disable } = createHooks("flag:dark");
        const consumerStyle = pipe(
          { color: "gray" },
          on("flag:dark", { color: "blue" }),
        );
        const invertedStyle = pipe(
          enable("dark"),
          on("flag:dark", disable("dark")),
        );

        await page.addStyleTag({ content: styleSheet() });
        await createStyledElement("main", enable("dark"));
        await createStyledElement(
          "section",
          { ...invertedStyle, ...consumerStyle },
          "main",
        );
        await createStyledElement("span", consumerStyle, "section");
        await createStyledElement(
          "article",
          { ...invertedStyle, ...consumerStyle },
          "section",
        );
        await createStyledElement("strong", consumerStyle, "article");

        for (const [selector, expectedColor] of [
          ["section", "blue"],
          ["span", "gray"],
          ["article", "gray"],
          ["strong", "blue"],
        ] as const) {
          assert.deepStrictEqual(
            Color(await getComputedPropertyValue(selector, "color")),
            Color(expectedColor),
          );
        }
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

    it("supports @scope hooks", async () => {
      const scope = "@scope (section) to (aside)";
      const { styleSheet, on } = createHooks(scope);

      await page.addStyleTag({ content: styleSheet() });

      const expectedDefaultColor = Color("gray"),
        expectedScopedColor = Color("blue");
      const style = pipe(
        { color: expectedDefaultColor.string() },
        on(scope, { color: expectedScopedColor.string() }),
      );

      await createStyledElement("section", style);
      await createStyledElement("p", style, "section");
      await createStyledElement("aside", style, "section");
      await createStyledElement("strong", style, "aside");

      for (const selector of ["section", "p"]) {
        assert.deepStrictEqual(
          Color(await getComputedPropertyValue(selector, "color")),
          expectedScopedColor,
        );
      }
      for (const selector of ["aside", "strong"]) {
        assert.deepStrictEqual(
          Color(await getComputedPropertyValue(selector, "color")),
          expectedDefaultColor,
        );
      }
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

describe("flag controls", () => {
  const createHooks = buildHooksSystem<CSS.Properties>();

  it("omits controls when no flags are registered", () => {
    const hooks = createHooks("&:hover");
    const emptyHooks = createHooks();
    const widenedHooks: Array<Selector | `flag:${string}`> = ["&:hover"];
    const hooksFromWidenedList = createHooks(...widenedHooks);
    const maybeFlagHooks: Array<"flag:dark" | "&:hover"> = ["&:hover"];
    const hooksFromMaybeFlagList = createHooks(...maybeFlagHooks);

    assert(!("enable" in hooks));
    assert(!("disable" in hooks));
    assert(!("enable" in emptyHooks));
    assert(!("disable" in emptyHooks));
    assert(!("enable" in hooksFromWidenedList));
    assert(!("enable" in hooksFromMaybeFlagList));
    assert.strictEqual(
      // @ts-expect-error no registered flags
      hooks.enable,
      undefined,
    );
    assert.strictEqual(
      // @ts-expect-error no registered flags
      hooks.disable,
      undefined,
    );
    assert.strictEqual(
      // @ts-expect-error no registered hooks
      emptyHooks.enable,
      undefined,
    );
    assert.strictEqual(
      // @ts-expect-error a widened hook list cannot guarantee flag controls
      hooksFromWidenedList.enable,
      undefined,
    );
    assert.strictEqual(
      // @ts-expect-error a widened hook list cannot guarantee flag controls
      hooksFromMaybeFlagList.enable,
      undefined,
    );

    const checkTupleUnion = (hookTuple: ["flag:dark"] | ["&:hover"]) => {
      const uncertainHooks = createHooks(...hookTuple);
      // @ts-expect-error a tuple union cannot guarantee flag controls
      return uncertainHooks.enable;
    };
    assert.strictEqual(typeof checkTupleUnion, "function");
  });

  it("only accepts the short names of registered flags", () => {
    const hooks = createHooks("flag:dark", "flag:compact", "&:hover");

    hooks.enable("dark") satisfies CSS.Properties;
    hooks.disable("compact") satisfies CSS.Properties;
    const invalidCalls = () => {
      // @ts-expect-error prefixes are omitted when setting flags
      hooks.enable("flag:dark");
      // @ts-expect-error ordinary hooks cannot be set as flags
      hooks.disable("&:hover");
      // @ts-expect-error the flag was not registered
      hooks.enable("missing");
    };
    assert.strictEqual(typeof invalidCalls, "function");
  });

  it("rejects unknown flag names at runtime", () => {
    const { enable } = createHooks("flag:dark");

    assert.throws(
      () => enable("missing" as "dark"),
      new RangeError("Unknown flag: missing"),
    );
  });

  it("generates registered descendant state rules", () => {
    for (const mode of ["development", "production"] as const) {
      const { styleSheet, enable, disable } = withMode(mode, () =>
        createHooks("flag:dark"),
      );
      const enabled = enable("dark"),
        disabled = disable("dark"),
        [flagVariable] = Object.keys(enabled);

      assert(flagVariable);
      assert.deepStrictEqual(enabled, { [flagVariable]: "on" });
      assert.deepStrictEqual(disabled, { [flagVariable]: "off" });

      const css = styleSheet();
      assert(css.includes(`@property ${flagVariable}`));
      assert.match(css, /syntax:\s*"<custom-ident>"/);
      assert.match(css, /inherits:\s*true/);
      assert.match(css, /initial-value:\s*off/);
      assert.match(
        css,
        new RegExp(`@container\\s+style\\(${flagVariable}:\\s*on\\)`),
      );
    }
  });
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

// @scope hooks require an explicit root
{
  const createHooks = buildHooksSystem();

  createHooks("@scope (.theme)");
  createHooks("@scope (.theme) to (.nested-theme)");

  // @ts-expect-error implicit scope root
  createHooks("@scope");
  // @ts-expect-error implicit scope root
  createHooks("@scope to (.nested-theme)");
}

// conflict protection
{
  const createHooks = buildHooksSystem<
    CSS.Properties<number>,
    { margin: "marginTop"; padding: "paddingTop" }
  >();

  const { on, disable } = createHooks("&", "flag:dark");

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

  pipe(
    {
      // @ts-expect-error a later generic merge does not mask internal conflicts
      marginTop: 0,
    },
    on("&", {
      margin: 1,
    }),
    mergeStyles({} as CSS.Properties<number>),
  );

  const styleWithDisabledFlag = pipe(
    { paddingTop: 0 as const },
    mergeStyles(disable("dark")),
  );
  styleWithDisabledFlag satisfies { paddingTop: 0 };

  const styleWithDisabledFlagAndOverride = pipe(
    { color: "red" },
    mergeStyles({ ...disable("dark"), color: "blue" }),
  );
  styleWithDisabledFlagAndOverride satisfies { color: "blue" };

  pipe(
    {
      paddingTop: 0,
    },
    on("&", {
      margin: 0,
    }),
    // @ts-expect-error flag declarations do not mask earlier conflicts
    mergeStyles(disable("dark")),
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
    on("&", { color: "green" }),
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
