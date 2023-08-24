import Prism from "prismjs";

import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import { CSSProperties } from "react";

const supportedLanguages = [
  "css",
  "html",
  "javascript",
  "jsx",
  "typescript",
  "tsx",
] as const;

export function supportedLanguage(
  language: string,
): language is (typeof supportedLanguages)[number] {
  return (supportedLanguages as Readonly<string[]>).indexOf(language) !== -1;
}

type Props = {
  className?: string;
  children: string;
  language: (typeof supportedLanguages)[number];
  style?: CSSProperties;
};

export default function SyntaxHighlighter({
  children,
  className = "",
  language,
  style,
}: Props) {
  return (
    <div
      className={`syntax-highlighter ${className}`}
      style={style}
      dangerouslySetInnerHTML={{
        __html: Prism.highlight(children, Prism.languages[language], language),
      }}
    />
  );
}
