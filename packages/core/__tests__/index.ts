import { buildHooksSystem, genericStringify } from "../src";
import * as csstree from "css-tree";

function normalizeCSS(css: string) {
  return csstree.generate(csstree.parse(css));
}

describe("css renderer", () => {
  const createHooks = buildHooksSystem(() => "");

  it("renders pseudo-class hooks", () => {
    const [css] = createHooks({
      hover: ":hover",
      focusWithin: ":focus-within",
      oddChild: ":nth-child(odd)",
    });
    expect(normalizeCSS(css)).toEqual(
      normalizeCSS(`
        * {
          --hover-0:initial;
          --hover-1: ;
          --focusWithin-0:initial;
          --focusWithin-1: ;
          --oddChild-0:initial;
          --oddChild-1: ;
        }

        :hover {
          --hover-0: ;
          --hover-1:initial;
        }

        :focus-within {
          --focusWithin-0: ;
          --focusWithin-1:initial;
        }

        :nth-child(odd) {
          --oddChild-0: ;
          --oddChild-1:initial;
        }
      `),
    );
  });

  it("renders media query hooks", () => {
    const [css] = createHooks({
      dark: "@media (prefers-color-scheme:dark)",
      light: "@media (prefers-color-scheme:light)",
    });
    expect(normalizeCSS(css)).toEqual(
      normalizeCSS(`
        * {
          --dark-0:initial;
          --dark-1: ;
          --light-0:initial;
          --light-1: ;
        }

        @media (prefers-color-scheme:dark) {
          * {
            --dark-0: ;
            --dark-1:initial;
          }
        }

        @media (prefers-color-scheme:light) {
          * {
            --light-0: ;
            --light-1:initial;
          }
        }
      `),
    );
  });

  it("renders container query hooks", () => {
    const [css] = createHooks({
      small: "@container (max-width: 399.999px)",
      medium: "@container (min-width: 400px) and (max-width: 699.999px)",
      large: "@container (min-width: 700px)",
    });
    expect(normalizeCSS(css)).toEqual(
      normalizeCSS(`
        * {
          --small-0:initial;
          --small-1: ;
          --medium-0:initial;
          --medium-1: ;
          --large-0:initial;
          --large-1: ;
        }

        @container (max-width: 399.999px) {
          * {
            --small-0: ;
            --small-1:initial;
          }
        }

        @container (min-width: 400px) and (max-width: 699.999px) {
          * {
            --medium-0: ;
            --medium-1:initial;
          }
        }

        @container (min-width: 700px) {
          * {
            --large-0: ;
            --large-1:initial;
          }
        }
      `),
    );
  });

  it("renders selector hooks", () => {
    const [css] = createHooks({
      checkedPrevious: ":checked + &",
      groupHover: ".hover-group &",
    });
    expect(normalizeCSS(css)).toEqual(
      normalizeCSS(`
        * {
          --checkedPrevious-0:initial;
          --checkedPrevious-1: ;
          --groupHover-0:initial;
          --groupHover-1: ;
        }

        :checked + * {
          --checkedPrevious-0: ;
          --checkedPrevious-1:initial;
        }

        .hover-group * {
          --groupHover-0: ;
          --groupHover-1:initial;
        }
      `),
    );
  });

  it("renders a mix of hooks", () => {
    const [css] = createHooks({
      "checked-previous": ":checked + &",
      "nth-custom": ":nth-child(3n+2)",
      dark: "@media (prefers-color-scheme: dark)",
      "extra-large": "@container (min-width: 2000px)",
    });
    expect(normalizeCSS(css)).toEqual(
      normalizeCSS(`
        * {
          --checked-previous-0:initial;
          --checked-previous-1: ;
          --nth-custom-0:initial;
          --nth-custom-1: ;
          --dark-0:initial;
          --dark-1: ;
          --extra-large-0:initial;
          --extra-large-1: ;
        }

        :checked + * {
          --checked-previous-0: ;
          --checked-previous-1:initial;
        }

        :nth-child(3n+2) {
          --nth-custom-0: ;
          --nth-custom-1:initial;
        }

        @media (prefers-color-scheme: dark) {
          * {
            --dark-0: ;
            --dark-1:initial;
          }
        }

        @container (min-width: 2000px) {
          * {
            --extra-large-0: ;
            --extra-large-1:initial;
          }
        }
      `),
    );
  });

  it('renders "or" hooks', () => {
    const [css] = createHooks({
      dark: {
        or: ["@media (prefers-color-scheme: dark)", "[data-theme='dark'] &"],
      },
    });
    expect(normalizeCSS(css)).toEqual(
      normalizeCSS(`
      * {
        --dark-0:initial;
        --dark-1: ;
      }

      @media (prefers-color-scheme: dark) {
        * {
          --dark-0: ;
          --dark-1:initial;
        }
      }

      [data-theme='dark'] * {
        --dark-0: ;
        --dark-1:initial;
      }
    `),
    );
  });
});

