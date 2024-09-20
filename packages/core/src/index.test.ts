import assert from "node:assert";
import events from "node:events";
import { after, afterEach, before, beforeEach, describe, it } from "node:test";

import Color from "color";
import type * as CSS from "csstype";
import * as lightningcss from "lightningcss";
import type { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer";
import { pipe } from "remeda";

import { buildHooksSystem } from "./index.js";

events.setMaxListeners(50);

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

describe("in browser", () => {
  const createHooks = buildHooksSystem<CSS.Properties>();

  let browser: Browser, page: Page;

  before(async () => {
    browser = await puppeteer.launch({
      headless: true,
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setContent(
      "<!DOCTYPE html><html><head></head><body></body></html>",
    );
  });

  afterEach(() => {
    page.close();
  });

  after(() => {
    browser.close();
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

  async function queryAndGetComputedStyle(
    selector: string,
  ): Promise<ReturnType<typeof getComputedStyle>> {
    const computedStyle = await page.evaluate(selector => {
      const el = document.querySelector(selector);
      if (!el) {
        throw new Error(
          `No element matches the provided selector: ${selector}`,
        );
      }
      return JSON.stringify(getComputedStyle(el));
    }, selector);
    return JSON.parse(computedStyle) as ReturnType<typeof getComputedStyle>;
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
          (await queryAndGetComputedStyle("button")).color,
        );

        assert.deepStrictEqual(actualDefaultColor, expectedDefaultColor);

        await page.hover("button");

        const actualHoverColor = Color(
          (await queryAndGetComputedStyle("button")).color,
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

      const { padding: actualDefaultPadding } =
        await queryAndGetComputedStyle("div");

      assert.strictEqual(actualDefaultPadding, expectedDefaultPadding);

      await page.setViewport({
        width: 480,
        height: 800,
        deviceScaleFactor: 1,
      });

      const { padding: actualMobilePadding } =
        await queryAndGetComputedStyle("div");

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

      let { fontSize: actualDefaultFontSize } =
        await queryAndGetComputedStyle("div");

      assert.strictEqual(actualDefaultFontSize, expectedDefaultFontSize);

      for (const className of ["a b", "a c"]) {
        await queryAndSetClassName("div", className);
        ({ fontSize: actualDefaultFontSize } =
          await queryAndGetComputedStyle("div"));
        assert.deepStrictEqual(actualDefaultFontSize, expectedDefaultFontSize);
      }

      assert.strictEqual(actualDefaultFontSize, expectedDefaultFontSize);

      for (const className of ["a", "a d"]) {
        await queryAndSetClassName("div", className);
        const { fontSize: actualConditionMetFontSize } =
          await queryAndGetComputedStyle("div");
        assert.strictEqual(
          actualConditionMetFontSize,
          expectedConditionMetFontSize,
        );
      }
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
        (await queryAndGetComputedStyle("button")).color,
      );

      assert.deepStrictEqual(actualDefaultColor, expectedDefaultColor);

      await page.hover("button");

      const actualHoverColor = Color(
        (await queryAndGetComputedStyle("button")).color,
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
  assert.strictEqual(
    width,
    "var(--mbscpo-1,200px)var(--mbscpo-0,revert-layer)",
  );
});
