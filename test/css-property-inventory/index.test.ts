import assert from "node:assert/strict";
import { test } from "node:test";

import { cssPropertyInventory } from "./index.ts";

test("inventory contains unique kebab-case numeric properties across browsers", async () => {
  const properties = await cssPropertyInventory();
  const inventory = new Map(
    properties.map(property => [property.name, property.unitless]),
  );
  assert.equal(inventory.size, properties.length);
  assert(
    properties.every(property => property.name === property.name.toLowerCase()),
  );
  assert.equal(inventory.get("margin-top"), false);
  assert.equal(inventory.get("opacity"), true);
  assert.equal(inventory.get("line-height"), true);
});
