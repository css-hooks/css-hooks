import { stringifyValue } from "../src";
import unitless from "@emotion/unitless";

describe("`stringifyValue` function", () => {
  it("returns a string as-is", () => {
    ["a", "red", ""].forEach((x) => {
      expect(stringifyValue("", x)).toEqual(x);
    });
  });

  it("returns unitless numbers as direct string equivalents", () => {
    Object.keys(unitless as Record<string, unknown>).forEach((propertyName) => {
      expect(stringifyValue(propertyName, 1.5)).toEqual("1.5");
    });
  });

  it("returns non-unitless numbers as px values", () => {
    ["width", "marginTop", "fontSize"].forEach((propertyName) => {
      expect(stringifyValue(propertyName, 15.5)).toEqual("15.5px");
    });
  });
});
