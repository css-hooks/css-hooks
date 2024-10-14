import { z } from "zod";

export const syntaxHighlighterLanguages = [
  "javascript",
  "jsx",
  "typescript",
  "tsx",
  "html",
  "css",
  "bash",
  "diff",
] as const;

export const syntaxHighlighterLanguageParser = z.enum(
  syntaxHighlighterLanguages,
);
