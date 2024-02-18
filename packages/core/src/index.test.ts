import assert from "node:assert";
import events from "node:events";
import { after, afterEach, before, beforeEach, describe, it } from "node:test";
import * as CSS from "csstype";
import puppeteer, { Browser, Page } from "puppeteer";
import Color from "color";
import * as lightningcss from "lightningcss";
import { buildHooksSystem } from "./index.js";

events.setMaxListeners(50);

describe("in browser", () => {
  const createHooks = buildHooksSystem<CSS.Properties>();

  let browser: Browser, page: Page;

  before(async () => {
    browser = await puppeteer.launch({
      headless: "new",
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

  async function queryComputedStyle(
    selector: string,
  ): Promise<ReturnType<typeof getComputedStyle> | undefined> {
    const computedStyle = await page.evaluate(selector => {
      const el = document.querySelector(selector);
      return JSON.stringify(el ? getComputedStyle(el) : undefined);
    }, selector);
    return JSON.parse(computedStyle) as ReturnType<typeof queryComputedStyle>;
  }

  function querySetClassName(selector: string, className: string) {
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

  function computedToColor(computed: string | undefined) {
    return computed ? Color(computed) : undefined;
  }

  for (const mode of [true, false].map(debug => ({ debug }))) {
    describe(`with configuration ${JSON.stringify(mode)}`, () => {
      it("supports selector hooks", async () => {
        const { styleSheet, css } = createHooks({
          hooks: {
            hover: "&:hover",
          },
          ...mode,
        });

        await page.addStyleTag({ content: styleSheet() });

        const expectedDefaultColor = Color("gray"),
          expectedHoverColor = Color("blue");

        await createStyledElement(
          "button",
          css({
            color: expectedDefaultColor.string(),
            on: $ => [
              $("hover", {
                color: expectedHoverColor.string(),
              }),
            ],
          }),
        );

        const actualDefaultColor = computedToColor(
          (await queryComputedStyle("button"))?.color,
        );

        assert.deepStrictEqual(actualDefaultColor, expectedDefaultColor);

        await page.hover("button");

        const actualHoverColor = computedToColor(
          (await queryComputedStyle("button"))?.color,
        );

        assert.deepStrictEqual(actualHoverColor, expectedHoverColor);
      });

      it("supports at-rule hooks", async () => {
        const { styleSheet, css } = createHooks({
          hooks: {
            mobile: "@media (width < 600px)",
          },
          ...mode,
        });

        await page.addStyleTag({ content: styleSheet() });

        const expectedDefaultPadding = "64px",
          expectedMobilePadding = "16px";

        await createStyledElement(
          "div",
          css({
            padding: expectedDefaultPadding,
            on: $ => [
              $("mobile", {
                padding: expectedMobilePadding,
              }),
            ],
          }),
        );

        const actualDefaultPadding = (await queryComputedStyle("div"))?.padding;

        assert.strictEqual(actualDefaultPadding, expectedDefaultPadding);

        await page.setViewport({
          width: 480,
          height: 800,
          deviceScaleFactor: 1,
        });

        const actualMobilePadding = (await queryComputedStyle("div"))?.padding;

        assert.strictEqual(actualMobilePadding, expectedMobilePadding);
      });

      it("supports hook-level combinational logic", async () => {
        const { styleSheet, css } = createHooks({
          hooks: ({ and, or, not }) => ({
            "&.a:not(&.b,&.c)": and("&.a", not(or("&.b", "&.c"))),
          }),
          ...mode,
        });

        await page.addStyleTag({ content: styleSheet() });

        const expectedDefaultDisplay = "none",
          expectedConditionMetDisplay = "block";

        await createStyledElement(
          "div",
          css({
            display: expectedDefaultDisplay,
            on: $ => [
              $("&.a:not(&.b,&.c)", {
                display: expectedConditionMetDisplay,
              }),
            ],
          }),
        );

        let actualDefaultDisplay = (await queryComputedStyle("div"))?.display;

        assert.strictEqual(actualDefaultDisplay, expectedDefaultDisplay);

        for (const className of ["a b", "a c"]) {
          await querySetClassName("div", className);
          actualDefaultDisplay = (await queryComputedStyle("div"))?.display;
          assert.strictEqual(actualDefaultDisplay, expectedDefaultDisplay);
        }

        assert.strictEqual(actualDefaultDisplay, expectedDefaultDisplay);

        for (const className of ["a", "a d"]) {
          await querySetClassName("div", className);
          const actualConditionMetDisplay = (await queryComputedStyle("div"))
            ?.display;
          assert.strictEqual(
            actualConditionMetDisplay,
            expectedConditionMetDisplay,
          );
        }
      });

      it("supports local combinational logic", async () => {
        const { styleSheet, css } = createHooks({
          hooks: {
            "&.a": "&.a",
            "&.b": "&.b",
            "&.c": "&.c",
          },
          ...mode,
        });

        await page.addStyleTag({ content: styleSheet() });

        const expectedDefaultFontSize = "18px",
          expectedConditionMetFontSize = "24px";

        await createStyledElement(
          "div",
          css({
            fontSize: expectedDefaultFontSize,
            on: ($, { and, or, not }) => [
              $(and("&.a", not(or("&.b", "&.c"))), {
                fontSize: expectedConditionMetFontSize,
              }),
            ],
          }),
        );

        let actualDefaultFontSize = (await queryComputedStyle("div"))?.fontSize;

        assert.strictEqual(actualDefaultFontSize, expectedDefaultFontSize);

        for (const className of ["a b", "a c"]) {
          await querySetClassName("div", className);
          actualDefaultFontSize = (await queryComputedStyle("div"))?.fontSize;
          assert.deepStrictEqual(
            actualDefaultFontSize,
            expectedDefaultFontSize,
          );
        }

        assert.strictEqual(actualDefaultFontSize, expectedDefaultFontSize);

        for (const className of ["a", "a d"]) {
          await querySetClassName("div", className);
          const actualConditionMetFontSize = (await queryComputedStyle("div"))
            ?.fontSize;
          assert.strictEqual(
            actualConditionMetFontSize,
            expectedConditionMetFontSize,
          );
        }
      });
    });
  }

  for (const mode of [true, false].flatMap(properties =>
    [true, false].map(conditionalStyles => ({
      sort: {
        properties,
        conditionalStyles,
      },
    })),
  )) {
    describe(`with configuration ${JSON.stringify(mode)}`, () => {
      it("prioritizes conditional styles over base styles", async () => {
        const expectedDefaultColor = Color("blue"),
          expectedHoverColor = Color("red");

        const { styleSheet, css } = createHooks({
          hooks: {
            "&:hover": "&:hover",
          },
          ...mode,
        });

        await page.addStyleTag({ content: styleSheet() });

        createStyledElement(
          "button",
          css({
            on: $ => [
              $("&:hover", {
                color: expectedHoverColor.string(),
              }),
            ],
            color: expectedDefaultColor.string(),
          }),
        );

        const actualDefaultColor = computedToColor(
          (await queryComputedStyle("button"))?.color,
        );

        assert.deepStrictEqual(actualDefaultColor, expectedDefaultColor);

        await page.hover("button");

        const actualHoverColor = computedToColor(
          (await queryComputedStyle("button"))?.color,
        );

        assert.deepStrictEqual(actualHoverColor, expectedHoverColor);
      });
    });

    it("prioritizes conditional styles that appear later", async () => {
      const expectedDefaultColor = Color("red"),
        expectedClassColor = Color("green"),
        expectedHoverColor = Color("blue");

      const { styleSheet, css } = createHooks({
        hooks: {
          "&.class": "&.class",
          "&:hover": "&:hover",
        },
        ...mode,
      });

      await page.addStyleTag({ content: styleSheet() });

      await createStyledElement(
        "button",
        css({
          color: expectedDefaultColor.string(),
          on: $ => [
            $("&:hover", {
              color: expectedHoverColor.string(),
            }),
            $("&.class", {
              color: expectedClassColor.string(),
            }),
          ],
        }),
      );

      const actualDefaultColor = computedToColor(
        (await queryComputedStyle("button"))?.color,
      );

      assert.deepStrictEqual(actualDefaultColor, expectedDefaultColor);

      await querySetClassName("button", "class");

      await page.hover("button");

      const actualClassColor = computedToColor(
        (await queryComputedStyle("button"))?.color,
      );

      assert.deepStrictEqual(actualClassColor, expectedClassColor);

      await querySetClassName("button", "");

      const actualHoverColor = computedToColor(
        (await queryComputedStyle("button"))?.color,
      );

      assert.deepStrictEqual(actualHoverColor, expectedHoverColor);
    });
  }

  describe("when multiple style rules are passed (experimental)", () => {
    for (const mode of [true, false].map(conditionalStyles => ({
      sort: { properties: true, conditionalStyles },
    }))) {
      describe(`with ${JSON.stringify(mode)}`, () => {
        it("gives the last declaration the highest priority", async () => {
          const expectedColor = Color("black");

          const { css } = createHooks({ hooks: {}, ...mode });

          await createStyledElement(
            "div",
            css(
              {
                backgroundColor: Color("blue").string(),
              },
              {
                background: Color("orange").string(),
                backgroundColor: expectedColor.string(),
              },
            ),
          );

          const actualColor = computedToColor(
            (await queryComputedStyle("div"))?.backgroundColor,
          );

          assert.deepStrictEqual(actualColor, expectedColor);
        });
      });
    }

    for (const mode of [true, false].map(conditionalStyles => ({
      sort: { properties: false, conditionalStyles },
    }))) {
      describe(`with ${JSON.stringify(mode)}`, () => {
        it("does not reorder properties", async () => {
          const notExpectedColor = Color("blue"),
            expectedColor = Color("black");

          const { styleSheet, css } = createHooks({
            hooks: { "&:hover": "&:hover" },
            ...mode,
          });

          await page.addStyleTag({ content: styleSheet() });

          await createStyledElement(
            "button",
            css(
              {
                backgroundColor: notExpectedColor.string(),
                background: expectedColor.string(),
                on: $ => [
                  $("&:hover", {
                    backgroundColor: notExpectedColor.string(),
                  }),
                ],
              },
              {
                backgroundColor: notExpectedColor.string(),
              },
            ),
          );

          await page.hover("button");

          const actualColor = computedToColor(
            (await queryComputedStyle("button"))?.backgroundColor,
          );

          assert.deepStrictEqual(actualColor, expectedColor);
        });
      });
    }

    for (const mode of [true, false].map(properties => ({
      sort: { properties, conditionalStyles: true },
    }))) {
      describe(`with ${JSON.stringify(mode)}`, () => {
        it("gives conditional styles higher priority over all base styles", async () => {
          const notExpectedDefaultWidth = "1000px",
            expectedDefaultWidth = "500px",
            expectedMobileWidth = "400px";

          const { styleSheet, css } = createHooks({
            hooks: {
              "@media (max-width: 599.99px)": "@media (max-width: 599.99px)",
            },
            ...mode,
          });

          await page.addStyleTag({ content: styleSheet() });

          await createStyledElement(
            "div",
            css(
              {
                width: notExpectedDefaultWidth,
                on: $ => [
                  $("@media (max-width: 599.99px)", {
                    width: expectedMobileWidth,
                  }),
                ],
              },
              {
                width: expectedDefaultWidth,
              },
            ),
          );

          const actualDefaultWidth = (await queryComputedStyle("div"))?.width;

          assert.strictEqual(actualDefaultWidth, expectedDefaultWidth);

          await page.setViewport({
            width: 480,
            height: 800,
            deviceScaleFactor: 1,
          });

          const actualMobileWidth = (await queryComputedStyle("div"))?.width;

          assert.strictEqual(actualMobileWidth, expectedMobileWidth);
        });
      });
    }

    for (const mode of [true, false].map(properties => ({
      sort: {
        properties,
        conditionalStyles: false,
      },
    }))) {
      describe(`with ${JSON.stringify(mode)}`, () => {
        it("replaces previous declarations with base styles", async () => {
          const notExpectedColor = Color("blue"),
            expectedColor = Color("orange");

          const { styleSheet, css } = createHooks({
            hooks: { "&:hover": "&:hover" },
            ...mode,
          });

          await page.addStyleTag({ content: styleSheet() });

          await createStyledElement(
            "button",
            css(
              {
                on: $ => [
                  $("&:hover", {
                    background: notExpectedColor.string(),
                  }),
                ],
              },
              {
                background: expectedColor.string(),
              },
            ),
          );

          await page.hover("button");

          const actualColor = computedToColor(
            (await queryComputedStyle("button"))?.backgroundColor,
          );

          assert.deepStrictEqual(actualColor, expectedColor);
        });
      });
    }
  });

  describe("when a style condition is not met", () => {
    describe(`with ${JSON.stringify({ fallback: "revert-layer" })}`, () => {
      it("rolls back to the previous cascade layer", async () => {
        const { styleSheet, css } = createHooks({
          hooks: { "&:hover": "&:hover" },
          fallback: "revert-layer",
        });

        const expectedDefaultColor = Color("gray"),
          expectedHoverColor = Color("blue");

        await page.addStyleTag({
          content: `button { color: ${expectedDefaultColor.string()} } ${styleSheet()}`,
        });

        await createStyledElement(
          "button",
          css({
            on: $ => [
              $("&:hover", {
                color: expectedHoverColor.string(),
              }),
            ],
          }),
        );

        const actualDefaultColor = computedToColor(
          (await queryComputedStyle("button"))?.color,
        );

        assert.deepStrictEqual(actualDefaultColor, expectedDefaultColor);

        await page.hover("button");

        const actualHoverColor = computedToColor(
          (await queryComputedStyle("button"))?.color,
        );

        assert.deepStrictEqual(actualHoverColor, expectedHoverColor);
      });
    });

    describe(`with ${JSON.stringify({ fallback: "unset" })}`, () => {
      it("rolls back to the browser default value", async () => {
        const { styleSheet, css } = createHooks({
          hooks: { "&:hover": "&:hover" },
          fallback: "unset",
        });

        const expectedHoverColor = Color("blue");

        await createStyledElement(
          "button",
          css({
            on: $ => [
              $("&:hover", {
                color: expectedHoverColor.string(),
              }),
            ],
          }),
        );

        const expectedDefaultColor = computedToColor(
            (await queryComputedStyle("button"))?.color,
          ),
          notExpectedDefaultColor = [Color("pink"), Color("purple")].find(
            x => x.string() !== expectedDefaultColor?.string(),
          )!;

        await page.addStyleTag({
          content: `button { color: ${notExpectedDefaultColor.string()} } ${styleSheet()}`,
        });

        const actualDefaultColor = computedToColor(
          (await queryComputedStyle("button"))?.color,
        );

        assert.deepStrictEqual(actualDefaultColor, expectedDefaultColor);

        await page.hover("button");

        const actualHoverColor = computedToColor(
          (await queryComputedStyle("button"))?.color,
        );

        assert.deepStrictEqual(actualHoverColor, expectedHoverColor);
      });
    });
  });
});

it("uses the specified stringify function when merging values", () => {
  const createHooks = buildHooksSystem<CSS.Properties>(
    (propertyName, value) =>
      `${propertyName}__${
        typeof value === "string" || typeof value === "number" ? value : ""
      }`,
  );
  const { css } = createHooks({ hooks: { "&.class": "&.class" } });
  const { fontSize = "" } = css({
    fontSize: "18px",
    on: $ => [
      $("&.class", {
        fontSize: "24px",
      }),
    ],
  });
  assert.match(fontSize.toString(), /fontSize__18px/);
  assert.match(fontSize.toString(), /fontSize__24px/);
});

describe("in production mode (vs. debug)", () => {
  const createHooks = buildHooksSystem<CSS.Properties>();
  const instances = [true, false].map(debug =>
    createHooks({
      hooks: ({ and, or, not }) => ({
        hover: "&:hover",
        foo: and("&.a", not(or("&.b", "&.c"))),
      }),
      debug,
      hookNameToId: x => x.toString(),
    }),
  );
  const debug = instances[0]!;
  const production = instances[1]!;

  it("produces a style sheet without unnecessary white space", () => {
    const { code: expected } = lightningcss.transform({
      filename: "production.min.css",
      code: Buffer.from(debug.styleSheet()),
      minify: true,
    });

    const actual = production.styleSheet();

    // Note that universal selector (`*`) and `;` are excluded to eliminate
    // trivial differences:
    assert.strictEqual(
      actual.replace(/[*;]/g, ""),
      expected.toString().replace(/[*;]/g, ""),
    );
  });

  it("produces inline styles without unnecessary whitespace", () => {
    const [debugStyle, productionStyle] = [debug, production].map(x =>
      Object.entries(
        x.css({
          color: "red",
          on: ($, { and, or, not }) => [
            $(and("foo", not(or("foo", "hover"))), {
              color: "blue",
            }),
          ],
        }),
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

    const expected = debugStyle
      ? lightningcss
          .transformStyleAttribute({
            code: Buffer.from(debugStyle),
            minify: true,
          })
          .code.toString()
      : undefined;

    const actual = productionStyle;

    assert.strictEqual(actual, expected);
  });
});
