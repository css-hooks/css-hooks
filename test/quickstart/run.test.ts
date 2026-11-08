import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";

import type { Quickstart } from "./fixture.ts";
import { readQuickstart } from "./fixture.ts";
import { applySteps } from "./run.ts";

test("quickstart steps run in order and fail when a patch does not apply", async context => {
  const temporary = await mkdtemp(path.join(tmpdir(), "css-hooks-steps-"));
  context.after(() => rm(temporary, { recursive: true, force: true }));

  const directory = pathToFileURL(`${temporary}/`);
  const project = path.join(temporary, "project");

  await mkdir(project);

  await writeFile(
    new URL("example.ts", directory),
    "export const color = 'black';\n",
  );

  await writeFile(
    new URL("hover.patch", directory),
    [
      "--- a/src/main.ts",
      "+++ b/src/main.ts",
      "@@ -1 +1 @@",
      "-export const color = 'black';",
      "+export const color = 'red';",
      "",
    ].join("\n"),
  );

  await writeFile(
    new URL("steps.json", directory),
    JSON.stringify({
      create: "npm create example css-hooks-playground",
      install: "npm install example",
      steps: [
        { source: "example.ts", target: "src/main.ts" },
        { patch: "hover.patch" },
      ],
    } satisfies Quickstart),
  );

  const quickstart = await readQuickstart(directory);

  await applySteps(directory, project, quickstart.steps);

  assert.equal(
    await readFile(path.join(project, "src/main.ts"), "utf8"),
    "export const color = 'red';\n",
  );

  await writeFile(
    path.join(project, "src/main.ts"),
    "export const renamed = 'black';\n",
  );

  await assert.rejects(
    applySteps(directory, project, [{ patch: "hover.patch" }]),
  );

  assert.equal(
    await readFile(path.join(project, "src/main.ts"), "utf8"),
    "export const renamed = 'black';\n",
  );
});
