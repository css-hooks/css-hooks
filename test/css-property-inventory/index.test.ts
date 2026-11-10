import assert from "node:assert/strict";
import { before, describe, it } from "node:test";

import { cssPropertyInventory } from "./index.ts";

describe("css property inventory", () => {
  let properties: Awaited<ReturnType<typeof cssPropertyInventory>> = [];

  before(async () => {
    properties = await cssPropertyInventory();
  });

  it("contains only kebab-case properties", () => {
    const invalidCasingProperties = properties.filter(
      ({ name }) => name !== name.toLowerCase(),
    );

    if (invalidCasingProperties.length) {
      assert.fail(
        `Properties not in kebab-case: ${invalidCasingProperties.map(({ name }) => name).join(", ")}`,
      );
    }
  });

  it("contains only unique property names", () => {
    const duplicateProperties = Object.entries(
      Object.groupBy(properties, property => property.name),
    ).flatMap(([name, group]) =>
      group && group.length > 1 ? [[name, group.length]] : [],
    );

    if (duplicateProperties.length) {
      assert.fail(
        `Duplicate properties: ${duplicateProperties.map(([name, count]) => `${name} (${count})`).join(", ")}`,
      );
    }
  });

  it("does not include non-numeric properties", () => {
    assert.strictEqual(
      properties.find(property => property.name === "color"),
      undefined,
    );
  });

  it("correctly identifies non-unitless values", () => {
    assert.deepStrictEqual(
      properties
        .filter(property => property.name === "margin-top")
        .map(({ unitless }) => unitless),
      [false],
    );
  });

  it("correctly identifies unitless values", () => {
    for (const name of ["line-height", "opacity"]) {
      assert.deepStrictEqual(
        properties
          .filter(property => property.name === name)
          .map(({ unitless }) => unitless),
        [true],
      );
    }
  });
});
