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

### Function composition utilities

The CSS Hooks API leans on _function composition_ to deliver an inline style
syntax that reads like CSS rulesets. Its design leverages two generic function
composition utilities that are fundamental in functional programming and widely
available across various utility libraries.

| Library                                                                  | Apply transforms                                                                      | Compose transforms                                                            |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [remeda](https://remedajs.com/)                                          | [`pipe`](https://remedajs.com/docs/#pipe)                                             | [`piped`](https://remedajs.com/docs/#piped)                                   |
| [ts-belt](https://mobily.github.io/ts-belt/)                             | [`pipe`](https://mobily.github.io/ts-belt/api/pipe-flow#pipe)                         | [`flow`](https://mobily.github.io/ts-belt/api/pipe-flow#flow)                 |
| [effect](https://effect.website/)                                        | [`pipe`](https://effect.website/docs/v3/api/effect/Function#pipe)                     | [`flow`](https://effect.website/docs/v3/api/effect/Function#flow)             |
| [fp-ts](https://gcanti.github.io/fp-ts/)                                 | [`pipe`](https://gcanti.github.io/fp-ts/modules/function.ts.html#pipe)                | [`flow`](https://gcanti.github.io/fp-ts/modules/function.ts.html#flow)        |
| [ts-functional-pipe](https://biggyspender.github.io/ts-functional-pipe/) | [`pipeInto`](https://biggyspender.github.io/ts-functional-pipe/modules.html#pipeInto) | [`pipe`](https://biggyspender.github.io/ts-functional-pipe/modules.html#pipe) |
| No dependency                                                            | [`pipe`][pipe-implementation]                                                         | [`flow`][flow-implementation]                                                 |

[pipe-implementation]:
  https://www.typescriptlang.org/play/?#code/GYVwdgxgLglg9mABABxsgpgHgIIBpEBCAfABQCGAXInosGQEZXkBOA5ldgJSIC8RhnKgQDcAKFCRYCFGiw0C+AMKlK1fHUaIW7atz6F19CEzJshe-osGJFYidHhJUGHPgU38AERUd1DE2a6vPzuwEYBOgQWHrQQACYRVFbBiJ7WnnbgDtLOcm5KXvgAoj5qtP5apjpcKaHhlYFRKYrq8Yk20Z7qcejtaSlF1kWZko4yLvIFqcX4AGKlNBrtNfp1xg2R0S2xCRtJnd29e6nRRerowO2DKbPWsyPZTrKuBjFdiGeIs-gA4gt+mm0HGia3aTX022AbWOyX072APT6p3Ol2O13031owB0QK+0R+1h+DykTwm+TeMy+v3wAAl-uVAVVgbVDOtceDLK1drjYfx4Yjjv19J9gBcrtFMcBse1bikfupWAALdoElI06w04ljXIvdzbd6fTHyxA0-AASXpS2OKxCrLBWy57V501oAtxQv4IrFaIl6mlx1l+mN2OVx1V+lNtEVMHa6pSZusZq1OWekwpHzm1JN5vwAClLRVcTbXmE2UyBM1HTCDq6ju7kbRvbj0fxJf7cYH+MGlSropHgNHY9EzeoYAArdoJlK56y55OkvKvfWUo20nOIXP4ADSBcZgWLoOOHJiUO55ed-Lr5Y9GcbqObvqxOPLncQ3dDuPD-H7g+Ocf0I60OOk7RJutBjgA1u0M4pFu1hbvO4yLnqhS3qu2aIIBYFbvgAAyu7LCCdpHg6OxOjWCJXoEN5eve5YtlST4yviCofuWX4YQOMZ-sOo4TscU76GBwCQdB0Q4bQEEADbtHBKS4dYuGITqabLmhWaRlh254fgACyBHWkRtD1OypGnuRKSXkiAwouKNx+s+gSvu+vZquov64v+-CAcAwECaB6iiccMH6BJwDSbJ0S4eoUkALbtApKS6dYunKam5JqYaGnrthOmILp+AAHIGUWRmlvalZkdWlmHNZwq2T69lMQGLG0D2YZ9u53GebxQH8bign8MJQW4iF-BhRFxxyfo0W0HFCXRAVtCxWA7TJSkhXWIVaVkkuqFZW+a6YXm2mILNS2FfgADyJXlgexGmZV5nVXCtWCg2op0YEDFto5OjOaxrkRl1Q7xnxIHToFUHBeJ6iTbi038LNwDzcciX6EtwArWt0SXbQYBwO0m0pFd1hXTtyFTAamaHRhWmIBJ51Fdd+AAAq3fuZUmeWx6QtCPIUW614fU29GPlKf1UADbVsYEHE-t15ZecdfUQ0JUNibBcMyVNUUxfFaOLeo2PHOt+h48ABNE9EV3qHAyDtKTKSs9YrMU7qVMrtlKu5WdenM4gtuIKz+AAIoc9UXNlo0Zn8+egtUToNENQ+TUS8xcqAx1blRorgTKz5fkDQF4HQ6NsOSTrCN63NBu4uj-CYybuJm-wFtW8cxP6EHwD2470Qh7QyAAI7tC7KSh9Yofu6p+008amknQzeUXSzwdh-gABKEfMqsD087HZ6BBeb31jZd52RiDkZ0GWefp1uegwB4P+ZDpea6F2uRfJ+sLUlxurVNrjdQHdcRd34D3Puxwnb6EHsAEeY9oih3UMPZg7RJ4pE3tYTeM8Mpz0YgvHKp0maIDxkHQeyDECb3wAAZR3kEPexlo6bCenHY+Cc6qehTmLNO7YXytRDEDb8IMeJg1Vq-dW78YZa0rt-Gav9Db-2WoAluwD8aE07jbO2DtoED3UAg44499CUOAKg9B0RqG0GYAAZ3aFglINDrA0NwXtF0B1CE+2If7Uha8KFb1ofgAAKvQ+6TCKoQirALGqtZOG3k+pfVs18WqZxlkIziHkla9V8v1csg0Nwa2kZ-WRusf61z-hjABOMNogI0WArRtAoG4hgfwOBBjcRGP4CYsxxwMH6EscAGxdjog0PUNYqA7RHEpECdYQJYhxBZBJEhcgVBwAQQJgAdzAPgAAdLsy2tivgLMcAAbQALrWFWRspAABvUQiBEDMHQFAEAzAkD7O2Y8uIIAIDoBICQAAbmQKSIB0AgOiJbAFQKQWcHwGQTgYgAC+QA
[flow-implementation]:
  https://www.typescriptlang.org/play/?#code/GYVwdgxgLglg9mABMANnA7gHgIIBpEBCAfABTACGARgFyInkBOA5rdgJSIC8Rhbt9rDt0IBuAFChIsBMjRY8hfAGFSFGnUYtE7LjwL5glCP020CQnkr4bBuxEvGTo8JKgw58++-gAiqqibMtsJehsYaQbx2SgYQACaBWlZ2PtYC2haIPo7gzjJu8p7KvvgAov7q9JE6IQZGiWaZMcjxDfaZPgZxAKZtqXalaeTBPKU5Ui6y7gpezZ2IpfgAYhVtNXp14VVa5tGxCRFJHV29h7T9wovI3cBtg3ZLQyOIS+N5rnIeit5ZZcv4AHFVmcMnZQvUQbthM1gK0QclhPNgD0+pkrsAbndMksDMAtNtaI87ACnqDhAC3tIPtMij95lccYgAfgABLAglkjbICEcqGWfZtBE8JEokEXUYGTEg+7CRnAPFtInkgxMAAWbRJdhZpPWiBZlMmBS+sxKC3+TNZ+AAkuzTJzvmE2nyfrCDhyhb9kKKOeKzddbtLsbj8XalTxmcg1RrMiyDKqYG1tXYrTrMlaDflPjNip6GYDLYgrfgAFK26qZcFbO3OmFw93HL2nH1oyUBjkynhyhUgsMWyPqkGa4Sx5DxxNpgwwABWbRTdmLqfnGephW+cz+L3zeutJfwAGky1pdZWnU0BfCG8im3bfeipe2g8huxzexG8QOOUOeCPgGOQUnhCLZBp1nTJiwMKcAGs2gXOw90XYQ92XKZVxNXNzQjEcgPAxA93wAAZQ9nhPSEzxaN07Q9EVr0iW9WyxB5g0VTI3yjQcYzjBN-wnYCZxBOdhBw4AoJgzI8OQSCUDaeC7HwhCeHw5CjWzOkN0ZTCd0QHDxPw-AAFkiPtEjeTI11BUvb0bxbf0GNlJiexYlUPztL9t1HLiOQAnggOAED+LAiDoJBWDEIMSTpMyXTZAAWzaOS7D0+TED0pSs1pdc-XUgtsP3Aj9PwAA5Qzj02U89nI8yUhOVEBnowNGKfENIlfJzoy1Tjx2TSc+I5ASeCEkTgrEsKpJBGThCi1BYpBeLhD0gxorANpErsAqkoK1KaTXU08z7LDd1wvLksK-AAHliorUrSPKsyLyqxsasuOqHwa+Umq0Fr+za4cOu4rreNA+dAtEuCRoi2SDBQaaOVmnh5uQRblsyAqDDAOA2jWuxTqS07NtQnN6Qw7KDp0-LEBRxBTvwAAFC6wSukybrrSiLJorQ6Js+q7Ma5jiVa9j2vczrAO6wHBOBobQYk0aOXGhTIehu1YeOhGlpBFbhAp4A0YxzIqeQOAAAc2mxuxqaS6m8eNAm1K3fatNyxAovhin9ep-AAEU6dqbkq0iGtz3re6r0eiVOZe7m3t55UvoFn6hb+kWAf8oHkEGjkQp4cTgHCsbIoVuLMnh4BEfV5HUfRkFMeEfXgCNk3Mnd5BDYARzac27A9pKPatlSMt2jTCxJo6XbOmnPfwAAlb2uUda7oUDlng8s2jrIxNs7Q7TceYcvnY8-DiE88njfJ6u0+odtOgoz4bpfBiaC5mouFrVjkNZ4LWdarvWDHrkFTeEE3YArd26ZA9gYFuDA2hdzsJPJKk9e7pR2kTNyOVDpOzJq7ceiBwGIEnvgAAyjPB0PJqymWZpEKi1UxRr3vJvR8Udd4x3fN9b8v1j7-VPmLfqEsb5SxzjLO0csMExULglF+SNVoV11ljX+xt-6NwMCAkEHdhC4OAJA6BmR8HIAYAAZzaHAuwBCkoEMQdtdC29B5oNJirLBiAm64J0QQ-AAAVYhxkyFMwopQ1moc-Tr1sp2eyL5HL7xcofX8Hk7ReSHsnXqAUr4g1CnfPOENRFP3EarSRmtpHf1kQbeRHIAE8CAcojkqieDqM0SCGBwgdHAH0YYzILjkB6KgG0ExdhXFJVceICQuQqQoRIAAOjGdrAxLxBkuAANoAF0OAAG8xCIEQAwboUAQAMFcNMmQ6RwCQTRugMA1gDlHKQMs1Zqz1mbO2cgMAeiRnrLiCACA3QSAkAAG7kBQCAboqNMjay+T8v5bB8DkDYOIVZABfcQ0KgA

If you prefer not to add a third-party dependency, copy the _No dependency_
implementations into your codebase.

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
