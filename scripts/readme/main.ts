import { exec as execCb } from "node:child_process";
import fs from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import { pipe } from "remeda";
import * as v from "valibot";

const exec = promisify(execCb);
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "../../");
const rootReadmePath = resolve(rootDir, "README.md");

async function main() {
  const ref = process.argv.find((_, i, argv) => argv[i - 1] === "--ref");
  const npm = process.argv.includes("--npm");

  if (!ref) {
    throw new Error("Please provide a ref using --ref <name>");
  }

  const { stdout } = await exec("npm query .workspace", { cwd: rootDir });
  const workspaceData = v.parse(
    v.pipe(
      v.string(),
      v.parseJson(),
      v.array(v.object({ name: v.string(), location: v.string() })),
    ),
    stdout,
  );

  const packages = workspaceData.filter(w => w.name.startsWith("@css-hooks/"));

  const rootReadmeContent = await fs.readFile(rootReadmePath, "utf-8");

  const readmeContent = (packageName: string) => {
    return pipe(
      rootReadmeContent,
      readme =>
        readme.replace(
          /<div[^>]+id="wordmark"[^>]*>([\S\s]*?)<\/div>/m,
          `<div id="wordmark">${(npm
            ? [
                `https://github.com/css-hooks/css-hooks/raw/${ref}/.github/wordmark-dark.svg`,
              ]
            : [
                ".github/wordmark-dark.svg#gh-light-mode-only",
                ".github/wordmark-light.svg#gh-dark-mode-only",
              ]
          )
            .map(src => `\n    <img alt="CSS Hooks" src="${src}" width="256">`)
            .join("")}\n  </div>`,
        ),
      readme => {
        const refType =
          ref === "latest" || ref === "next"
            ? "branch"
            : /^v[0-9]/.test(ref)
              ? "tag"
              : "ref";
        const color =
          ref === "latest" || /^v[0-9]+\.[0-9]+\.[0-9]+$/.test(ref)
            ? "663399"
            : "ffd700";
        const published = refType === "branch" || refType === "tag";

        const badges = [
          {
            alt: `${refType} ${ref}`,
            src: `https://img.shields.io/badge/${refType}-${ref.replace(/-/g, "--")}-${color}`,
            href: `https://github.com/css-hooks/css-hooks/tree/${ref}`,
          },
          ...(published
            ? [
                {
                  alt: "npm version",
                  src:
                    refType === "branch"
                      ? `https://img.shields.io/npm/v/${packageName}/${ref}.svg?label=npm&color=${color}`
                      : `https://img.shields.io/badge/npm-${ref.replace(/-/g, "--")}-${color}`,
                  href: `https://www.npmjs.com/package/${packageName}/v/${ref.replace(/^v/, "")}`,
                },
              ]
            : []),
          {
            alt: "license",
            src: `https://img.shields.io/badge/license-MIT-${color}`,
            href: `https://github.com/css-hooks/css-hooks/blob/${ref}/LICENSE`,
          },
        ]
          .map(
            ({ alt, src, href }) =>
              `\n  <a href="${href}"><img src="${src}" alt="${alt}"></a>`,
          )
          .join("");

        const badgesRegex = /<(\w+)[^>]+id="badges"[^>]*>([\S\s]*?)<\/\1>/m;
        if (!badgesRegex.test(readme)) {
          throw new Error("Could not find badges section in README.md");
        }
        return readme.replace(
          badgesRegex,
          `<div align="center" id="badges">${badges}\n</div>`,
        );
      },
      readme => readme.replace(/@css-hooks\/core/g, packageName),
    );
  };

  if (npm) {
    for (const pkg of packages) {
      await fs.writeFile(
        resolve(rootDir, pkg.location, "README.md"),
        readmeContent(pkg.name),
        "utf-8",
      );
      console.log(`📦 Generated npm README for ${pkg.name} at ${pkg.location}`);
    }
  } else {
    await fs.writeFile(
      rootReadmePath,
      readmeContent("@css-hooks/core"),
      "utf-8",
    );
    console.log("🏠 Updated root README.md");
  }
}

main().catch(error => {
  console.error(error);
  process.exit(2);
});
