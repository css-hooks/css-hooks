import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";

import type { Quickstart } from "@test/quickstart/fixture";
import { readQuickstart } from "@test/quickstart/fixture";

import { renderBlocks, replaceBlocks } from "./render.ts";

test("guide generation renders the fixtures and preserves handwritten prose", async () => {
  const directory = new URL(
    "../../packages/core/test/quickstart/",
    import.meta.url,
  );
  const quickstart = await readQuickstart(directory);
  const blocks = await renderBlocks(directory, quickstart);
  assert(blocks.get("css.ts")!.startsWith("```typescript\n// src/css.ts\n\n"));
  assert.match(
    blocks.get("main-hover.patch")!,
    /-import \{ styleSheet \} from "\.\/css";/,
  );
  assert.match(
    blocks.get("main-hover.patch")!,
    /\+import \{ on, styleObjectToString, styleSheet \} from "\.\/css";/,
  );
  assert.equal(
    blocks.get("create"),
    `\`\`\`bash\n${quickstart.create}\ncd css-hooks-playground\n\`\`\``,
  );
  assert.equal(
    blocks.get("install"),
    `\`\`\`bash\n${quickstart.install}\n\`\`\``,
  );

  const markdown =
    "Handwritten introduction.\n\n" +
    [...blocks.keys()]
      .map(name => `<!-- quickstart: ${name} -->\nold\n<!-- /quickstart -->`)
      .join("\n\n");
  const generated = replaceBlocks(markdown, blocks);
  assert(generated.startsWith("Handwritten introduction.\n\n"));
  assert.equal(replaceBlocks(generated, blocks), generated);
  assert(!generated.includes("\nold\n"));
});

test("guide diffs retain complete modules without patch metadata or omissions", async () => {
  const directory = new URL(
    "../../packages/qwik/test/quickstart/",
    import.meta.url,
  );
  const blocks = await renderBlocks(directory, await readQuickstart(directory));
  assert(
    blocks.get("index.tsx")!.startsWith("```tsx\n// src/routes/index.tsx\n\n"),
  );
  const diff = blocks.get("root.patch")!;
  assert(diff.startsWith("```diff\n// src/root.tsx\n\n"));
  assert.match(diff, / import \{ component\$ \} from "@qwik.dev\/core";/);
  assert.match(diff, / const \{ url \} = useLocation\(\);/);
  assert(diff.endsWith(" });\n```"));
  assert(!diff.includes("// …"));
  assert.doesNotMatch(diff, /^(---|\+\+\+|@@)/m);
  assert.match(diff, /\+import \{ styleSheet \} from "\.\/css";/);
  assert.match(
    diff,
    /\+ {8}<style dangerouslySetInnerHTML=\{styleSheet\(\)\} \/>/,
  );
});

test("guide generation rejects patches with omitted context", async context => {
  const temporary = await mkdtemp(join(tmpdir(), "css-hooks-render-"));
  context.after(() => rm(temporary, { recursive: true, force: true }));
  const directory = pathToFileURL(`${temporary}/`);
  const quickstart: Quickstart = {
    create: "create",
    install: "install",
    steps: [{ patch: "edit.patch" }],
  };
  const patch =
    "--- a/src/main.ts\n+++ b/src/main.ts\n@@ -2 +2 @@\n-old\n+new\n";
  await writeFile(new URL("edit.patch", directory), patch);
  await assert.rejects(renderBlocks(directory, quickstart), /full-context/);
  await writeFile(
    new URL("edit.patch", directory),
    patch.replace("-2 +2", "-1 +1") + "@@ -9 +9 @@\n-old\n+new\n",
  );
  await assert.rejects(renderBlocks(directory, quickstart), /full-context/);
});

test("guide generation rejects missing, duplicate, unknown, and reordered blocks", () => {
  const blocks = new Map([["create", "```bash\ncreate\n```"]]);
  const marker = "<!-- quickstart: create -->\nold\n<!-- /quickstart -->";
  assert.throws(() => replaceBlocks("No markers", blocks), /Missing/);
  assert.throws(
    () => replaceBlocks(`${marker}\n${marker}`, blocks),
    /duplicate/,
  );
  assert.throws(
    () => replaceBlocks(marker.replace("create", "unknown"), blocks),
    /Unknown/,
  );
  assert.throws(
    () => replaceBlocks(marker, new Map([["install", "install"], ...blocks])),
    /test order/,
  );
});
