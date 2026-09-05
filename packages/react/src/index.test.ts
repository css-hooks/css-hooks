import assert from "node:assert";
import { describe, it } from "node:test";

import type { CSSProperties } from "react";
import { pipe } from "remeda";

import {
  _stringifyValue as stringifyValue,
  _unitlessNumbers as unitlessNumbers,
  createHooks,
} from "./index.ts";

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

{
  const { on } = createHooks("&");
  pipe(
    {
      // @ts-expect-error `margin` conflicts with `marginTop`
      margin: 0,
    },
    on("&", { marginTop: 1 }),
  );

  pipe(
    { color: "red", textDecoration: "none" },
    on("&", { color: "green" }),
    on("&", { color: "blue" }),
    on("&", { textDecoration: "underline" }),
  ) satisfies CSSProperties;

  // Keep long pipelines from recursively nesting conflict-validation types.
  pipe(
    { display: "inline-flex", alignItems: "center" },
    on("&", { fontWeight: 500, color: "red" }),
    on("&", { gap: 8, padding: 6, transitionProperty: "color" }),
    on("&", { color: "blue" }),
    on("&", {
      justifyContent: "center",
      fontSize: "1rem",
      fontWeight: 600,
      outline: "none",
      borderRadius: 8,
      boxShadow: "none",
      transitionTimingFunction: "ease-in-out",
      transitionDuration: "0.1s",
      transitionProperty: "background-color",
    }),
    on("&", { boxShadow: "0 0 0 2px black" }),
    on("&", { padding: 12, color: "black", backgroundColor: "transparent" }),
    on("&", { color: "green" }),
    on("&", {
      gap: 6,
      color: "gray",
      backgroundColor: "white",
      borderColor: "black",
      borderStyle: "solid",
      borderWidth: 1,
    }),
    on("&", { color: "white", backgroundColor: "black" }),
    on("&", { opacity: 0.5 }),
  ) satisfies CSSProperties;

  // Repeated overrides should remain assignable after type widening.
  pipe(
    { animationDuration: "300ms" },
    on("&", { animationName: "dialogOut" }),
    on("&", { animationName: "dialogIn" }),
  ) satisfies CSSProperties;
}
