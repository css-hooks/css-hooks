<p align="center">
  <!-- npm-remove -->
  <a href="https://css-hooks.com/#gh-dark-mode-only" target="_blank">
    <img alt="CSS Hooks" src="https://raw.githubusercontent.com/css-hooks/css-hooks/HEAD/.github/logo-dark.svg" width="310" height="64" style="max-width: 100%;">
  </a>
  <!-- /npm-remove -->
  <a href="https://css-hooks.com/#gh-light-mode-only" target="_blank">
    <img alt="CSS Hooks" src="https://raw.githubusercontent.com/css-hooks/css-hooks/HEAD/.github/logo-light.svg" width="310" height="64" style="max-width: 100%;">
  </a>
</p>

<p align="center">
  <a href="https://github.com/css-hooks/css-hooks/actions/workflows/build.yml"><img src="https://img.shields.io/github/actions/workflow/status/css-hooks/css-hooks/build.yml?branch=master" alt="Build Status"></a>
  <a href="https://www.npmjs.com/org/css-hooks"><img src="https://img.shields.io/npm/v/@css-hooks%2Fcore.svg" alt="Latest Release"></a>
  <a href="https://github.com/css-hooks/css-hooks/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/css-hooks.svg" alt="License"></a>
</p>

---

## Overview

Hooks add CSS features to native inline styles, enabling you to apply styles
conditionally based on pseudo-classes, custom selectors, media queries, and
more—all without leaving the `style` prop. By exploiting the hidden
programmability of CSS Variables, CSS Hooks delivers a flexible CSS-in-JS
experience without runtime style injection or build steps.

## Feature highlights

### Pseudo-classes

```jsx
<button
  style={css({
    background: "#004982",
    color: "#eeeff0",
    on: $ => [
      $("&:hover", {
        background: "#1b659c",
      }),
      $("&:active", {
        background: "#9f3131",
      }),
    ],
  })}
>
  Save changes
</button>
```

### Selectors

```jsx
<label>
  <input type="checkbox" checked />
  <span
    style={css({
      on: $ => [
        $(":checked + &", {
          textDecoration: "line-through",
        }),
      ],
    })}
  >
    Simplify CSS architecture
  </span>
</label>
```

### Responsive design

```jsx
<>
  <span
    style={css({
      on: ($, { not }) => [
        $(not("@container sm"), {
          display: "none",
        }),
      ],
    })}
  >
    sm
  </span>
  <span
    style={css({
      on: ($, { not }) => [
        $(not("@container lg"), {
          display: "none",
        }),
      ],
    })}
  >
    lg
  </span>
</>
```

## Documentation

Please visit [css-hooks.com](https://css-hooks.com) to get started.

## Contributing

Contributions are welcome. Please see the
[contributing guidelines](CONTRIBUTING.md) for more information.

## License

CSS Hooks is offered under the [MIT license](LICENSE).
