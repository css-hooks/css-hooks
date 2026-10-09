<div align="center">
  <a id="logomark" href="https://next.css-hooks.com"><img alt="CSS Hooks" src=".github/logomark.svg" height="128" /></a><br/><br/>
  <div id="wordmark">
    <a href="https://next.css-hooks.com#gh-light-mode-only"><img alt="CSS Hooks" src=".github/wordmark-dark.svg" width="256"></a>
    <a href="https://next.css-hooks.com#gh-dark-mode-only"><img alt="CSS Hooks" src=".github/wordmark-light.svg" width="256"></a>
  </div>
</div>

<br/>

<div align="center" id="badges">
  <a href="https://github.com/css-hooks/css-hooks/tree/v4.0.0-next.62"><img src="https://img.shields.io/badge/tag-v4.0.0--next.62-ffd700" alt="tag v4.0.0-next.62"></a>
  <a href="https://www.npmjs.com/package/@css-hooks/core/v/4.0.0-next.62"><img src="https://img.shields.io/badge/npm-v4.0.0--next.62-ffd700" alt="npm version"></a>
  <a href="https://github.com/css-hooks/css-hooks/blob/v4.0.0-next.62/LICENSE"><img src="https://img.shields.io/badge/license-MIT-ffd700" alt="license"></a>
</div>

---

## Overview

**CSS power. Inline style simplicity.**

Respond to user interaction, layout context, and inherited state. All
CSS-driven. All without leaving the `style` prop. By exploiting the hidden
programmability of CSS Variables, CSS Hooks delivers flexible component-owned
styling without runtime style injection or build steps.

## Feature highlights

### User interaction

```jsx
<button
  style={mergeStyles(
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

### Layout context

```jsx
<span
  style={mergeStyles(
    { display: "none" },
    on("@container (width >= 50px)", {
      display: "revert-layer",
    }),
    on("@container (width >= 100px)", {
      display: "none",
    }),
  )}
>
  sm
</span>
<span
  style={mergeStyles(
    { display: "none" },
    on("@container (width >= 100px)", {
      display: "revert-layer",
    }),
  )}
>
  lg
</span>
```

### Inherited state

```jsx
<div style={mergeStyles({ padding: 24 }, on("&:hover", enable("%active")))}>
  Hover parent
  <span
    style={mergeStyles(
      { color: "gray" },
      on("%active", {
        color: "purple",
      }),
    )}
  >
    Child responds
  </span>
</div>
```

## Compatibility

### Frameworks

| <img src="https://cdn.jsdelivr.net/gh/gilbarbara/logos@37a6b807fd71c622efea27a9309b5d4edc792969/logos/react.svg" alt="React" width="24" height="24" /><br/>React | <img src="https://cdn.jsdelivr.net/gh/gilbarbara/logos@37a6b807fd71c622efea27a9309b5d4edc792969/logos/preact.svg" alt="Preact" width="24" height="24" /><br/>Preact | <img src="https://cdn.jsdelivr.net/gh/gilbarbara/logos@37a6b807fd71c622efea27a9309b5d4edc792969/logos/solidjs-icon.svg" alt="Solid" width="24" height="24" /><br/>Solid | <img src="https://cdn.jsdelivr.net/gh/gilbarbara/logos@37a6b807fd71c622efea27a9309b5d4edc792969/logos/qwik-icon.svg" alt="Qwik" width="24" height="24" /><br/>Qwik |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                ✅                                                                                |                                                                                 ✅                                                                                  |                                                                                   ✅                                                                                    |                                                                                 ✅                                                                                 |

### Browser support

| <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/chrome/chrome_24x24.png" alt="Chrome" /><br/>Chrome | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/edge/edge_24x24.png" alt="Edge" /><br/>Edge | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/safari/safari_24x24.png" alt="Safari" /><br/>Safari | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/firefox/firefox_24x24.png" alt="Firefox" /><br/>Firefox | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/opera/opera_24x24.png" alt="Opera" /><br/>Opera |
| ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| <div align="center">111+</div>                                                                                            | <div align="center">111+</div>                                                                                    | <div align="center">18+</div>                                                                                             | <div align="center">151+</div>                                                                                                | <div align="center">98+</div>                                                                                         |

## Documentation

Please visit [css-hooks.com](https://css-hooks.com) to get started.

## Contributing

Contributions are welcome. Please see the
[contributing guidelines](CONTRIBUTING.md) for more information.

## License

CSS Hooks is offered under the [MIT license](LICENSE).
