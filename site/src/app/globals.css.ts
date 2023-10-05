import {
  blue20,
  blue70,
  gray20,
  gray30,
  gray40,
  gray70,
  gray80,
  gray90,
  green20,
  green70,
  purple20,
  purple70,
  red20,
  red70,
  white,
} from "varsace";

const css = `
  /* syntax highlighting */

  .syntax-highlighter {
    color: ${gray90};
  }

  .syntax-highlighter .keyword {
    color: ${purple70};
  }

  .syntax-highlighter .punctuation {
    color: ${gray80};
  }

  .syntax-highlighter .attr-name {
    color: ${blue70};
  }

  .syntax-highlighter .attr-value {
    color: ${red70};
  }

  .syntax-highlighter .script {
    color: ${gray90};
  }

  .syntax-highlighter .operator {
    color: ${gray70};
  }

  .syntax-highlighter .plain-text {
    color: ${gray90};
  }

  .syntax-highlighter .tag {
    color: ${green70};
  }

  .syntax-highlighter .function {
    color: ${purple70};
  }

  .syntax-highlighter .language-javascript {
    color: ${gray90};
  }

  .syntax-highlighter .language-tsx {
    color: ${gray90};
  }

  /* Highlighting specific cases */

  .syntax-highlighter .language-tsx .token.string {
    color: ${blue70};
  }

  .syntax-highlighter .language-tsx .token.comment {
    color: ${gray70};
  }

  .syntax-highlighter .language-tsx .token.plain-text {
    color: ${gray90};
  }

  .syntax-highlighter .language-tsx .token.script-punctuation {
    color: ${gray80};
  }

  .syntax-highlighter .language-tsx .token.function-variable {
    color: ${blue70};
  }

  .syntax-highlighter .language-tsx .token.boolean {
    color: ${purple70};
  }

  @media (prefers-color-scheme: dark) {
    .syntax-highlighter {
      color: ${white};
    }

    .syntax-highlighter .keyword {
      color: ${purple20};
    }

    .syntax-highlighter .punctuation {
      color: ${gray30};
    }

    .syntax-highlighter .attr-name {
      color: ${blue20};
    }

    .syntax-highlighter .attr-value {
      color: ${red20};
    }

    .syntax-highlighter .script {
      color: ${white};
    }

    .syntax-highlighter .operator {
      color: ${gray20};
    }

    .syntax-highlighter .plain-text {
      color: ${white};
    }

    .syntax-highlighter .tag {
      color: ${green20};
    }

    .syntax-highlighter .function {
      color: ${purple20};
    }

    .syntax-highlighter .language-javascript {
      color: ${white};
    }

    .syntax-highlighter .language-tsx {
      color: ${white};
    }

    /* Highlighting specific cases */

    .syntax-highlighter .language-tsx .token.string {
      color: ${blue20};
    }

    .syntax-highlighter .language-tsx .token.comment {
      color: ${gray40};
    }

    .syntax-highlighter .language-tsx .token.plain-text {
      color: ${white};
    }

    .syntax-highlighter .language-tsx .token.script-punctuation {
      color: ${gray30};
    }

    .syntax-highlighter .language-tsx .token.function-variable {
      color: ${blue20};
    }

    .syntax-highlighter .language-tsx .token.boolean {
      color: ${purple20};
    }
  }

  html {
    overflow-y: scroll;
  }
`;

export default css;
