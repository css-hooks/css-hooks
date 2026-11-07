import assert from "node:assert";
import { before, describe, it } from "node:test";

import { chromium, firefox, webkit } from "playwright";

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
    // @ts-expect-error generated camelCase shorthand/longhand conflict
    on("&", { marginTop: 1 }),
  );
}