describe("hooks function", () => {
  it("renders hook values in the reverse of the specified order", () => {
    const createHooks = buildHooksSystem<{ color: string }>((_, value) =>
      typeof value === "string" ? value : null,
    );
    const [, hooks] = createHooks({
      testHookA: ":a",
      testHookB: ":b",
      testHookC: ":c",
    });
    expect(
      hooks({
        color: "red",
        testHookA: { color: "yellow" },
        testHookB: { color: "green" },
        testHookC: { color: "blue" },
      }),
    ).toEqual({
      color:
        "var(--testHookC-1, blue) var(--testHookC-0, var(--testHookB-1, green) var(--testHookB-0, var(--testHookA-1, yellow) var(--testHookA-0, red)))",
    });
    expect(
      hooks({
        color: "red",
        testHookB: { color: "yellow" },
        testHookC: { color: "green" },
        testHookA: { color: "blue" },
      }),
    ).toEqual({
      color:
        "var(--testHookA-1, blue) var(--testHookA-0, var(--testHookC-1, green) var(--testHookC-0, var(--testHookB-1, yellow) var(--testHookB-0, red)))",
    });
  });

  it("allows the default property value to be defined after hooks (mimicking specificity)", () => {
    const createHooks = buildHooksSystem<{ "text-decoration": string }>(
      (_, value) => (typeof value === "string" ? value : null),
    );
    const [, hooks] = createHooks({
      "test-hook": ":test-hook",
    });
    expect(
      hooks({
        "test-hook": { "text-decoration": "underline" },
        "text-decoration": "none",
      }),
    ).toEqual({
      "text-decoration":
        "var(--test-hook-1, underline) var(--test-hook-0, none)",
    });
  });

  it("leaves non-hooks values as-is", () => {
    const createHooks = buildHooksSystem<{
      color?: string;
      "background-color"?: string;
    }>((_, value) => (typeof value === "string" ? value : null));
    const [, hooks] = createHooks({
      "test-hook": ":test-hook",
    });
    expect(
      hooks({
        color: "white",
        "background-color": "red",
        "test-hook": {
          "background-color": "blue",
        },
      }).color,
    ).toEqual("white");
  });

  it("falls back to `unset` when a default value is not present", () => {
    const createHooks = buildHooksSystem<{
      color?: string;
    }>((_, value) => (typeof value === "string" ? value : null));
    const [, hooks] = createHooks({
      "test-hook": ":test-hook",
    });
    expect(hooks({ "test-hook": { color: "red" } })).toEqual({
      color: "var(--test-hook-1, red) var(--test-hook-0, unset)",
    });
  });

  it("falls back to `unset` when the default value can't be stringified", () => {
    const createHooks = buildHooksSystem<{ color: string }>((_, value) =>
      value === "hook" ? value : null,
    );
    const [, hooks] = createHooks({ testHook: ":test-hook" });
    expect(hooks({ color: "invalid", testHook: { color: "hook" } })).toEqual({
      color: "var(--testHook-1, hook) var(--testHook-0, unset)",
    });
  });

  it("ignores a hook value that can't be stringified", () => {
    const createHooks = buildHooksSystem<{ color: string }>((_, value) =>
      value === "default" ? value : null,
    );
    const [, hooks] = createHooks({ testHook: ":test-hook" });
    expect(hooks({ color: "default", testHook: { color: "invalid" } })).toEqual(
      { color: "default" },
    );
  });

  it('uses as-is a value that is already a string starting with "var("', () => {
    const createHooks = buildHooksSystem<{ color: string }>((_, value) =>
      typeof value === "string" ? `[${value}]` : null,
    );
    const [, hooks] = createHooks({
      "test-hook-a": ":test-hook-a",
      "test-hook-b": ":test-hook-b",
    });
    expect(
      hooks({
        color: "blue",
        "test-hook-a": {
          color: "lightblue",
        },
        "test-hook-b": {
          color: "red",
        },
      }),
    ).toEqual({
      color:
        "var(--test-hook-b-1, [red]) var(--test-hook-b-0, var(--test-hook-a-1, [lightblue]) var(--test-hook-a-0, [blue]))",
    });
  });

  it("allows hooks to be combined via nesting", () => {
    const createHooks = buildHooksSystem<{ color: string }>((_, value) =>
      typeof value === "string" ? `[${value}]` : null,
    );
    const [, hooks] = createHooks({
      testHookA: ":test-hook-a",
      testHookB: ":test-hook-b",
    });
    expect(
      hooks({
        color: "black",
        testHookA: {
          color: "red",
          testHookB: {
            color: "pink",
          },
        },
      }),
    ).toEqual({
      color:
        "var(--testHookA-1, var(--testHookB-1, [pink]) var(--testHookB-0, [red])) var(--testHookA-0, [black])",
    });
  });

  it("falls back multiple levels if needed", () => {
    const createHooks = buildHooksSystem<{ color: string }>((_, value) =>
      typeof value === "string" && value !== "invalid" ? `[${value}]` : null,
    );
    const [, hooks] = createHooks({
      "test-hook-a": ":test-hook-a",
      "test-hook-b": ":test-hook-b",
    });
    expect(
      hooks({
        color: "black",
        "test-hook-a": {
          color: "invalid",
          "test-hook-b": {
            color: "pink",
          },
        },
      }),
    ).toEqual({
      color:
        "var(--test-hook-a-1, var(--test-hook-b-1, [pink]) var(--test-hook-b-0, [black])) var(--test-hook-a-0, [black])",
    });
  });
});

describe("default stringify function", () => {
  it("returns a string value as-is", () => {
    expect(genericStringify("display", "block")).toEqual("block");
  });
  it("returns a number value as a string", () => {
    expect(genericStringify("width", 1)).toEqual("1");
  });
  it("returns null for invalid values", () => {
    [
      null,
      undefined,
      {},
      false,
      () => {
        /*noop*/
      },
    ].forEach(value => {
      expect(genericStringify("property", value)).toBeNull();
    });
  });
});
