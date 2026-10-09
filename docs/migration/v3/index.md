---
title: v3
description: Upgrading your app from v2 to v3
order: 1
hidden: true
---

# Migrating to v3

CSS Hooks v3 simplifies how applications declare hooks and apply conditional
styles. This guide explains how to migrate a v2 application. You will update the
exports from `createHooks`, replace the configuration object with hook values,
define reusable conditions, and replace `css` calls with a pipeline function.

Before you begin, identify your `createHooks` call, any globally defined complex
hooks, and every use of the v2 `css` function. Choose a pipeline implementation
before updating inline styles. After the migration, your application will use
the smaller v3 API while preserving its existing conditions and style order.

## New exports

In v2, the return value of `createHooks` included a `css` function. In v3, `on`
replaces `css`, and `and`, `or`, and `not` construct complex conditions. Export
these functions from your `css.ts` module.

**Before**

```typescript
// src/css.ts

export const { styleSheet, css } = createHooks(/* ... */);
```

**After**

```typescript
// src/css.ts

export const { styleSheet, on, and, or, not } = createHooks(/* ... */);
```

Keep exporting `styleSheet`. Components will import `on` and the condition
functions they use instead of importing `css`.

## Simplified initialization

In v2, `createHooks` accepted a configuration object that contained a hook map
and several options. The v3 `on` function has a smaller scope than the `css`
function it replaces, so v3 removes those configuration options.

The initialization API changes in two ways:

- Pass hook strings directly to `createHooks`; v3 does not use aliases.
- Define complex conditions with `and`, `or`, and `not` instead of defining them
  in the `createHooks` configuration.

Complete these steps:

1. Replace the configuration object with the _values_ of the existing `hooks`
   object.
2. Replace each reference to a simple v2 alias with its corresponding hook
   string. For example, replace `$("hover", styles)` with
   `on("&:hover", styles)`.
3. Replace each complex hook with the individual hook strings that compose it.

**Before**

```typescript
// src/css.ts

export const {/* ... */} = createHooks({
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

**After**

```typescript
// src/css.ts

export const {/* ... */} = createHooks("&:hover", "&:focus");
```

The v3 call declares `&:hover` and `&:focus` directly. It omits the v2 aliases,
sorting options, fallback option, and debug option.

## Defining reusable conditions

Replace each globally defined complex v2 hook with a condition created by `and`,
`or`, or `not`. Export the condition from your `css.ts` module so that
components can reuse it.

**Example**

```typescript
// src/css.ts

