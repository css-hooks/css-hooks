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
        transformers:
          language === "diff"
            ? [
                {
                  line(line) {
                    if (line.children[0]?.type === "element") {
                      const node = line.children[0].children[0];
                      if (node.type === "text") {
                        const diffType =
                          node.value[0] === "+"
                            ? "add"
                            : node.value[0] === "-"
                              ? "remove"
                              : undefined;
                        if (diffType) {
                          line.properties["class"] += ` diff ${diffType}`;
                          node.value = node.value.substring(1);
                        }
                      }
                    }
                  },
                },
              ]
            : [],
        colorReplacements:
          language === "diff"
            ? {
                "#b31d28": "var(--shiki-diff-remove-fg)",
                "#fdaeb7": "var(--shiki-diff-remove-fg)",
                "#22863a": "var(--shiki-diff-add-fg)",
                "#85e89d": "var(--shiki-diff-add-fg)",
              }
            : {},
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
