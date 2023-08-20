import Prism from "prismjs";

import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";

type Props = {
  language: "html" | "javascript" | "jsx" | "typescript" | "tsx";
  children: string;
};

export default function CodeHighlighter({ children, language }: Props) {
  return (
    <div
      className="code-highlighter"
      dangerouslySetInnerHTML={{
        __html: Prism.highlight(children, Prism.languages[language], language),
      }}
    />
  );
}
