import assert from "node:assert";
import { describe, it } from "node:test";
import { stringifyValue } from "./index.js";

describe("`stringifyValue` function", () => {
  it("returns a string as-is", () => {
    ["a", "red", ""].forEach(x => {
      assert.equal(stringifyValue("", x), x);
    });
  });

  it("returns numbers as direct string equivalents", () => {
    ["line-height", "order", "z-index"].forEach(propertyName => {
      assert.equal(stringifyValue(propertyName, 1.5), "1.5");
    });
  });
});
