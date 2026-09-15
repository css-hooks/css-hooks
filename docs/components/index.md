---
title: Components
description: Guidance for building reusable components with CSS Hooks
order: 6
---

# Components

This guide offers advice for implementing reusable components that use CSS Hooks
internally. It covers how components can share hook configuration while keeping
their styling decisions and public APIs specific to each component.

## Class selector hooks

Components often need conditions that correspond to their own variations or
state. Rather than registering a component-specific selector for every case,
register a small set of generic class-selector hooks in the application's
styling module:

```typescript
// src/css.ts

import { createHooks } from "@css-hooks/react";

export const { on, styleSheet } = createHooks("&.a", "&.b", "&.c");
```

These hooks act as reusable markers rather than carrying application-wide
meaning. For example, one component can use `&.a` for a primary variant while
another uses it for a selected state. Within each component, name the classes
according to their local purpose:

```typescript
const primary = "a"; // class name used in the "&.a" hook
const danger = "b"; // class name used in the "&.b" hook
```

Apply the class when the variation is active, then use its condition with
`on()`. Use distinct classes for states that can vary independently on the same
element.

## Component API design

### Prefer explicit props

Prefer explicit props for the variations a component intentionally supports.
Props make those variations discoverable and type-safe while letting the
component own their visual treatment. For example, a button can expose a
`variant` prop while limiting direct access to individual CSS properties.

The component can translate that prop into an internal class and keep its
prop-driven styles in the pipeline:

```tsx
import type { ComponentProps } from "react";
import { pipe } from "remeda";

import { on } from "./css";

type ButtonProps = Omit<ComponentProps<"button">, "style"> & {
  variant?: "primary" | "danger";
};

export function Button({
  variant = "primary",
  className: classNameProp = "",
  ...props
}: ButtonProps) {
  const primary = "a";
  const danger = "b";

  return (
    <button
      {...props}
      className={`${classNameProp} ${{ primary, danger }[variant]}`}
      style={pipe(
        {
          border: 0,
          borderRadius: 6,
          padding: "0.5rem 1rem",
        },
        on(`&.${primary}`, {
          backgroundColor: "#174ea6",
          color: "white",
        }),
        on(`&.${danger}`, {
          backgroundColor: "#a21d27",
          color: "white",
        }),
      )}
    />
  );
}
```

Here, each supported variant activates a corresponding class condition rather
than moving conditional styling into a JavaScript expression.

### Expose a style escape hatch

A public `style` prop can be useful for layout, integration, and one-off
customization that a component does not anticipate. It also lets consumers
override declarations outside the component's documented API, so expose it only
when that flexibility is appropriate.

Re-export `mergeStyles` from the application's styling module:

```typescript
// src/css.ts

export { mergeStyles } from "@css-hooks/react";
```

To add the escape hatch to the preceding `Button`, include its native `style`
prop, then use `mergeStyles` at the end of the pipeline to overlay the
consumer's styles on the component's internal styles:

```diff
-import { on } from "./css";
+import { mergeStyles, on } from "./css";

-type ButtonProps = Omit<ComponentProps<"button">, "style"> & {
+type ButtonProps = ComponentProps<"button"> & {
   variant?: "primary" | "danger";
 };

 export function Button({
   variant = "primary",
   className: classNameProp = "",
+  style: styleProp,
   ...props
 }: ButtonProps) {

   // ...

       style={pipe(
         // ...
         on(`&.${danger}`, {
           backgroundColor: "#a21d27",
           color: "white",
         }),
+        mergeStyles(styleProp),
       )}
```

Pipeline order determines precedence. If the public style sets a property used
by an internal hook, the public value replaces the entire conditional value for
that property. This makes `style` a predictable final escape hatch.

`mergeStyles` differs from object spread when an override replaces an existing
property. It moves each override property to the end of the resulting object so
the override's CSS declaration order is preserved.

### Conflict protection

Conflict protection still applies throughout the internal pipeline, before the
public style is merged:

```tsx
pipe(
  { margin: 0 },
  on("&.b", {
    marginTop: 8, // Type error: `margin` conflicts with `marginTop`.
  }),
  mergeStyles(styleProp),
);
```

A component's public `style` prop is typically typed as `CSSProperties`, so CSS
Hooks cannot know which properties it contains. Conflict protection therefore
does not cross that component boundary. Keep the component's internal styles
conflict-free, then treat the final merge as an intentional handoff to the
consumer.
