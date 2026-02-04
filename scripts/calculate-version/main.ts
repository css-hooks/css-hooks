import { exec as execCb } from "node:child_process";
import fs from "node:fs/promises";
import { promisify } from "node:util";

import semver from "semver";

const commitPrefixes = {
  breakingChange: "breaking:",
  feat: "feat:",
  fix: "fix:",
};

const exec = promisify(execCb);

async function getTags() {
  const { stdout: list } = await exec("git tag --list 'v[0-9]*.[0-9]*.[0-9]*'");
  return list
    ? list
        .split("\n")
        .map(x => x.trim())
        .filter(Boolean)
        .sort((a, b) => semver.compareBuild(b, a))
    : [];
}

async function getCommits(sinceRef?: string) {
  const delimiter = "---END---";

  const { stdout: log } = await exec(
    `git log${sinceRef ? ` ${sinceRef}..HEAD` : ""} --merges --pretty=format:%H%n%s%n%b%n${delimiter}`,
  );

  if (!log) return [];

  return log
    .split(delimiter)
    .map(block => block.trim())
    .filter(Boolean)
    .map(block => {
      const lines = block.split("\n").map(l => l.trim());
      const sha = lines.shift() ?? "";
      const message = lines.join("\n").trim();
      return { sha, message };
    })
    .filter(x => !x.message.startsWith("misc: release latest"));
}

function getBumpType<
  const Major extends string,
  const Minor extends string,
  const Patch extends string,
  const Fallback extends string | null,
>(
  commitMessages: string[],
  major: Major,
  minor: Minor,
  patch: Patch,
  fallback: Fallback,
) {
  return commitMessages.some(x => x.startsWith(commitPrefixes.breakingChange))
    ? major
    : commitMessages.some(x => x.startsWith(commitPrefixes.feat))
      ? minor
      : commitMessages.some(x => x.startsWith(commitPrefixes.fix))
        ? patch
        : fallback;
}

async function main() {
  const branch = process.argv[2];

  if (branch !== "latest" && branch !== "next") {
    throw new Error(
      `Current branch \`${branch}\` does not match \`next\` or \`latest\`. Exiting.`,
    );
  }

  const githubOutput = process.env["GITHUB_OUTPUT"];

  if (!githubOutput) {
    throw new Error(
      "The GITHUB_OUTPUT environment variable is not set. Exiting.",
    );
  }

  const tags = await getTags();

  const latestTag = tags.find(x => !x.includes("-next."));

  if (!latestTag) {
    throw new Error("Could not get latest version tag. Exiting.");
  }

  const commitsSinceLatest = await getCommits(latestTag);

  let nextVersion: string | null = null;

  if (branch === "latest") {
    const bumpType = getBumpType(
      commitsSinceLatest.map(c => c.message),
      "major",
      "minor",
      "patch",
      null,
    );

    if (!bumpType) {
      throw new Error(`No releasable changes since ${latestTag}. Exiting.`);
    }

    nextVersion = semver.inc(latestTag, bumpType);
  } else {
    const bumpType = getBumpType(
      commitsSinceLatest.map(c => c.message),
      "premajor",
      "preminor",
      "prepatch",
      "prerelease",
    );

    const preId = "next";

    nextVersion = semver.inc(latestTag, bumpType, preId);

    while (nextVersion && tags.includes(`v${nextVersion}`)) {
      nextVersion = semver.inc(nextVersion, "prerelease", preId);
    }
  }

  if (!nextVersion) {
    throw new Error("Failed to calculate next version. Exiting.");
  }

  const nextTag = `v${nextVersion}`;

  const previousRelease =
    branch === "next"
      ? tags.find(t => semver.compareBuild(t, nextTag) === -1)
      : latestTag;

  const commitsSinceRelease =
    previousRelease === latestTag
      ? commitsSinceLatest
      : await getCommits(previousRelease);

  const releaseBody = `## Changes since ${previousRelease}${commitsSinceRelease
    .filter(
      c =>
        branch === "next" ||
        Object.values(commitPrefixes).some(p => c.message.startsWith(p)),
    )
    .map(
      c =>
        `\n- ${c.message.split("\n")[0]}${/\s\(#[0-9]+\)$/.test(c.message) ? "" : ` (${c.sha.substring(0, 7)})`}`,
    )
    .join("")}`;

  const versionOutput = `NEW_VERSION=${nextVersion}\n`;
  await fs.appendFile(githubOutput, versionOutput);

  const bodyOutput = `RELEASE_BODY<<EOT\n${releaseBody}\nEOT\n`;
  await fs.appendFile(githubOutput, bodyOutput);

  console.log(`Successfully calculated and set output for ${nextVersion}.`);
}

main().catch(e => {
  console.error(e.message);
  process.exit(1);
});
