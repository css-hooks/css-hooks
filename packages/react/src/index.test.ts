import assert from "node:assert";
import { describe, it } from "node:test";

import {
  _stringifyValue as stringifyValue,
  _unitlessNumbers as unitlessNumbers,
} from "./index.js";

describe("`stringifyValue` function", () => {
  it("returns a string as-is", () => {
    ["a", "red", ""].forEach(x => {
      assert.equal(stringifyValue(x, ""), x);
    });
  });

  it("returns unitless numbers as direct string equivalents", () => {
    unitlessNumbers.forEach(propertyName => {
      assert.equal(stringifyValue(1.5, propertyName), "1.5");
    });
  });

  it("assumes numbers assigned to custom properties are unitless values", () => {
    assert.equal(stringifyValue(7, "--foo"), "7");
  });

  it("returns non-unitless numbers as px values", () => {
    ["width", "marginTop", "fontSize"].forEach(propertyName => {
      assert.equal(stringifyValue(15.5, propertyName), "15.5px");
    });
  });
});
