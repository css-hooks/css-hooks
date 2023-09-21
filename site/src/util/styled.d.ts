import {
  CSSProperties,
  ComponentProps,
  ComponentType,
  ReactElement,
} from "react";
import { U } from "ts-toolbelt";

type Props<Tag extends keyof HTMLElementTagNameMap, ForwardProps> = U.Strict<
  | ComponentProps<Tag>
  | {
      children: (forwardProps: ForwardProps) => ReactElement;
    }
>;

type SpecType =
  | U.Strict<{ className?: string; style?: CSSProperties } | CSSProperties>
  | string;

type SpecTypeOrFn = SpecType | ((prop: any) => SpecType);

type GetSpecType<S extends SpecTypeOrFn> = S extends (props: any) => infer T
  ? T
  : S;

type ValidSpecType<S extends SpecType> = S extends { className?: string }
  ? Exclude<keyof S, "className" | "style"> extends never
    ? unknown
    : never
  : S extends { style?: CSSProperties }
  ? Exclude<keyof S, "className" | "style"> extends never
    ? unknown
    : never
  : S extends CSSProperties
  ? Exclude<keyof S, keyof CSSProperties> extends never
    ? unknown
    : never
  : unknown;

type ForwardProps<
  SF extends SpecTypeOrFn,
  S = GetSpecType<SF>,
> = S extends string
  ? { className: string }
  : S extends { className: string } | { style: string }
  ? S
  : S extends CSSProperties
  ? { style: S }
  : never;

declare function styled<
  Tag extends keyof HTMLElementTagNameMap,
  Spec extends SpecTypeOrFn,
>(
  Tag: Tag,
  spec: Spec & ValidSpecType<GetSpecType<Spec>>,
): ComponentType<
  Props<Tag, ForwardProps<Spec>> &
    (Spec extends (props: infer P) => unknown ? P : Record<string, unknown>)
>;

export default styled;
