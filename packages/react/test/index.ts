import assert from "node:assert";
import { before, describe, it } from "node:test";

import { chromium, firefox, webkit } from "playwright";
import type { CSSProperties } from "react";

import {
  _stringifyValue as stringifyValue,
  createHooks,
  mergeStyles,
} from "../src/index.ts";

describe("`stringifyValue` function", () => {
  it("returns a string as-is", () => {
    ["a", "red", ""].forEach(x => {
      assert.equal(stringifyValue(x, ""), x);
    });
  });

  it("assumes numbers assigned to custom properties are unitless values", () => {
    assert.equal(stringifyValue(7, "--foo"), "7");
  });

  describe("for numeric properties", () => {
    const properties: { name: string; unitless: boolean }[] = [];

    before(async () => {
      for (const browserType of [chromium, firefox, webkit]) {
        const browser = await browserType.launch();
        const page = await browser.newPage();
        const currentProperties = await page.evaluate(() => {
          const { style } = document.documentElement;
          const properties = new Set<string>([]);
          for (const key in style) {
            if (typeof key === "string") {
              properties.add(
                key
                  .replace(/[A-Z]/g, "-$&")
                  .toLowerCase()
                  .replace(/^(webkit|moz|ms|o)-/, "-$&"),
              );
            }
          }
          return [...properties].flatMap(name => {
            if (CSS.supports(name, "1")) {
              return [{ name, unitless: true }];
            }
            if (CSS.supports(name, "1px")) {
              return [{ name, unitless: false }];
            }
            return [];
          });
        });
        currentProperties
          .map(({ name, ...rest }) => ({
            name: name.replace(/-[a-z]/g, x => x.substring(1).toUpperCase()),
            ...rest,
          }))
          .forEach(current => {
            const existing = properties.find(
              existing => existing.name === current.name,
            );
            if (existing) {
              existing.unitless = existing.unitless && current.unitless;
            } else {
              properties.push(current);
            }
          });
        await browser.close();
      }
    });

    it("returns unitless numbers as direct string equivalents", () => {
      properties
        .filter(property => property.unitless)
        .forEach(property => {
          assert.equal(
            stringifyValue(1.5, property.name),
            "1.5",
            property.name,
          );
        });
    });

    it("returns non-unitless numbers as px values", () => {
      properties
        .filter(property => !property.unitless)
        .forEach(property => {
          assert.equal(
            stringifyValue(15.5, property.name),
            "15.5px",
            property.name,
          );
        });
    });
  });
});

{
  const { on } = createHooks("&");
  mergeStyles(
    { margin: 0 },
    // @ts-expect-error `margin` conflicts with `marginTop`
    on("&", { marginTop: 1 }),
  );

  mergeStyles(
    { color: "red", textDecoration: "none" },
    on("&", { color: "green" }),
    on("&", { color: "blue" }),
    on("&", { textDecoration: "underline" }),
  ) satisfies CSSProperties;

  // Keep long compositions from exceeding TypeScript's instantiation limit.
  mergeStyles(
    { display: "inline-flex", alignItems: "center" },
    on("&", { fontWeight: 500, color: "red" }),
    on("&", { gap: 8, padding: 6, transitionProperty: "color" }),
    on("&", { color: "blue" }),
    on("&", {
      justifyContent: "center",
      fontSize: "1rem",
      fontWeight: 600,
      outline: "none",
      borderRadius: 8,
      boxShadow: "none",
      transitionTimingFunction: "ease-in-out",
      transitionDuration: "0.1s",
      transitionProperty: "background-color",
    }),
    on("&", { boxShadow: "0 0 0 2px black" }),
    on("&", { padding: 12, color: "black", backgroundColor: "transparent" }),
    on("&", { color: "green" }),
    on("&", {
      gap: 6,
      color: "gray",
      backgroundColor: "white",
      borderColor: "black",
      borderStyle: "solid",
      borderWidth: 1,
    }),
    on("&", { color: "white", backgroundColor: "black" }),
    on("&", { opacity: 0.5 }),
  ) satisfies CSSProperties;

  // Repeated overrides should remain assignable after type widening.
  mergeStyles(
    { animationDuration: "300ms" },
    on("&", { animationName: "dialogOut" }),
    on("&", { animationName: "dialogIn" }),
  ) satisfies CSSProperties;
}

// flag declarations can be included in conditional override styles
{
  const { on, enable } = createHooks("&", "%dark");

  mergeStyles(
    on(
      "&",
      mergeStyles(
        {
          boxShadow: "0 0 0 1px red",
        },
        enable("%dark"),
      ),
    ),
  );
}
