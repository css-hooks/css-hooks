import { test } from "node:test";

import { checkQuickstart } from "@test/quickstart";

test("No-framework quickstart", { timeout: 300_000 }, context =>
  checkQuickstart(new URL("./quickstart/", import.meta.url), context),
);
