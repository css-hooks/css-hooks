# Contributing

Welcome, and thanks for your interest in CSS Hooks. Whether you're new to web
development or are here to teach us new tricks, we're glad to have you and look
forward to your contributions. Listed below are a few ways you can help.

## Asking questions

If you have a question, please
[open an issue](https://github.com/css-hooks/css-hooks/issues/new?labels=question)
to discuss it. This might help us to find a defect; reveal an opportunity to
improve the documentation or developer experience; or help someone facing a
similar issue in the future.

## Reporting defects

Please
[open an issue](https://github.com/css-hooks/css-hooks/issues/new?labels=defect)
to discuss any defects you find. Include as much detail as you can, and if
possible provide a link to a repository or demo environment where the issue can
be reproduced.

## Improving documentation

Please share any suggestions for improving or adding to the documentation by
[submitting a pull request](https://github.com/css-hooks/css-hooks/compare) or
[opening an issue](https://github.com/css-hooks/css-hooks/issues/new?labels=documentation).

## Sharing resources

If you have created a tutorial, auxiliary library, interesting code example, or
other resource related to CSS Hooks, please share it with the community on
[Twitter](https://twitter.com/csshooks),
[Facebook](https://facebook.com/csshooks), or anywhere you discuss web
development topics. Increasing awareness will bring more users (and potential
contributors) to the project.

## Submitting code

Pull requests are welcome, but we ask that you
[open an issue](https://github.com/css-hooks/css-hooks/issues/new) to discuss
your plans before making any significant investment of your valuable time.

### Development environment

The only strict requirement for developing CSS Hooks is Node.js. Review the
[CI workflow](.github/workflows/ci.yml) to determine which version you should
use.

If you are a [VS Code](https://code.visualstudio.com) user, please consider
installing the [recommended extensions](.vscode/extensions.json) for CSS Hooks
contributors.

### Commit messages

CSS Hooks uses [Conventional Commits](https://conventionalcommits.org) with
Angular's
[commit types](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#type).

### Preparing your submission

Please verify your changes before submitting a pull request using the following
commands:

1. `npx prettier --check .`, which ensures that code files conform to the
   project's formatting standards;
1. `npm run lint --workspaces --if-present`, which alerts you to potential
   problems in your JavaScript code; and
1. `npm test --workspaces --if-present`, which runs the unit tests.

### Submitting a pull request

When you are ready to
[submit a pull request](https://github.com/css-hooks/css-hooks/compare), please
make sure to include:

1. a brief description of the change;
1. a link to the related issue, if applicable;
1. any design considerations you feel are important; and
1. any ideas you may have to improve upon your submission in the future.
