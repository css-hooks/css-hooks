import type { ComponentProps, ReactNode } from "react";
import { Children, cloneElement, createElement, isValidElement } from "react";

import { and, dark, extractClassName, mergeStyles, not, on } from "../css.ts";
import { gray, orange, purple, white } from "../design/colors.ts";

export function MarkdownBlockquote({
  children: childrenProp,
  style,
  node: _node,
  ...restProps
}: ComponentProps<"blockquote"> & { node?: unknown }) {
  const note = "&.a";
  const warning = "&.b";
  const hasNote = `&:has(.${extractClassName(note)})` as const;
  const hasWarning = `&:has(.${extractClassName(warning)})` as const;
  const noteColor = purple;
  const warningColor = orange;

  const children = (function alertify(
    alert: (type: "WARNING" | "NOTE") => ReactNode,
    node: ReactNode,
  ): ReactNode {
    if (isValidElement(node)) {
      return cloneElement(
        node,
        {},
        ...Children.map(
          node.props &&
            typeof node.props === "object" &&
            "children" in node.props
            ? node.props.children
            : [],
          child => {
            if (typeof child === "string") {
              const match = child.match(/^\s*\[!([A-Z]+)\]/);
              if (match && (match[1] === "WARNING" || match[1] === "NOTE")) {
                return (
                  <>
                    {alert(match[1])}
                    {child.substring(match[0].length)}
                  </>
                );
              }
            }
            return Children.map(child, x => alertify(alert, x as ReactNode));
          },
        ),
      );
    }
    return node;
  })(
    (type: "WARNING" | "NOTE") => (
      <span style={{ display: "block" }}>
        <strong
          className={extractClassName(type === "WARNING" ? warning : note)}
          style={mergeStyles(
            {
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            },
            on(warning, { color: warningColor(50) }),
            on(note, { color: noteColor(50) }),
            on(and(dark, warning), { color: warningColor(40) }),
            on(and(dark, note), { color: noteColor(40) }),
          )}
        >
          <svg
            viewBox="0 0 16 16"
            style={{
              minWidth: "1em",
              maxWidth: "1em",
              minHeight: "1em",
              maxHeight: "1em",
              transform: "translateY(-0.0625em)",
            }}
          >
            <path
              fill="currentColor"
              d={
                type === "WARNING"
                  ? "M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
                  : "M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
              }
            />
          </svg>
          {`${type[0]}${type.substring(1).toLowerCase()}`}
        </strong>
      </span>
    ),
    createElement("div", { children: childrenProp }), // eslint-disable-line react/no-children-prop
  );
  return (
    <blockquote
      style={mergeStyles(
        {
          boxSizing: "border-box",
          borderWidth: 0,
          borderLeftWidth: "8px",
          borderStyle: "solid",
          paddingBlock: "0.1px",
          paddingInline: 16,
          marginLeft: 0,
          marginRight: 0,
          marginBlock: 24,
          borderColor: gray(50),
          color: gray(70),
          background: white,
          ...style,
        },
        on(not(dark), {
          boxShadow: `inset 0 0 0 1px ${gray(20)}`,
        }),
        on(dark, {
          background: gray(85),
          color: gray(30),
        }),
        on(hasWarning, {
          borderColor: warningColor(40),
        }),
        on(hasNote, {
          borderColor: noteColor(40),
        }),
        on(and(dark, hasWarning), {
          borderColor: warningColor(61),
        }),
        on(and(dark, hasNote), {
          borderColor: noteColor(61),
        }),
      )}
      {...restProps}
    >
      {children}
    </blockquote>
  );
}
