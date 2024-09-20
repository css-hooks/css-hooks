---
title: v2 -> v3
description: Update your app to version 3 of CSS Hooks.
order: 1
---

# Migrating to v3

v3 introduces a simpler model for defining and using hooks, which is more
transparent, reduces syntax, and makes the library smaller and more efficient.
Let's dive in!

## New exports

Previously, the return value of `createHooks` included a `css` function. In v3
this is replaced by an `on` function, along with `and`, `or`, and `not`
functions for constructing complex conditions. Update your `css.ts` module to
export these new functions instead of `css`.

### Before

```typescript
// src/css.ts

export const { styleSheet, css } = createHooks(/* ... */);
```

### After

```typescript
// src/css.ts

export const { styleSheet, on, and, or, not } = createHooks(/* ... */);
```

## Simplified initialization

In v2, `createHooks` accepted a configuration object containing a map of hooks,
along with several options. The `on` function in v3 is smaller in scope than the
`css` function it replaces, making most of the configuration options redundant.

Key changes:

- Hooks are now identified by their selector logic, no longer using aliases.
- Complex conditions are defined using the `and`, `or`, and `not` functions
  instead of configuring them globally.

To migrate:

1. Replace the entire configuration object with the _values_ of the existing
   `hooks` object.
2. Since `createHooks` only accepts string values, replace any complex hooks
   with their individual components.

### Before

```typescript
// src/css.ts

export const {
  /* ... */
} = createHooks({
  hooks: ({ or }) => ({
    "&:hover": "&:hover",
    "&:intent": or("&:hover", "&:focus"),
  }),
  sort: {
    properties: true,
    conditionalStyles: true,
  },
  fallback: "revert-layer",
  debug: true,
});
```

### After

```typescript
// src/css.ts

export const {
  /* ... */
} = createHooks("&:hover", "&:focus");
```

## Defining reusable conditions

For globally-defined complex hooks (like the `&:intent` example in the previous
section), you can now use the `and`, `or`, and `not` functions to define them as
additional exports from your `css.ts` module.

### Example

```typescript
// src/css.ts

export const intent = or("&:hover", "&:focus");
```

## Pipeline function

The v3 API uses a pipeline function to apply conditional styles. This function
can be obtained from third-party utility libraries such as:

