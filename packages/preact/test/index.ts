import assert from "node:assert";
import { before, describe, it } from "node:test";

import { cssPropertyInventory } from "@test/css-property-inventory";

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
    assert.equal(stringifyValue(7, "--foo-bar"), "7");
  });

  describe("for numeric properties", () => {
    let properties: Awaited<ReturnType<typeof cssPropertyInventory>> = [];

    before(async () => {
      properties = (await cssPropertyInventory()).flatMap(property => {
        const name = property.name.replace(/-[a-z]/g, x =>
          x.substring(1).toUpperCase(),
        );
        return name === property.name
          ? [property]
          : [property, { ...property, name }];
      });
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
