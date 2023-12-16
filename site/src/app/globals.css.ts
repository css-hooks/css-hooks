import * as V from "varsace";

const css = `
  /* syntax highlighting */

  .syntax-highlighter {
    color: ${V.gray90};
  }

  .syntax-highlighter .keyword {
    color: ${V.purple70};
  }

  .syntax-highlighter .punctuation {
    color: ${V.gray80};
  }

  .syntax-highlighter .attr-name {
    color: ${V.blue70};
  }

  .syntax-highlighter .attr-value {
    color: ${V.red70};
  }

  .syntax-highlighter .script {
    color: ${V.gray90};
  }

  .syntax-highlighter .operator {
    color: ${V.gray70};
  }

  .syntax-highlighter .plain-text {
    color: ${V.gray90};
  }

  .syntax-highlighter .tag {
    color: ${V.green70};
  }

  .syntax-highlighter .function {
    color: ${V.purple70};
  }

  .syntax-highlighter .language-javascript {
    color: ${V.gray90};
  }

  .syntax-highlighter .language-tsx {
    color: ${V.gray90};
  }

  /* Highlighting specific cases */

  .syntax-highlighter .language-tsx .token.string {
    color: ${V.blue70};
  }

  .syntax-highlighter .token.comment {
    color: ${V.gray60};
  }

  .syntax-highlighter .language-tsx .token.plain-text {
    color: ${V.gray90};
  }

  .syntax-highlighter .language-tsx .token.script-punctuation {
    color: ${V.gray80};
  }

  .syntax-highlighter .language-tsx .token.function-variable {
    color: ${V.blue70};
  }

  .syntax-highlighter .language-tsx .token.boolean {
    color: ${V.purple70};
  }

  @media (prefers-color-scheme: dark) {
    .syntax-highlighter {
      color: ${V.white};
    }

    .syntax-highlighter .keyword {
      color: ${V.purple20};
    }

    .syntax-highlighter .punctuation {
      color: ${V.gray30};
    }

    .syntax-highlighter .attr-name {
      color: ${V.blue20};
    }

    .syntax-highlighter .attr-value {
      color: ${V.red20};
    }

    .syntax-highlighter .script {
      color: ${V.white};
    }

    .syntax-highlighter .operator {
      color: ${V.gray20};
    }

    .syntax-highlighter .plain-text {
      color: ${V.white};
    }

    .syntax-highlighter .tag {
      color: ${V.green20};
    }

    .syntax-highlighter .function {
      color: ${V.purple20};
    }

    .syntax-highlighter .language-javascript {
      color: ${V.white};
    }

    .syntax-highlighter .language-tsx {
      color: ${V.white};
    }

    /* Highlighting specific cases */

    .syntax-highlighter .language-tsx .token.string {
      color: ${V.blue20};
    }

    .syntax-highlighter .token.comment {
      color: ${V.gray40};
    }

    .syntax-highlighter .language-tsx .token.plain-text {
      color: ${V.white};
    }

    .syntax-highlighter .language-tsx .token.script-punctuation {
      color: ${V.gray30};
    }

    .syntax-highlighter .language-tsx .token.function-variable {
      color: ${V.blue20};
    }

    .syntax-highlighter .language-tsx .token.boolean {
      color: ${V.purple20};
    }
  }

  html {
    overflow-y: scroll;
  }
`;

export default css;
