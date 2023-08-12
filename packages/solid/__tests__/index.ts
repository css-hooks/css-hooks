import { stringifyValue } from "../src";

describe("`stringifyValue` function", () => {
  it("returns a string as-is", () => {
    ["a", "red", ""].forEach((x) => {
      expect(stringifyValue("", x)).toEqual(x);
    });
  });

  it("returns numbers as direct string equivalents", () => {
    ["line-height", "order", "z-index"].forEach((propertyName) => {
      expect(stringifyValue(propertyName, 1.5)).toEqual("1.5");
    });
  });
});
