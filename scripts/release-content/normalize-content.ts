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