export const intent = or("&:hover", "&:focus");
```

The `intent` export preserves the v2 `&:intent` condition without declaring an
alias. Components can pass `intent` to `on`.

## Pipeline function

The v3 API uses a pipeline function to apply conditional style transforms in
order. Use a pipeline function from a utility library such as:

- `pipe` from [Remeda](https://remedajs.com/docs/#pipe)
- `pipe` from
  [fp-ts](https://gcanti.github.io/fp-ts/modules/function.ts.html#pipe)
- `pipeInto` from
  [ts-functional-pipe](https://biggyspender.github.io/ts-functional-pipe/modules.html#pipeInto)

If you do not want to install a third-party library, copy
[this implementation](https://www.typescriptlang.org/play/?#code/GYVwdgxgLglg9mABABxsgpgHgIIBpEBCAfABQCGAXInosGQEZXkBOA5ldgJSIC8RhnKgQDcAKFCRYCFGiw0C+AMKlK1fHUaIW7atz6F19CEzJshe-osGJFYidHhJUGHPgU38AERUd1DE2a6vPzuwEYBOgQWHrQQACYRVFbBiJ7WnnbgDtLOcm5KXvgAoj5qtP5apjpcKaHhlYFRKYrq8Yk20Z7qcejtaSlF1kWZko4yLvIFqcX4AGKlNBrtNfp1xg2R0S2xCRtJnd29e6nRRerowO2DKbPWsyPZTrKuBjFdiGeIs-gA4gt+mm0HGia3aTX022AbWOyX072APT6p3Ol2O13031owB0QK+0R+1h+DykTwm+TeMy+v3wAAl-uVAVVgbVDOtceDLK1drjYfx4Yjjv19J9gBcrtFMcBse1bikfupWAALdoElI06w04ljXIvdzbd6fTHyxA0-AASXpS2OKxCrLBWy57V501oAtxQv4IrFaIl6mlx1l+mN2OVx1V+lNtEVMHa6pSZusZq1OWekwpHzm1JN5vwAClLRVcTbXmE2UyBM1HTCDq6ju7kbRvbj0fxJf7cYH+MGlSropHgNHY9EzeoYAArdoJlK56y55OkvKvfWUo20nOIXP4ADSBcZgWLoOOHJiUO55ed-Lr5Y9GcbqObvqxOPLncQ3dDuPD-H7g+Ocf0I60OOk7RJutBjgA1u0M4pFu1hbvO4yLnqhS3qu2aIIBYFbvgAAyu7LCCdpHg6OxOjWCJXoEN5eve5YtlST4yviCofuWX4YQOMZ-sOo4TscU76GBwCQdB0Q4bQEEADbtHBKS4dYuGITqabLmhWaRlh254fgACyBHWkRtD1OypGnuRKSXkiAwouKNx+s+gSvu+vZquov64v+-CAcAwECaB6iiccMH6BJwDSbJ0S4eoUkALbtApKS6dYunKam5JqYaGnrthOmILp+AAHIGUWRmlvalZkdWlmHNZwq2T69lMQGLG0D2YZ9u53GebxQH8bign8MJQW4iF-BhRFxxyfo0W0HFCXRAVtCxWA7TJSkhXWIVaVkkuqFZW+a6YXm2mILNS2FfgADyJXlgexGmZV5nVXCtWCg2op0YEDFto5OjOaxrkRl1Q7xnxIHToFUHBeJ6iTbi038LNwDzcciX6EtwArWt0SXbQYBwO0m0pFd1hXTtyFTAamaHRhWmIBJ51Fdd+AAAq3fuZUmeWx6QtCPIUW614fU29GPlKf1UADbVsYEHE-t15ZecdfUQ0JUNibBcMyVNUUxfFaOLeo2PHOt+h48ABNE9EV3qHAyDtKTKSs9YrMU7qVMrtlKu5WdenM4gtuIKz+AAIoc9UXNlo0Zn8+egtUToNENQ+TUS8xcqAx1blRorgTKz5fkDQF4HQ6NsOSTrCN63NBu4uj-CYybuJm-wFtW8cxP6EHwD2470Qh7QyAAI7tC7KSh9Yofu6p+008amknQzeUXSzwdh-gABKEfMqsD087HZ6BBeb31jZd52RiDkZ0GWefp1uegwB4P+ZDpea6F2uRfJ+sLUlxurVNrjdQHdcRd34D3Puxwnb6EHsAEeY9oih3UMPZg7RJ4pE3tYTeM8Mpz0YgvHKp0maIDxkHQeyDECb3wAAZR3kEPexlo6bCenHY+Cc6qehTmLNO7YXytRDEDb8IMeJg1Vq-dW78YZa0rt-Gav9Db-2WoAluwD8aE07jbO2DtoED3UAg44499CUOAKg9B0RqG0GYAAZ3aFglINDrA0NwXtF0B1CE+2If7Uha8KFb1ofgAAKvQ+6TCKoQirALGqtZOG3k+pfVs18WqZxlkIziHkla9V8v1csg0Nwa2kZ-WRusf61z-hjABOMNogI0WArRtAoG4hgfwOBBjcRGP4CYsxxwMH6EscAGxdjog0PUNYqA7RHEpECdYQJYhxBZBJEhcgVBwAQQJgAdzAPgAAdLsy2tivgLMcAAbQALrWFWRspAABvUQiBEDMHQFAEAzAkD7O2Y8uIIAIDoBICQAAbmQKSIB0AgOiJbAFQKQWcHwGQTgYgAC+QA)
of a `pipe` function.

The pipeline must pass the base style object through each `on` transform from
left to right. Keep that order when you migrate each `css` call.

## Updating inline styles

Update each inline style that uses the v2 `css` function:

1. Replace `css` with [`pipe`](#pipeline-function).
2. Move the `on` array's contents outside of the style object and pass them as
   additional inputs to `pipe` after the style object.
3. Remove the `on` field from the style object.
4. Update `$` function calls to use the new function `on`.
5. Import `on` from your `css.ts` module. Import `and`, `or`, and `not` when the
   style uses them.

**Before**

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

**After**

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

`pipe` starts with the base style object. Each `on` call then applies its color
override when its condition matches. Keeping the `on` calls in their original
array order preserves the v2 override order.

<!--prettier-ignore-start-->
> [!NOTE]
> Replace every reference to a v2 alias. Use the declared hook string for a
> simple alias. For a complex alias, use a
> <span> </span>[reusable condition](#defining-reusable-conditions) exported
> from your `css.ts` module.
<!--prettier-ignore-end-->
