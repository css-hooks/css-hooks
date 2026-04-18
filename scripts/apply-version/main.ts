import { exec as execCb } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import { array, object, parse, parseJson, pipe, string } from "valibot";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDirectory = resolve(__dirname, "../../");

const exec = promisify(execCb);

async function main() {
  const newVersion = process.argv.find(arg => /^[0-9]/.test(arg));

  if (!newVersion) {
    console.error("Usage: node main.ts <new-version>");
    process.exit(1);
  }

  const rootPkgPath = resolve(rootDirectory, "package.json");
  const rootPkg = JSON.parse(await readFile(rootPkgPath, "utf-8"));
  const currentVersion: string = rootPkg.version;

  console.log(`🚀 Bumping all workspaces to: ${newVersion}`);

  await exec(
    `npm version ${newVersion} --no-git-tag-version --workspaces --include-workspace-root`,
    { cwd: rootDirectory },
  );

  const { stdout } = await exec("npm query .workspace", { cwd: rootDirectory });
  const workspaceData = parse(
    pipe(
      string(),
      parseJson(),
      array(object({ name: string(), location: string() })),
    ),
    stdout,
  );

  const allPaths = [
    { name: "", path: resolve(rootDirectory, "package.json") },
    ...workspaceData.map(pkg => ({
      name: pkg.name,
      path: resolve(rootDirectory, pkg.location, "package.json"),
    })),
  ];

  const internalNames = new Set(workspaceData.map(pkg => pkg.name));

  const patchPromises = allPaths.map(async ({ path }) => {
    const content = await readFile(path, "utf-8");
    const pkg = JSON.parse(content);
    let modified = false;

    const depFields = [
      "dependencies",
      "devDependencies",
      "peerDependencies",
    ] as const;

    for (const field of depFields) {
      const deps = pkg[field];
      if (deps) {
        for (const depName of Object.keys(deps)) {
          if (internalNames.has(depName)) {
            deps[depName] = newVersion;
            modified = true;
          }
        }
      }
    }

    if (modified) {
      await writeFile(path, JSON.stringify(pkg, null, 2) + "\n");
      console.log(`✅ Updated internal deps in: ${path}`);
    }
  });

  await Promise.all(patchPromises);

  const homeTsxPath = resolve(rootDirectory, "site/src/routes/home.tsx");
  const homeTsxContent = await readFile(homeTsxPath, "utf-8");
  const updatedHomeTsx = homeTsxContent.replace(
    /\/github\/css-hooks\/css-hooks\/tree\/[^/]+\/example/,
    `/github/css-hooks/css-hooks/tree/v${currentVersion}/example`,
  );
  if (updatedHomeTsx !== homeTsxContent) {
    await writeFile(homeTsxPath, updatedHomeTsx);
    console.log(`✅ Updated StackBlitz link to v${currentVersion} in home.tsx`);
  }

  console.log("📦 Refreshing lockfile...");
  await exec("npm install --package-lock-only", { cwd: rootDirectory });

  console.log("✨ Version sync complete.");
}

main().catch(error => {
  console.error("❌ Error applying version:", error);
  process.exit(2);
});
