---
title: Setup
description: Add CSS Hooks to your project.
order: 3
---

# Setup

Setting up CSS Hooks is quick and easy, but may vary slightly depending on your
project. This guide gives a general overview. For more specific examples, check
the [Quickstart](../quickstart/index.md) section.

## Installation

First, install the appropriate framework integration package for your project,
e.g.

```bash
npm install @css-hooks/react
```

Available options are:

- `@css-hooks/react`
- `@css-hooks/preact`
- `@css-hooks/solid`
- `@css-hooks/qwik`

If you're using a different framework, you can simply install the core package:

```bash
npm install @css-hooks/core
```

### Pipeline function

You'll also need a generic pipeline utility function, like one of these:

- `pipe` from [Remeda](https://remedajs.com/docs/#pipe)
- `pipe` from
  [fp-ts](https://gcanti.github.io/fp-ts/modules/function.ts.html#pipe)
- `pipeInto` from
  [ts-functional-pipe](https://biggyspender.github.io/ts-functional-pipe/modules.html#pipeInto)

Alternatively, if you prefer not to install a third-party library, you can
simply copy
[this implementation](https://www.typescriptlang.org/play/?#code/GYVwdgxgLglg9mABABxsgpgHgIIBpEBCAfABQCGAXInosGQEZXkBOA5ldgJSIC8RhnKgQDcAKFCRYCFGiw0C+AMKlK1fHUaIW7atz6F19CEzJshe-osGJFYidHhJUGHPgU38AERUd1DE2a6vPzuwEYBOgQWHrQQACYRVFbBiJ7WnnbgDtLOcm5KXvgAoj5qtP5apjpcKaHhlYFRKYrq8Yk20Z7qcejtaSlF1kWZko4yLvIFqcX4AGKlNBrtNfp1xg2R0S2xCRtJnd29e6nRRerowO2DKbPWsyPZTrKuBjFdiGeIs-gA4gt+mm0HGia3aTX022AbWOyX072APT6p3Ol2O13031owB0QK+0R+1h+DykTwm+TeMy+v3wAAl-uVAVVgbVDOtceDLK1drjYfx4Yjjv19J9gBcrtFMcBse1bikfupWAALdoElI06w04ljXIvdzbd6fTHyxA0-AASXpS2OKxCrLBWy57V501oAtxQv4IrFaIl6mlx1l+mN2OVx1V+lNtEVMHa6pSZusZq1OWekwpHzm1JN5vwAClLRVcTbXmE2UyBM1HTCDq6ju7kbRvbj0fxJf7cYH+MGlSropHgNHY9EzeoYAArdoJlK56y55OkvKvfWUo20nOIXP4ADSBcZgWLoOOHJiUO55ed-Lr5Y9GcbqObvqxOPLncQ3dDuPD-H7g+Ocf0I60OOk7RJutBjgA1u0M4pFu1hbvO4yLnqhS3qu2aIIBYFbvgAAyu7LCCdpHg6OxOjWCJXoEN5eve5YtlST4yviCofuWX4YQOMZ-sOo4TscU76GBwCQdB0Q4bQEEADbtHBKS4dYuGITqabLmhWaRlh254fgACyBHWkRtD1OypGnuRKSXkiAwouKNx+s+gSvu+vZquov64v+-CAcAwECaB6iiccMH6BJwDSbJ0S4eoUkALbtApKS6dYunKam5JqYaGnrthOmILp+AAHIGUWRmlvalZkdWlmHNZwq2T69lMQGLG0D2YZ9u53GebxQH8bign8MJQW4iF-BhRFxxyfo0W0HFCXRAVtCxWA7TJSkhXWIVaVkkuqFZW+a6YXm2mILNS2FfgADyJXlgexGmZV5nVXCtWCg2op0YEDFto5OjOaxrkRl1Q7xnxIHToFUHBeJ6iTbi038LNwDzcciX6EtwArWt0SXbQYBwO0m0pFd1hXTtyFTAamaHRhWmIBJ51Fdd+AAAq3fuZUmeWx6QtCPIUW614fU29GPlKf1UADbVsYEHE-t15ZecdfUQ0JUNibBcMyVNUUxfFaOLeo2PHOt+h48ABNE9EV3qHAyDtKTKSs9YrMU7qVMrtlKu5WdenM4gtuIKz+AAIoc9UXNlo0Zn8+egtUToNENQ+TUS8xcqAx1blRorgTKz5fkDQF4HQ6NsOSTrCN63NBu4uj-CYybuJm-wFtW8cxP6EHwD2470Qh7QyAAI7tC7KSh9Yofu6p+008amknQzeUXSzwdh-gABKEfMqsD087HZ6BBeb31jZd52RiDkZ0GWefp1uegwB4P+ZDpea6F2uRfJ+sLUlxurVNrjdQHdcRd34D3Puxwnb6EHsAEeY9oih3UMPZg7RJ4pE3tYTeM8Mpz0YgvHKp0maIDxkHQeyDECb3wAAZR3kEPexlo6bCenHY+Cc6qehTmLNO7YXytRDEDb8IMeJg1Vq-dW78YZa0rt-Gav9Db-2WoAluwD8aE07jbO2DtoED3UAg44499CUOAKg9B0RqG0GYAAZ3aFglINDrA0NwXtF0B1CE+2If7Uha8KFb1ofgAAKvQ+6TCKoQirALGqtZOG3k+pfVs18WqZxlkIziHkla9V8v1csg0Nwa2kZ-WRusf61z-hjABOMNogI0WArRtAoG4hgfwOBBjcRGP4CYsxxwMH6EscAGxdjog0PUNYqA7RHEpECdYQJYhxBZBJEhcgVBwAQQJgAdzAPgAAdLsy2tivgLMcAAbQALrWFWRspAABvUQiBEDMHQFAEAzAkD7O2Y8uIIAIDoBICQAAbmQKSIB0AgOiJbAFQKQWcHwGQTgYgAC+QA)
of a `pipe` function.

## The `css.ts` module

Next, create a module to configure CSS Hooks. A common file path is
`src/css.ts`.

### Obtaining `createHooks`

<details open>
<summary>From a framework integration package</summary>

If you're using a framework integration package like `@css-hooks/react`, you can
simply import `createHooks`:

```typescript
// src/css.ts

import { createHooks } from "@css-hooks/react";
```

</details>

<details>
<summary>From the core package</summary>

If you're using the core package, create a `createHooks` function:

```typescript
// src/css.ts

import { buildHooksSystem } from "@css-hooks/core";

const createHooks = buildHooksSystem();
```

For extra type safety, you can integrate
[csstype](https://www.npmjs.com/package/csstype) by passing a generic argument:

```typescript
// src/css.ts

import { buildHooksSystem } from "@css-hooks/core";
import type * as CSS from "csstype";

const createHooks = buildHooksSystem<CSS.Properties>();
```

For custom value conversion (e.g. adding `px` to numbers), pass a callback:

```typescript
// src/css.ts

import { buildHooksSystem } from "@css-hooks/core";
import type * as CSS from "csstype";
import { isUnitlessNumber } from "unitless";

const createHooks = buildHooksSystem<CSS.Properties<string | number>>(
  (value, propertyName) => {
    switch (typeof value) {
      case "string":
        return value;
      case "number":
        return isUnitlessNumber(propertyName) ? `${value}` : `${value}px`;
      default:
        return null; // return null when the value can't be stringified
    }
  },
);
```

</details>

### Creating hooks

Once you have `createHooks`, use it to generate and export the `on`, `and`,
`or`, `not`, and `styleSheet` functions:

```typescript
// src/css.ts

import { createHooks } from "@css-hooks/react";

export const { on, and, or, not, styleSheet } = createHooks(
  "@media (min-width: 1000px)",
  "&:hover",
  /* additional hooks */
);
```

Please see the [Configuration](../configuration/index.md) guide for more details
about the syntax used to create hooks.

## Adding the style sheet

Add the generated style sheet to your app. For example, in your `App` component:

```diff
// src/app.tsx

import { styleSheet } from "./css";

export function App() {
-  return <HomePage />;
+  return (
+    <>
+      <style dangerouslySetInnerHTML={{ __html: styleSheet() }} />
+      <HomePage />
+    </>
+  );
}
```

<!-- prettier-ignore-start -->
> [!NOTE]
> Despite the name, React's `dangerouslySetInnerHTML` prop is safe to use for
> _trusted_ content.
<!-- prettier-ignore-end -->

## Ready to use

Now you're all set to use conditional styles in your components. Proceed to the
[Usage](../usage/index.md) guide to learn how.
