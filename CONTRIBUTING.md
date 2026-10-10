# Contributing

## Questions

[Open an issue](https://github.com/css-hooks/css-hooks/issues/new?labels=question)
for questions about CSS Hooks.

## Defects

[Open an issue](https://github.com/css-hooks/css-hooks/issues/new?labels=defect)
with enough detail to reproduce the defect. Include a link to a reproduction
when possible.

## Documentation

Propose documentation changes in a
[pull request](https://github.com/css-hooks/css-hooks/compare) or
[open an issue](https://github.com/css-hooks/css-hooks/issues/new?labels=documentation).

### Writing style

Follow the
[MDN Web Docs writing style guide](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide),
and treat it as the default for grammar, terminology, lists, headings, and
cross-references.

Use sentence case for headings and for cross-reference link text that matches
the linked page title. Prefer the active voice and the imperative mood for
instructions.

Use consistent terminology throughout the documentation: declare hooks with
`createHooks()`, define conditions with the `and`, `or`, and `not` combinators,
and associate styles with `on`. Refer to callables by name, such as the `on`
function or the `and` combinator, and reserve parentheses for actual
invocations. Avoid "CSS-in-JS" and any implication that CSS Hooks generates
code.

Do not edit the generated API reference under `docs/api/` by hand. Update the
source JSDoc and run `npm run docs`.

### Recipes

Add recipes under `docs/recipes/<name>/` with an `index.mdx` document, an
`App.tsx` example, and a `css.ts` hook declaration. The website registers the
recipe in the `docs/recipes/` index automatically; add `hidden: true` to its
frontmatter so only the index appears in the documentation sidebar.

List recipes by practical utility, with broadly useful patterns before narrower
platform patterns. Set each recipe's frontmatter `order` value to its position
in the list.

Use an existing recipe as the template for `index.mdx` imports and the
`<Wide><RecipeDemo>…</RecipeDemo></Wide>` wrapper. Keep the prose focused on the
pattern, why it is useful, and any accessibility or platform behavior readers
should understand.

Follow
[MDN's HTML element terminology](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide#terminology):
wrap the element name in angle brackets and backticks, and use the word
"element," as in "the `<span>` element." Do not use the JSX self-closing slash
in prose.

#### Visual design

Use this palette consistently. Hardcode colors where they are used; do not hide
them behind CSS custom properties, theme objects, or shared demo utilities.

| Role             | Light     | Dark      |
| ---------------- | --------- | --------- |
| Canvas           | `#f8fafc` | `#0f172a` |
| Surface          | `#ffffff` | `#1e293b` |
| Subtle surface   | `#f1f5f9` | `#334155` |
| Primary text     | `#0f172a` | `#f8fafc` |
| Secondary text   | `#475569` | `#cbd5e1` |
| Muted text       | `#64748b` | `#94a3b8` |
| Border           | `#e2e8f0` | `#334155` |
| Control border   | `#cbd5e1` | `#475569` |
| Primary action   | `#6d28d9` | `#6d28d9` |
| Primary hover    | `#5b21b6` | `#5b21b6` |
| Primary active   | `#4c1d95` | `#4c1d95` |
| Primary tint     | `#ede9fe` | `#4c1d95` |
| Accent text      | `#6d28d9` | `#c4b5fd` |
| Focus            | `#2563eb` | `#60a5fa` |
| Disabled surface | `#e5e7eb` | `#334155` |
| Disabled text    | `#4b5563` | `#94a3b8` |

Every recipe must use the inherited `"%dark"` flag for its light and dark styles
and set `colorScheme` so native controls match. Do not add theme synchronization
code unless the recipe specifically demonstrates theme overrides.

Use `system-ui, sans-serif`, a full-height canvas, `boxSizing: "border-box"`,
and 32px canvas padding unless the demonstrated layout requires otherwise. Use
12px corners for cards and panels and 8px corners for inputs and action buttons.
Primary action buttons use 12px by 20px padding, the primary-action color, white
text, inherited type, and weight 600. Icon-only controls may be circular.

Prefer neutral surfaces and the purple primary accent. Introduce another color,
shape, or layout treatment only when it makes the behavior being demonstrated
easier to understand. Keep focus indicators visible and retain native semantic
elements and keyboard behavior.

## Resources

Share tutorials, libraries, examples, and other CSS Hooks resources on
[X](https://x.com/csshooks) or wherever you discuss web development.

## Code

[Open an issue](https://github.com/css-hooks/css-hooks/issues/new) before
investing significant time in a code change.

The commit and pull request guidelines below apply to human contributors and
coding agents.

### Development environment

Development requires [Node.js](https://nodejs.org). See [.nvmrc](.nvmrc) for the
required version.

VS Code users can install the project's
[recommended extensions](.vscode/extensions.json).

### Commit messages

Use [Conventional Commits](https://conventionalcommits.org) with this header
format:

```text
<type>: brief description of change
```

Use one of these types:

- `breaking`: a backward-incompatible package change
- `feat`: a backward-compatible package feature
- `fix`: a defect fix
- `misc`: any change outside `packages/`, or any other change not covered above

Write the description in lowercase without ending punctuation.

Briefly explain the change in the commit body using complete sentences. Prefer
lowercase except for proper nouns and case-sensitive names such as code symbols.
Use a bulleted list when the change addresses multiple issues that differ enough
to warrant separate points, and begin each bullet with a capital letter. Do not
use a bulleted list for a single issue. Omit verification steps unless they
differ from the checks in [next.yml](.github/workflows/next.yml).

### Pull requests

Match the pull request title to the commit header and the pull request
description to the commit body.
