import type { Properties } from "csstype";

export type CSSProperties = Properties;

type DivProps = {
  children?: string | readonly string[];
  id?: string;
  style?: CSSProperties;
};

export function jsx(
  _tag: "div",
  props: DivProps | null,
  ...children: string[]
): string {
  const id = props?.id === undefined ? "" : ` id="${props.id}"`;
  const style = props?.style
    ? ` style="${Object.entries(props.style)
        .map(
          ([property, value]) =>
            `${property.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}:${String(value)}`,
        )
        .join(";")}"`
    : "";
  return `<div${id}${style}>${children.join("")}</div>`;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace jsx {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace JSX {
    export type Element = string;

    export interface IntrinsicElements {
      div: DivProps;
    }
  }
}
