import { getHighlighter } from "shiki";

const languages = [
  "css",
  "diff",
  "html",
  "javascript",
  "json",
  "jsx",
  "tsx",
  "typescript",
] as const;

export function isSupportedLanguage(
  language: string,
): language is (typeof languages)[number] {
  return languages.some(l => l === language);
}

export async function highlighter() {
  const hl = await getHighlighter({
    themes: ["github-dark", "github-light"],
    langs: [...languages],
  });
  return {
    highlight(
      code: string,
      { language }: { language: (typeof languages)[number] },
    ) {
      return hl.codeToHtml(code, {
        lang: language,
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
        defaultColor: false,
      });
    },
  };
}

export async function highlight(
  code: string,
  options: { language: (typeof languages)[number] },
) {
  const hl = await highlighter();
  return hl.highlight(code, options);
}
