<div align="center">
  <a id="logomark" href="https://next.css-hooks.com"><img alt="CSS Hooks" src=".github/logomark.svg" height="128" /></a><br/><br/>
  <div id="wordmark">
    <a href="https://next.css-hooks.com#gh-light-mode-only"><img alt="CSS Hooks" src=".github/wordmark-dark.svg" width="256"></a>
    <a href="https://next.css-hooks.com#gh-dark-mode-only"><img alt="CSS Hooks" src=".github/wordmark-light.svg" width="256"></a>
  </div>
</div>

<br/>

<div align="center" id="badges">
  <a href="https://github.com/css-hooks/css-hooks/tree/v4.0.0-next.11"><img src="https://img.shields.io/badge/tag-v4.0.0--next.11-ffd700" alt="tag v4.0.0-next.11"></a>
  <a href="https://www.npmjs.com/package/@css-hooks/core/v/4.0.0-next.11"><img src="https://img.shields.io/badge/npm-v4.0.0--next.11-ffd700" alt="npm version"></a>
  <a href="https://github.com/css-hooks/css-hooks/blob/v4.0.0-next.11/LICENSE"><img src="https://img.shields.io/badge/license-MIT-ffd700" alt="license"></a>
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

| <img src="https://dl.svgcdn.com/svg/logos/react.svg" alt="React" width="24" height="24" /><br/>React | <img src="https://dl.svgcdn.com/svg/logos/preact.svg" alt="Preact" width="24" height="24" /><br/>Preact | <img src="https://dl.svgcdn.com/svg/logos/solidjs-icon.svg" alt="Solid" width="24" height="24" /><br/>Solid | <img src="https://dl.svgcdn.com/svg/logos/qwik-icon.svg" alt="Qwik" width="24" height="24" /><br/>Qwik |
| :--------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: |
|                                                  ✅                                                  |                                                   ✅                                                    |                                                     ✅                                                      |                                                   ✅                                                   |

### Browser support

| <img src="https://dl.svgcdn.com/svg/logos/chrome.svg" alt="Chrome" width="24" height="24" /><br/>Chrome | <img src="https://dl.svgcdn.com/svg/logos/microsoft-edge.svg" alt="Edge" width="24" height="24" /><br/>Edge | <img src="https://dl.svgcdn.com/svg/logos/safari.svg" alt="Safari" width="24" height="24" /><br/>Safari | <img src="https://dl.svgcdn.com/svg/logos/firefox.svg" alt="Firefox" width="24" height="24" /><br/>Firefox | <img src="https://dl.svgcdn.com/svg/logos/opera.svg" alt="Opera" width="24" height="24" /><br/>Opera |
| :-----------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------: |
|                                                   99+                                                   |                                                     99+                                                     |                                                  15.4+                                                  |                                                    97+                                                     |                                                 85+                                                  |

## Documentation

Please visit [css-hooks.com](https://css-hooks.com) to get started.

## Contributing

Contributions are welcome. Please see the
[contributing guidelines](CONTRIBUTING.md) for more information.

## License

CSS Hooks is offered under the [MIT license](LICENSE).
