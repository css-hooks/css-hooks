import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import type { Quickstart } from "@test/quickstart/fixture";

export async function renderBlocks(directory: URL, quickstart: Quickstart) {
  const blocks = new Map([
    [
      "create",
      `\`\`\`bash\n${quickstart.create}\ncd css-hooks-playground\n\`\`\``,
    ],
    ["install", `\`\`\`bash\n${quickstart.install}\n\`\`\``],
  ]);

  for (const step of quickstart.steps) {
    if ("patch" in step) {
      const patch = await readFile(new URL(step.patch, directory), "utf8");
      const header = patch.match(
        /^--- a\/[^\n]+\n\+\+\+ b\/([^\n]+)\n@@ -1(?:,\d+)? \+1(?:,\d+)? @@[^\n]*\n/,
      );
      assert(header, `Expected a full-context patch: ${step.patch}`);
      const diff = patch.slice(header[0].length).trimEnd();
      assert.doesNotMatch(
        diff,
        /^@@ /m,
        `Use one full-context hunk: ${step.patch}`,
      );
      blocks.set(step.patch, `\`\`\`diff\n// ${header[1]}\n\n${diff}\n\`\`\``);
    } else {
      const source = await readFile(new URL(step.source, directory), "utf8");
      const language = step.source.endsWith(".tsx") ? "tsx" : "typescript";
      blocks.set(
        step.source,
        `\`\`\`${language}\n// ${step.target}\n\n${source.trimEnd()}\n\`\`\``,
      );
    }
  }

  blocks.set("dev", "```bash\nnpm run dev\n```");
  return blocks;
}

export function replaceBlocks(markdown: string, blocks: Map<string, string>) {
  const remaining = new Set(blocks.keys());
  const order = blocks.keys();
  const result = markdown.replace(
    /<!-- quickstart: ([^\n]+) -->[\s\S]*?<!-- \/quickstart -->/g,
    (_, name: string) => {
      assert(
        remaining.delete(name),
        `Unknown or duplicate quickstart block: ${name}`,
      );
      assert.equal(
        name,
        order.next().value,
        "Quickstart blocks must follow test order",
      );
      return `<!-- quickstart: ${name} -->\n\n${blocks.get(name)}\n\n<!-- /quickstart -->`;
    },
  );
  assert.equal(
    remaining.size,
    0,
    `Missing quickstart blocks: ${[...remaining]}`,
  );
  return result;
}
