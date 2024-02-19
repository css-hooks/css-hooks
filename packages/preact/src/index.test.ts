import assert from "node:assert";
import { describe, it } from "node:test";
import { _stringifyValue as stringifyValue } from "./index.js";

describe("`stringifyValue` function", () => {
  it("returns a string as-is", () => {
    ["a", "red", ""].forEach(x => {
      assert.equal(stringifyValue("", x), x);
    });
  });

  it("returns unitless numbers as direct string equivalents", () => {
    ["lineHeight", "flexGrow", "zIndex"].forEach(propertyName => {
      assert.equal(stringifyValue(propertyName, 1.5), "1.5");
    });
  });

  it("returns non-unitless numbers as px values", () => {
    ["width", "marginTop", "fontSize"].forEach(propertyName => {
      assert.equal(stringifyValue(propertyName, 15.5), "15.5px");
    });
  });
});
