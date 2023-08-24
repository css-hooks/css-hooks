import type { MDXComponents } from "mdx/types";
import Typography from "./components/Typography";
import { exhausted } from "./util/exhausted";
import { CSSProperties, ComponentPropsWithoutRef, ElementType } from "react";
import Code from "./components/Code";
import Pre from "./components/Pre";

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

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    code: Code,
    h1: Heading1,
    h2: Heading2,
    p: Paragraph,
    pre: Pre,
  };
}
