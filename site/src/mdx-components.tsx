import type { MDXComponents } from "mdx/types";
import Typography from "./components/Typography";
import { exhausted } from "./util/exhausted";
import { CSSProperties, ComponentPropsWithoutRef, ElementType } from "react";
import Code from "./components/Code";
import Link from "@/components/Link";
import Pre from "./components/Pre";
import { css } from "@/css-hooks";
import { gray20, gray80 } from "varsace";

function makeHeadingComponent(
  Tag: ElementType<ComponentPropsWithoutRef<"h1">>,
  typographyVariant: ComponentPropsWithoutRef<typeof Typography>["variant"],
) {
  return function Heading({
    className: headingClassName = "",
    style: headingStyle,
    ...headingRest
  }: {
    className?: string;
    style?: CSSProperties;
  }) {
    return (
      <Typography variant={typographyVariant} margins>
        {({
          className: typographyClassName = "",
          style: typographyStyle,
          ...typographyRest
        }) =>
          exhausted(typographyRest) && (
            <Tag
              className={`${typographyClassName} ${headingClassName}`}
              style={{ ...typographyStyle, ...headingStyle }}
              {...headingRest}
            />
          )
        }
      </Typography>
    );
  };
}

const Heading1 = makeHeadingComponent("h1", "regular3XL");

const Heading2 = makeHeadingComponent("h2", "regular2XL");

const Heading3 = makeHeadingComponent("h3", "regularXL");

function ListItem({
  className: liClassName = "",
  style: liStyle,
  ...liRest
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Typography variant="regularBase">
      {({
        className: typographyClassName = "",
        style: typographyStyle,
        ...typographyRest
      }) =>
        exhausted(typographyRest) && (
          <li
            className={`${typographyClassName} ${liClassName}`}
            style={{ ...typographyStyle, ...liStyle }}
            {...liRest}
          />
        )
      }
    </Typography>
  );
}

function Paragraph({
  className: pClassName = "",
  style: pStyle,
  ...pRest
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Typography variant="regularBase" margins>
      {({
        className: typographyClassName = "",
        style: typographyStyle,
        ...typographyRest
      }) =>
        exhausted(typographyRest) && (
          <p
            className={`${typographyClassName} ${pClassName}`}
            style={{ ...typographyStyle, ...pStyle }}
            {...pRest}
          />
        )
      }
    </Typography>
  );
}

function HorizontalRule() {
  return (
    <hr
      style={css({
        background: gray20,
        marginBlock: "2.5rem 2rem",
        height: 1,
        border: 0,
        dark: { background: gray80 },
      })}
    />
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    code: Code,
    a: Link,
    h1: Heading1,
    h2: Heading2,
    h3: Heading3,
    hr: HorizontalRule,
    li: ListItem,
    p: Paragraph,
    pre: Pre,
  };
}
