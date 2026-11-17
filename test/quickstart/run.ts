import assert from "node:assert/strict";
import type { ChildProcess } from "node:child_process";
import { execFileSync, spawn } from "node:child_process";
import { once } from "node:events";
import { copyFile, mkdir, mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import type { TestContext } from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

import type { Browser } from "playwright";
import { chromium } from "playwright";
import * as v from "valibot";

import type { Quickstart } from "./fixture.ts";
import { readQuickstart } from "./fixture.ts";

/** @internal */
export async function applySteps(
  directory: URL,
  project: string,
  steps: Quickstart["steps"],
) {
  for (const step of steps) {
    if ("patch" in step) {
      execFileSync(
        "git",
        ["apply", fileURLToPath(new URL(step.patch, directory))],
        { cwd: project, stdio: "pipe" },
      );
    } else {
      const target = path.join(project, step.target);
      await mkdir(path.dirname(target), { recursive: true });
      await copyFile(new URL(step.source, directory), target);
    }
  }
}

async function stopServer(server: ChildProcess | undefined) {
  if (server?.pid === undefined) return;

  const closed =
    server.exitCode === null && server.signalCode === null
      ? once(server, "close")
      : undefined;

  try {
    process.kill(-server.pid, "SIGTERM");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ESRCH") throw error;
  }

  await closed;
}

/** @internal */
export function candidateInstallCommand(install: string, destination: string) {
  const packages = new Set(
    Array.from(
      install.matchAll(/(@css-hooks\/[a-z-]+)(?:@[^\s]+)?/g),
      match => match[1]!,
    ),
  );
  assert(packages.size > 0, "Quickstart must install a CSS Hooks package");
  const includesCore = packages.has("@css-hooks/core");
  packages.add("@css-hooks/core");
  const workspaces = [...packages].flatMap(name => ["--workspace", name]);
  const cwd = fileURLToPath(new URL("../../", import.meta.url));

  execFileSync("npm", ["run", "build", ...workspaces], {
    cwd,
    stdio: "inherit",
  });
  const packed = v.parse(
    v.pipe(
      v.string(),
      v.parseJson(),
      v.array(v.object({ name: v.string(), filename: v.string() })),
    ),
    execFileSync(
      "npm",
      ["pack", "--json", "--pack-destination", destination, ...workspaces],
      { cwd, encoding: "utf8" },
    ),
  );
  const tarballs = new Map(
    packed.map(({ name, filename }) => [
      name,
      `'${path.join(destination, filename).replace(/'/g, "'\\''")}'`,
    ]),
  );
  const command = install.replace(
    /(@css-hooks\/[a-z-]+)(?:@[^\s]+)?/g,
    (_, name: string) => {
      const tarball = tarballs.get(name);
      assert(tarball, `Missing candidate tarball: ${name}`);
      return tarball;
    },
  );
  // Install core alongside the adapter so its exact-version dependency stays local.
  return includesCore
    ? command
    : `${command} ${tarballs.get("@css-hooks/core")!}`;
}

export async function checkQuickstart(directory: URL, context: TestContext) {
  const quickstart = await readQuickstart(directory);
  const temporary = await mkdtemp(path.join(tmpdir(), "css-hooks-quickstart-"));
  const resources: { server?: ChildProcess; browser?: Browser } = {};

  context.after(async () => {
    try {
      await resources.browser?.close();
    } finally {
      await stopServer(resources.server).finally(async () => {
        await rm(temporary, { recursive: true, force: true, maxRetries: 10 });
      });
    }
  });

  const env = { ...process.env, CI: "true", npm_config_yes: "true" };

  async function run(command: string, cwd: string) {
    const child = spawn("bash", ["-e", "-o", "pipefail", "-c", command], {
      cwd,
      env,
      stdio: ["ignore", "inherit", "inherit"],
      signal: context.signal,
    });
    const [code] = await once(child, "close");
    assert.equal(code, 0, `Command failed: ${command}`);
  }

  await run(quickstart.create, temporary);

  const project = path.join(temporary, "css-hooks-playground");

  await run(candidateInstallCommand(quickstart.install, temporary), project);

  await applySteps(directory, project, quickstart.steps);

  await run("npm run build", project);

  const reservation = createServer().listen(0, "127.0.0.1");
  await once(reservation, "listening");

  const address = reservation.address();
  assert(address && typeof address !== "string");
  const port = address.port;
  await new Promise<void>(resolve => reservation.close(() => resolve()));

  const server = spawn(
    "npm",
    [
      "run",
      "dev",
      "--",
      "--host",
      "127.0.0.1",
      "--port",
      String(port),
      "--strictPort",
    ],
    { cwd: project, env, stdio: "inherit", detached: true },
  );
  resources.server = server;

  let serverError: Error | undefined;
  server.on("error", error => {
    serverError = error;
  });

  const browser = await chromium.launch();
  resources.browser = browser;

  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
  });

  const errors: Error[] = [];
  page.on("pageerror", error => {
    errors.push(error);
  });

  const deadline = Date.now() + 30_000;
  let ready = false;
  while (Date.now() < deadline) {
    if (serverError) throw serverError;

    assert.equal(
      server.exitCode,
      null,
      "Dev server exited before becoming ready",
    );

    try {
      const response = await page.goto(`http://127.0.0.1:${port}`, {
        waitUntil: "domcontentloaded",
        timeout: 1_000,
      });

      if (response?.ok()) {
        ready = true;
        break;
      }
    } catch {
      // The dev server may still be starting.
    }

    await delay(200, undefined, { signal: context.signal });
  }

  assert(ready, "Dev server did not become ready within 30 seconds");

  const button = page.getByRole("button", { name: "Hover me", exact: true });

  await button.waitFor({ state: "visible" });

  const original = await button.evaluate(
    element => getComputedStyle(element).color,
  );

  assert.notEqual(original, "rgb(255, 0, 0)");

  await button.hover();

  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector("button")!).color ===
      "rgb(255, 0, 0)",
  );

  await page.mouse.move(1279, 719);

  await page.waitForFunction(
    color =>
      getComputedStyle(document.querySelector("button")!).color === color,
    original,
  );

  assert.deepEqual(errors, [], "Quickstart should not produce browser errors");
}
