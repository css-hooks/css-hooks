import assert from "node:assert/strict";
import { execFile as execFileCb } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";

import type { Quickstart } from "./fixture.ts";
import { readQuickstart } from "./fixture.ts";
import { applySteps, candidateInstallCommand } from "./run.ts";

const execFile = promisify(execFileCb);

test("quickstarts install packed candidate adapters and core without the registry", async context => {
  const temporary = await mkdtemp(
    path.join(tmpdir(), "css-hooks-candidate ' $-"),
  );
  context.after(() => rm(temporary, { recursive: true, force: true }));
  const project = path.join(temporary, "project");
  await mkdir(project);
  await writeFile(path.join(project, "package.json"), '{"private":true}\n');

  const install =
    "npm install --offline --ignore-scripts @css-hooks/react@next";
  const command = await candidateInstallCommand(
    install,
    temporary,
    context.signal,
  );
  assert(!command.includes("@next"));
  await execFile("bash", ["-e", "-o", "pipefail", "-c", command], {
    cwd: project,
    signal: context.signal,
  });

  const lock = JSON.parse(
    await readFile(path.join(project, "package-lock.json"), "utf8"),
  ) as { packages: Record<string, { resolved?: string }> };
  for (const name of ["core", "react"]) {
    assert.match(
      lock.packages[`node_modules/@css-hooks/${name}`]!.resolved!,
      /^file:/,
    );
    assert.equal(
      await readFile(
        path.join(project, `node_modules/@css-hooks/${name}/esm/index.js`),
        "utf8",
      ),
      await readFile(
        new URL(`../../packages/${name}/esm/index.js`, import.meta.url),
        "utf8",
      ),
    );
  }
  assert.equal(
    lock.packages["node_modules/@css-hooks/react/node_modules/@css-hooks/core"],
    undefined,
  );
});

test("candidate preparation respects test cancellation", async () => {
  await assert.rejects(
    candidateInstallCommand(
      "npm install @css-hooks/core",
      tmpdir(),
      AbortSignal.abort(),
    ),
    { name: "AbortError" },
  );
});

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
