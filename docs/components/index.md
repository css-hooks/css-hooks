---
title: Components
description: Guidance for building reusable components with CSS Hooks
order: 6
---

# Components

A component should encapsulate its styling implementation details, making it
easy to use and predictable for the consumer. With CSS Hooks, components can
share a small set of generic hooks while assigning local meaning based on their
own variants. Designing their public APIs means deciding which choices to expose
through explicit props and when to allow direct style overrides.

## Class selector hooks

Component styles often vary based on props or state. Instead of introducing a
new hook for each specific use case, declare a small set of generic
class-selector hooks:

```typescript
// src/css.ts

import { createHooks } from "@css-hooks/react";

export const { on, styleSheet } = createHooks("&.a", "&.b", "&.c");
```

These hooks have no fixed application-wide meaning. They act as reusable markers
whose meaning can be assigned locally in each component. For example, one
component can use `&.a` for a `"primary"` variant while another uses it for a
selected state. Within each component, name the classes according to their local
purpose:

```typescript
const primary = "a"; // class name used in the "&.a" hook
const danger = "b"; // class name used in the "&.b" hook
```

Apply the class when the variant is active, and then use its condition with the
`on` function. Use distinct classes for states that can vary independently on
the same element.

## Component API design

### Explicit props

Prefer explicit props for the variations a component intentionally supports.
Props make those variations discoverable and type-safe while letting the
component own their visual treatment. For example, a button can expose a
`variant` prop while limiting direct access to individual CSS properties.

The component can translate that prop into an internal class and compose its
styles with `mergeStyles`:

```tsx
import type { ComponentProps } from "react";
import { mergeStyles } from "@css-hooks/react";
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
      style={mergeStyles(
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

Each supported variant activates its corresponding class condition. The
`"primary"` variant produces a blue button, while the `"danger"` variant
produces a red button. The conditional styles remain in the style object instead
of JavaScript expressions.

### Style escape hatch

A public `style` prop can be useful for layout, integration, and one-off
customization that a component does not anticipate. It also lets consumers
override declarations outside the component's documented API, so expose it only
when that flexibility is appropriate.

To add this escape hatch to the `Button` component, expose the native `style`
prop. Then pass its value as the last `mergeStyles` argument to override the
component's internal styles:

```diff
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

       style={mergeStyles(
         // ...
         on(`&.${danger}`, {
           backgroundColor: "#a21d27",
           color: "white",
         }),
+        styleProp,
       )}
```

Input order determines priority, with each style object overriding previous
arguments. Thus, if the consumer style includes a property set internally, it
overrides the internal value (whether or not it is conditional). This makes the
`style` prop more predictable.

### Conflict protection

`mergeStyles` includes type-level protection against conflicting properties:

```tsx
mergeStyles(
  { margin: 0 },
  on("&.b", {
    marginTop: 8, // Type error: `margin` conflicts with `marginTop`.
  }),
  styleProp,
);
```

Because a component's `style` prop is usually typed as `CSSProperties`, the
compiler cannot know which specific properties will be passed. Conflict
protection therefore does not cross the component boundary. Keep the component's
internal styles conflict-free, then treat the final merge as an intentional
handoff to the consumer.
