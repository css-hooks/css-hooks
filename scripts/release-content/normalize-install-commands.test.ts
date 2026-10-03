import assert from "node:assert";
import { describe, it } from "node:test";

import { normalizeInstallCommands } from "./normalize-install-commands.ts";

describe("normalizeInstallCommands", () => {
  it("removes next tags for the latest channel", () => {
    assert.equal(
      normalizeInstallCommands(
        "npm install @css-hooks/react@next @css-hooks/core@next remeda",
        "latest",
      ),
      "npm install @css-hooks/react @css-hooks/core remeda",
    );
  });

  it("adds next tags for the next channel", () => {
    assert.equal(
      normalizeInstallCommands(
        "npm install @css-hooks/react @css-hooks/core@next remeda",
        "next",
      ),
      "npm install @css-hooks/react@next @css-hooks/core@next remeda",
    );
  });

  it("is idempotent", () => {
    const command = "npm i @css-hooks/preact remeda";
    const normalized = normalizeInstallCommands(command, "next");

    assert.equal(normalizeInstallCommands(normalized, "next"), normalized);
  });

  it("preserves unrelated packages and explicit versions", () => {
    const content = [
      "npm install @css-hooks/solid@4.0.0 solid-js@next @solidjs/web@next",
      "npm uninstall @css-hooks/react@next",
      'import "@css-hooks/react";',
    ].join("\n");

    assert.equal(normalizeInstallCommands(content, "latest"), content);
  });

  it("preserves command prefixes and comments", () => {
    assert.equal(
      normalizeInstallCommands(
        "$ npm install @css-hooks/qwik # install the integration",
        "next",
      ),
      "$ npm install @css-hooks/qwik@next # install the integration",
    );
  });
});
