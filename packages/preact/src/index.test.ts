import assert from "node:assert";
import { describe, it } from "node:test";

import { pipe } from "remeda";

import { _stringifyValue as stringifyValue, createHooks } from "./index.ts";

describe("`stringifyValue` function", () => {
  it("returns a string as-is", () => {
    ["a", "red", ""].forEach(x => {
      assert.equal(stringifyValue(x, ""), x);
    });
  });

  it("returns numbers as direct string equivalents", () => {
    [
      "lineHeight",
      "flexGrow",
      "zIndex",
      "width",
      "marginTop",
      "fontSize",
    ].forEach(propertyName => {
      assert.equal(stringifyValue(1.5, propertyName), "1.5");
    });
  });
});

{
  const { on } = createHooks("&");
  pipe(
    {
      // @ts-expect-error generated camelCase shorthand/longhand conflict
      margin: 0,
    },
    on("&", { marginTop: 1 }),
  );
}
