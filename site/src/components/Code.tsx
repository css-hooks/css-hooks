import {
  ComponentProps,
  ComponentType,
  ReactNode,
  forwardRef,
  isValidElement,
} from "react";
import { O } from "ts-toolbelt";
import { Inconsolata } from "next/font/google";
import SyntaxHighlighter, { supportedLanguage } from "./SyntaxHighlighter";
import hooks from "@/css-hooks";

export type Props = ComponentProps<"code">;

const inconsolata = Inconsolata({ weight: ["400", "700"], subsets: ["latin"] });

function isIterable(x: any): x is Iterable<unknown> {
  return Symbol.iterator in x;
}

function getStrings(children: ReactNode | ReactNode[]): string[] {
  if (!children) {
    return [];
  }
  if (isValidElement(children)) {
    return getStrings(children.props.children);
  }
  if (typeof children === "string") {
    return [children];
  }
  if (isIterable(children)) {
    return Array.from(children).flatMap(getStrings);
  }
  return [];
}

export default forwardRef<HTMLElement, O.Omit<Props, "ref">>(function Code(
  { children, className, style, ...restProps },
  ref,
) {
  const match = /language-(\w+)/.exec(className || "");
  const highlightedChildren =
    match && match.length > 1 && supportedLanguage(match[1]) ? (
      <SyntaxHighlighter className={inconsolata.className} language={match[1]}>
        {getStrings(children).join(" ")}
      </SyntaxHighlighter>
    ) : null;

  const forwardProps = highlightedChildren
    ? { style }
    : {
        style: hooks({
          color: "var(--pink-800)",
          dark: {
            color: "var(--pink-200)",
          },
          ...style,
        }),
        className: inconsolata.className,
      };

  return (
    <code {...forwardProps} {...restProps} ref={ref}>
      {highlightedChildren || children}
    </code>
  );
}) as ComponentType<Props>;
