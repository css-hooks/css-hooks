import assert from "node:assert";
import { describe, it } from "node:test";
import { stringifyValue } from "./index.js";
import { unitlessNumbers } from "./isUnitlessNumber.js";

describe("`stringifyValue` function", () => {
  it("returns a string as-is", () => {
    ["a", "red", ""].forEach(x => {
      assert.equal(stringifyValue("", x), x);
    });
  });

  it("returns unitless numbers as direct string equivalents", () => {
    unitlessNumbers.forEach(propertyName => {
      assert.equal(stringifyValue(propertyName, 1.5), "1.5");
    });
  });

  it("assumes numbers assigned to custom properties are unitless values", () => {
    assert.equal(stringifyValue("--foo", 7), "7");
  });

  it("returns non-unitless numbers as px values", () => {
    ["width", "marginTop", "fontSize"].forEach(propertyName => {
      assert.equal(stringifyValue(propertyName, 15.5), "15.5px");
    });
  });
});
