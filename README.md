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
  <a href="https://github.com/css-hooks/css-hooks/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/css-hooks/css-hooks/ci.yml?branch=master" alt="Build Status"></a>
  <a href="https://www.npmjs.com/org/css-hooks"><img src="https://img.shields.io/npm/v/@css-hooks%2Fcore.svg" alt="Latest Release"></a>
  <a href="https://github.com/css-hooks/css-hooks/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/css-hooks.svg" alt="License"></a>
</p>

---

## Overview

Hooks bring CSS features to native inline styles, enabling you to target various
states such as hover, focus, and active, all without leaving the `style` prop.
For example, hooks can easily solve the common use case of applying state-driven
styles to a link:

```jsx
<a
  href="https://css-hooks.com/"
  style={hooks({
    color: "#03f",
    hover: {
      color: "#09f",
    },
    active: {
      color: "#e33",
    },
  })}
>
  Hooks
</a>
```

Notably, the `hooks` function is pure. It simply returns a flat style object
that is compatible with the `style` prop, creating dynamic property values that
change under various conditions through CSS variables.

## Documentation

Please visit [css-hooks.com](https://css-hooks.com) to get started.

## Packages

- [@css-hooks/react](packages/react): React framework integration
- [@css-hooks/solid](packages/solid): Solid framework integration
- [@css-hooks/preact](packages/preact): Preact framework integration
- [@css-hooks/core](packages/core): Core package (internal / advanced use cases)

## Contributing

Contributions are welcome. Please see the
[contributing guidelines](CONTRIBUTING.md) for more information.

## License

CSS Hooks is offered under the [MIT license](LICENSE).
