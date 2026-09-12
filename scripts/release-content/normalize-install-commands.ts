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
