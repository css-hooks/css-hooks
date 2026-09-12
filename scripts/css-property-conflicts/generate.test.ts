import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildCSSPropertyConflictData,
  renderCSSPropertyConflicts,
} from "./generate.ts";

const data = buildCSSPropertyConflictData();

function conflicts(property: string, expectedConflict: string) {
  const canonical = data.declarationToProperty.get(property);
  const expectedCanonical = data.declarationToProperty.get(expectedConflict);
  if (!canonical || !expectedCanonical) {
    return false;
  }
  return (
    (canonical === expectedCanonical && property !== expectedConflict) ||
    data.propertyConflicts.get(canonical)?.has(expectedCanonical) === true
  );
}

describe("CSS property conflict generation", () => {
  it("includes direct and recursive shorthand conflicts", () => {
    assert(conflicts("margin", "marginTop"));
    assert(conflicts("border", "borderTopColor"));
    assert(conflicts("borderColor", "borderTop"));
  });

  it("includes reset-only property conflicts", () => {
    assert(conflicts("font", "fontFeatureSettings"));
    assert(conflicts("border", "borderImageSource"));
  });

  it("includes CSS declaration and vendor aliases", () => {
    assert(conflicts("marginBlock", "margin-block"));
    assert(conflicts("WebkitBorderRadius", "borderTopLeftRadius"));
    assert(conflicts("-webkit-border-radius", "border-top-left-radius"));
  });

  it("includes physical and logical property conflicts", () => {
    assert(conflicts("margin", "marginBlock"));
    assert(conflicts("marginTop", "marginBlockStart"));
    assert(conflicts("width", "inlineSize"));
    assert(conflicts("borderTopColor", "borderBlockStartColor"));
  });

  it("does not conflate distinct properties in the same coordinate system", () => {
    assert(!conflicts("marginTop", "marginBottom"));
    assert(!conflicts("marginBlockStart", "marginBlockEnd"));
    assert(!conflicts("width", "height"));
  });

  it("implements the CSS all-property exceptions", () => {
    assert(conflicts("all", "color"));
    assert(!conflicts("all", "all"));
    assert(!conflicts("all", "direction"));
    assert(!conflicts("all", "unicodeBidi"));
  });

  it("does not relate unrelated properties", () => {
    assert(!conflicts("color", "display"));
  });

  it("renders csstype camelCase declarations", async () => {
    const output = await renderCSSPropertyConflicts(data, new Set(["camel"]));
    assert.match(output, /export type CSSPropertyConflicts =/);
    assert.doesNotMatch(output, /CSSPropertyConflictMap/);
    assert.doesNotMatch(output, /CSSPropertyConflicts<CSSProperties>/);
    assert.match(output, /\bWebkitBorderRadius:/);
    assert.doesNotMatch(output, /\bwebkitBorderRadius:/);
    assert.doesNotMatch(output, /"margin-block"/);
  });

  it("renders kebab-case declarations", async () => {
    const output = await renderCSSPropertyConflicts(data, new Set(["kebab"]));
    assert.match(output, /"-webkit-border-radius":/);
    assert.match(output, /"margin-block":/);
    assert.doesNotMatch(output, /\bmarginBlock:/);
  });

  it("renders cross-casing aliases when both casings are selected", async () => {
    const output = await renderCSSPropertyConflicts(
      data,
      new Set(["camel", "kebab"]),
    );
    const marginBlockEntry = output.slice(
      output.indexOf("  marginBlock:"),
      output.indexOf(";", output.indexOf("  marginBlock:")),
    );
    assert.match(marginBlockEntry, /"margin-block"/);
  });
});
