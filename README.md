<div align="center">
  <a id="logomark" href="https://next.css-hooks.com"><img alt="CSS Hooks" src=".github/logomark.svg" height="128" /></a><br/><br/>
  <div id="wordmark">
    <a href="https://next.css-hooks.com#gh-light-mode-only"><img alt="CSS Hooks" src=".github/wordmark-dark.svg" width="256"></a>
    <a href="https://next.css-hooks.com#gh-dark-mode-only"><img alt="CSS Hooks" src=".github/wordmark-light.svg" width="256"></a>
  </div>
</div>

<br/>

<div align="center" id="badges">
  <a href="https://github.com/css-hooks/css-hooks/tree/v3.1.0-next.2"><img src="https://img.shields.io/badge/tag-v3.1.0--next.2-ffd700" alt="tag v3.1.0-next.2"></a>
  <a href="https://www.npmjs.com/package/@css-hooks/core/v/3.1.0-next.2"><img src="https://img.shields.io/badge/npm-v3.1.0--next.2-ffd700" alt="npm version"></a>
  <a href="https://github.com/css-hooks/css-hooks/blob/v3.1.0-next.2/LICENSE"><img src="https://img.shields.io/badge/license-MIT-ffd700" alt="license"></a>
</div>

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
  style={pipe(
    {
      background: "#004982",
      color: "#eeeff0",
    },
    on("&:hover", {
      background: "#1b659c",
    }),
    on("&:active", {
      background: "#9f3131",
    }),
  )}
>
  Save changes
</button>
```

### Selectors

```jsx
<label>
  <input type="checkbox" checked />
  <span
    style={pipe(
      {},
      on(":checked + &", {
        textDecoration: "line-through",
      }),
    )}
  >
    Simplify CSS architecture
  </span>
</label>
```

### Responsive design

```jsx
<>
  <span
    style={pipe(
      {},
      on(not("@container (width < 400px)"), {
        display: "none",
      }),
    )}
  >
    sm
  </span>
  <span
    style={pipe(
      {},
      on("@container (width < 400px)", {
        display: "none",
      }),
    )}
  >
    lg
  </span>
</>
```

## Compatibility

### Framework integrations

| <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" width="24" height="24" /><br/>React | <img src="https://github.com/preactjs.png" alt="Preact" width="24" height="24" /><br/>Preact | <img src="https://github.com/solidjs.png" alt="Solid" width="24" heght="24" /><br/>Solid  | <img src="https://github.com/qwikdev.png" alt="Qwik" width="24" height="24" /><br/>Qwik  |
| ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| <div align="center"><a href="https://www.npmjs.com/package/@css-hooks/react">✅</a></div>                                     | <div align="center"><a href="https://www.npmjs.com/package/@css-hooks/preact">✅</a></div>   | <div align="center"><a href="https://www.npmjs.com/package/@css-hooks/solid">✅</a></div> | <div align="center"><a href="https://www.npmjs.com/package/@css-hooks/qwik">✅</a></div> |

### Browser support

| <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/chrome/chrome_24x24.png" alt="Chrome" /><br/>Chrome | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/edge/edge_24x24.png" alt="Edge" /><br/>Edge | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/safari/safari_24x24.png" alt="Safari" /><br/>Safari | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/firefox/firefox_24x24.png" alt="Firefox" /><br/>Firefox | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/opera/opera_24x24.png" alt="Opera" /><br/>Opera |
| ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| <div align="center">99+</div>                                                                                             | <div align="center">99+</div>                                                                                     | <div align="center">15.4+</div>                                                                                           | <div align="center">97+</div>                                                                                                 | <div align="center">85+</div>                                                                                         |

## Documentation

Please visit [css-hooks.com](https://css-hooks.com) to get started.

## Contributing

Contributions are welcome. Please see the
[contributing guidelines](CONTRIBUTING.md) for more information.

## License

CSS Hooks is offered under the [MIT license](LICENSE).
