import type * as CSS from "csstype";

import type { Hook } from "../src/index.ts";
import { createHooksSystem } from "../src/index.ts";

// public hook type
{
  "&:hover" satisfies Hook;
  "@media (width < 600px)" satisfies Hook;
  "@container (width > 300px)" satisfies Hook;
  "@supports (display: grid)" satisfies Hook;
  "@scope (.theme)" satisfies Hook;
  "@starting-style" satisfies Hook;
  "%dark" satisfies Hook;

  // @ts-expect-error selectors require an ampersand placeholder
  ".active" satisfies Hook;
  // @ts-expect-error flags require the percent prefix
  "flag:dark" satisfies Hook;
  // @ts-expect-error unsupported at-rule
  "@layer theme" satisfies Hook;
}

// @scope hooks require an explicit root
{
  const { createHooks } = createHooksSystem();

  createHooks("@scope (.theme)");
  createHooks("@scope (.theme) to (.nested-theme)");

  // @ts-expect-error implicit scope root
  createHooks("@scope");
  // @ts-expect-error implicit scope root
  createHooks("@scope to (.nested-theme)");
}

// conflict protection
{
  const { createHooks, mergeStyles } = createHooksSystem<
    CSS.Properties<number>,
    { margin: "marginTop"; padding: "paddingTop" }
  >();

  const { on, disable } = createHooks("&", "%dark");

  mergeStyles(
    {
      color: "red",
      marginTop: 0,
    },
    // @ts-expect-error shorthand/longhand conflict
    on("&", {
      margin: 1,
    }),
  );

  // both properties defined in conflict map but don't conflict with each other
  mergeStyles(
    {
      margin: 0,
    },
    on("&", {
      padding: 1,
    }),
  );

  // property not defined in conflict map - no conflict
  mergeStyles(
    {
      color: "red",
    },
    on("&", {
      margin: 0,
    }),
  );

  mergeStyles(
    {
      paddingTop: 0,
    },
    on("&", {
      margin: 0,
    }),
    // @ts-expect-error conflicts detected across styles
    on("&", {
      padding: 0,
    }),
  );

  mergeStyles(
    {
      marginTop: 0,
    },
    // @ts-expect-error a later generic merge does not mask internal conflicts
    on("&", {
      margin: 1,
    }),
    {} as CSS.Properties<number>,
  );

  mergeStyles(
    { paddingTop: 0 as const },
    disable("%dark"),
  ) satisfies CSS.Properties<number>;

  mergeStyles(
    { color: "red" },
    { ...disable("%dark"), color: "blue" },
  ) satisfies { color: "blue" };

  mergeStyles(
    {
      paddingTop: 0,
    },
    disable("%dark"),
    // @ts-expect-error flag declarations do not mask earlier conflicts
    on("&", {
      padding: 0,
    }),
  );
}

// flag controls are only exposed in types when flags are registered
{
  const { createHooks } = createHooksSystem<CSS.Properties>();
  const hooks = createHooks("&:hover");

  // @ts-expect-error no flag hooks registered
  void hooks.enable;
  // @ts-expect-error no flag hooks registered
  void hooks.disable;
}

// flag controls only accept registered flags
{
  const { createHooks } = createHooksSystem<CSS.Properties>();

  const hooks = createHooks("%dark", "%compact", "&:hover");

  hooks.enable("%dark") satisfies CSS.Properties;
  hooks.enable("%dark", "%compact") satisfies CSS.Properties;
  hooks.disable("%compact") satisfies CSS.Properties;

  const enableWithoutFlags = () => {
    // @ts-expect-error at least one flag is required
    hooks.enable();
  };
  void enableWithoutFlags;

  // @ts-expect-error the flag prefix is required
  "dark" satisfies Parameters<typeof hooks.enable>[0];
  // @ts-expect-error ordinary hooks cannot be set as flags
  "&:hover" satisfies Parameters<typeof hooks.disable>[0];
  // @ts-expect-error the flag was not registered
  "missing" satisfies Parameters<typeof hooks.enable>[0];
}

// exact style inference across conditional styles
{
  const { createHooks, mergeStyles } = createHooksSystem<
    {
      color?: string;
      textDecoration?: string;
      textDecorationColor?: string;
    },
    { textDecoration: "textDecorationColor" }
  >();
  const { on } = createHooks("&");

  const style = mergeStyles(
    { color: "red", textDecoration: "none" },
    on("&", { color: "green" }),
    on("&", { color: "blue" as const }),
    on("&", { textDecoration: "underline" as const }),
  );

  style satisfies { color: "blue"; textDecoration: "underline" };
}

// optional conflicts in a contextually inferred style
{
  type CSSProperties = {
    background?: string;
    backgroundAttachment?: string;
    flexDirection?: "row" | "column";
    minHeight?: string;
  };

  const { createHooks, mergeStyles } = createHooksSystem<
    CSSProperties,
    { background: "backgroundAttachment" }
  >();
  const { on } = createHooks("&");

  mergeStyles(
    { flexDirection: "column" },
    on("&", { minHeight: "100dvh" }),
    on("&", { background: "black" }),
  );
}

// mergeStyles preserves contextual style inference
{
  const { createHooks, mergeStyles } =
    createHooksSystem<CSS.Properties<number>>();

  const hooks = createHooks("%dark");
  const { on, enable, disable } = hooks;

  mergeStyles(
    {
      flexDirection: "column",
    },
    enable("%dark"),
    on("%dark", disable("%dark")),
  ) satisfies CSS.Properties<number>;

  mergeStyles(
    {
      // @ts-expect-error the base style is contextually typed
      flexDirection: "invalid",
    },
    enable("%dark"),
  );
}

// mergeStyles preserves exact style types
{
  const { mergeStyles } = createHooksSystem<CSS.Properties>();

  mergeStyles(
    {
      color: "red",
      display: "block" as const,
    },
    { color: "blue", opacity: 0.5 },
  ) satisfies {
    color: "blue";
    display: "block";
    opacity: 0.5;
  };
}

// mergeStyles accepts up to 26 styles
{
  const { mergeStyles } = createHooksSystem<CSS.Properties>();
  const styles = [
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
  ] as const;

  mergeStyles(...styles);
  // @ts-expect-error at most 26 styles can be merged
  mergeStyles(...styles, {});
}
