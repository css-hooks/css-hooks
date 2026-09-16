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

Briefly explain the change in the commit body. Use complete sentences and
bullets when useful. Omit verification steps unless they differ from the checks
in [next.yml](.github/workflows/next.yml).

### Pull requests

Match the pull request title to the commit header and the pull request
description to the commit body.