- `pipe` from [Remeda](https://remedajs.com/docs/#pipe)
- `pipe` from
  [fp-ts](https://gcanti.github.io/fp-ts/modules/function.ts.html#pipe)
- `pipeInto` from
  [ts-functional-pipe](https://biggyspender.github.io/ts-functional-pipe/modules.html#pipeInto)

Alternatively, if you prefer not to install a third-party library, you can
simply copy
[this implementation](https://www.typescriptlang.org/play/?#code/GYVwdgxgLglg9mABABxsgpgHgIIBpEBCAfABQCGAXInosGQEZXkBOA5ldgJSIC8RhnKgQDcAKFCRYCFGiw0C+AMKlK1fHUaIW7atz6F19CEzJshe-osGJFYidHhJUGHPgU38AERUd1DE2a6vPzuwEYBOgQWHrQQACYRVFbBiJ7WnnbgDtLOcm5KXvgAoj5qtP5apjpcKaHhlYFRKYrq8Yk20Z7qcejtaSlF1kWZko4yLvIFqcX4AGKlNBrtNfp1xg2R0S2xCRtJnd29e6nRRerowO2DKbPWsyPZTrKuBjFdiGeIs-gA4gt+mm0HGia3aTX022AbWOyX072APT6p3Ol2O13031owB0QK+0R+1h+DykTwm+TeMy+v3wAAl-uVAVVgbVDOtceDLK1drjYfx4Yjjv19J9gBcrtFMcBse1bikfupWAALdoElI06w04ljXIvdzbd6fTHyxA0-AASXpS2OKxCrLBWy57V501oAtxQv4IrFaIl6mlx1l+mN2OVx1V+lNtEVMHa6pSZusZq1OWekwpHzm1JN5vwAClLRVcTbXmE2UyBM1HTCDq6ju7kbRvbj0fxJf7cYH+MGlSropHgNHY9EzeoYAArdoJlK56y55OkvKvfWUo20nOIXP4ADSBcZgWLoOOHJiUO55ed-Lr5Y9GcbqObvqxOPLncQ3dDuPD-H7g+Ocf0I60OOk7RJutBjgA1u0M4pFu1hbvO4yLnqhS3qu2aIIBYFbvgAAyu7LCCdpHg6OxOjWCJXoEN5eve5YtlST4yviCofuWX4YQOMZ-sOo4TscU76GBwCQdB0Q4bQEEADbtHBKS4dYuGITqabLmhWaRlh254fgACyBHWkRtD1OypGnuRKSXkiAwouKNx+s+gSvu+vZquov64v+-CAcAwECaB6iiccMH6BJwDSbJ0S4eoUkALbtApKS6dYunKam5JqYaGnrthOmILp+AAHIGUWRmlvalZkdWlmHNZwq2T69lMQGLG0D2YZ9u53GebxQH8bign8MJQW4iF-BhRFxxyfo0W0HFCXRAVtCxWA7TJSkhXWIVaVkkuqFZW+a6YXm2mILNS2FfgADyJXlgexGmZV5nVXCtWCg2op0YEDFto5OjOaxrkRl1Q7xnxIHToFUHBeJ6iTbi038LNwDzcciX6EtwArWt0SXbQYBwO0m0pFd1hXTtyFTAamaHRhWmIBJ51Fdd+AAAq3fuZUmeWx6QtCPIUW614fU29GPlKf1UADbVsYEHE-t15ZecdfUQ0JUNibBcMyVNUUxfFaOLeo2PHOt+h48ABNE9EV3qHAyDtKTKSs9YrMU7qVMrtlKu5WdenM4gtuIKz+AAIoc9UXNlo0Zn8+egtUToNENQ+TUS8xcqAx1blRorgTKz5fkDQF4HQ6NsOSTrCN63NBu4uj-CYybuJm-wFtW8cxP6EHwD2470Qh7QyAAI7tC7KSh9Yofu6p+008amknQzeUXSzwdh-gABKEfMqsD087HZ6BBeb31jZd52RiDkZ0GWefp1uegwB4P+ZDpea6F2uRfJ+sLUlxurVNrjdQHdcRd34D3Puxwnb6EHsAEeY9oih3UMPZg7RJ4pE3tYTeM8Mpz0YgvHKp0maIDxkHQeyDECb3wAAZR3kEPexlo6bCenHY+Cc6qehTmLNO7YXytRDEDb8IMeJg1Vq-dW78YZa0rt-Gav9Db-2WoAluwD8aE07jbO2DtoED3UAg44499CUOAKg9B0RqG0GYAAZ3aFglINDrA0NwXtF0B1CE+2If7Uha8KFb1ofgAAKvQ+6TCKoQirALGqtZOG3k+pfVs18WqZxlkIziHkla9V8v1csg0Nwa2kZ-WRusf61z-hjABOMNogI0WArRtAoG4hgfwOBBjcRGP4CYsxxwMH6EscAGxdjog0PUNYqA7RHEpECdYQJYhxBZBJEhcgVBwAQQJgAdzAPgAAdLsy2tivgLMcAAbQALrWFWRspAABvUQiBEDMHQFAEAzAkD7O2Y8uIIAIDoBICQAAbmQKSIB0AgOiJbAFQKQWcHwGQTgYgAC+QA)
of a `pipe` function.

## Updating inline styles

Finally, update any inline styles that were previously defined using the `css`
function:

1. Replace `css` with [`pipe`](#pipeline-function).
2. Move the `on` array's contents outside of the style object and pass them as
   additional arguments to `pipe` after the style object.
3. Remove the `on` field from the style object.
4. Update `$` function calls to use the new function `on`.
5. Import `on` from your `css.ts` module along with `and`, `or`, and `not`
   functions as needed for complex conditions.

### Before

```jsx
import { css } from "./css";

function HelloWorld() {
  return (
    <button
      style={css({
        color: "black",
        on: ($, { or }) => [
          $(or("&:hover", "&:focus"), {
            color: "blue",
          }),
          $("&:active", {
            color: "red",
          }),
        ],
      })}
    >
      Hello World
    </button>
  );
}
```

### After

```jsx
import { pipe } from "remeda"; // or from fp-ts, etc.
import { on, or } from "./css";

function HelloWorld() {
  return (
    <button
      style={pipe(
        {
          color: "black",
        },
        on(or("&:hover", "&:focus"), {
          color: "blue",
        }),
        on("&:active", {
          color: "red",
        }),
      )}
    >
      Hello World
    </button>
  );
}
```

<!--prettier-ignore-start-->
> [!NOTE]
> If you had globally-defined complex hooks in v2, make sure to replace those references with the
> <span> </span>[reusable conditions](#defining-reusable-conditions)
> exported from your `css.ts` module.
<!--prettier-ignore-end-->
