export function normalizeInstallCommands(
  content: string,
  channel: "latest" | "next",
) {
  return content.replace(
    /^(\s*(?:\$\s*)?npm\s+(?:install|i)\s+)(.*)$/gm,
    (_, command: string, args: string) =>
      command +
      args.replace(
        /(@css-hooks\/[a-z0-9-]+)(?:@next)?(?=\s|$)/g,
        channel === "next" ? "$1@next" : "$1",
      ),
  );
}

export function normalizeDocumentationUrls(
  content: string,
  channel: "latest" | "next",
) {
  const siteUrl =
    channel === "next" ? "https://next.css-hooks.com" : "https://css-hooks.com";

  return content.replace(
    /https:\/\/(?:next\.)?css-hooks\.com(?=\/|$)/g,
    siteUrl,
  );
}

const nextBranchWarning = `<!-- next-branch-warning:start -->

<!-- prettier-ignore -->
> [!WARNING]
> This is the **\`next\`** branch, tracking the upcoming release. For the latest stable code,
> switch to the [\`latest\`](https://github.com/css-hooks/css-hooks/tree/latest) branch.

<!-- next-branch-warning:end -->`;

export function normalizeNextBranchWarning(content: string, show: boolean) {
  const withoutWarning = content.replace(
    /\n*<!-- next-branch-warning:start -->[\s\S]*?<!-- next-branch-warning:end -->\n*/g,
    "\n\n",
  );

  return show
    ? withoutWarning.replace("\n---\n", `\n---\n\n${nextBranchWarning}\n`)
    : withoutWarning;
}
