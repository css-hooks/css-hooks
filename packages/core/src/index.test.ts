import assert from "node:assert";
import { describe, it } from "node:test";
import { buildHooksSystem, genericStringify } from "./index.js";
import * as csstree from "css-tree";

function normalizeCSS(css: string) {
  return csstree.generate(csstree.parse(css));
}

describe("hooks renderer", () => {
  const createHooksImpl = buildHooksSystem();
  const createHooks = (config: Parameters<typeof createHooksImpl>[0]) =>
    createHooksImpl(config, { hookNameToId: x => x });

  it("renders pseudo-class hooks", () => {
    const [hooks] = createHooks({
      hover: ":hover",
      focusWithin: ":focus-within",
      oddChild: ":nth-child(odd)",
    });
    assert.equal(
      normalizeCSS(hooks),
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
    const [hooks] = createHooks({
      dark: "@media (prefers-color-scheme:dark)",
      light: "@media (prefers-color-scheme:light)",
    });
    assert.equal(
      normalizeCSS(hooks),
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
    const [hooks] = createHooks({
      small: "@container (max-width: 399.999px)",
      medium: "@container (min-width: 400px) and (max-width: 699.999px)",
      large: "@container (min-width: 700px)",
    });
    assert.equal(
      normalizeCSS(hooks),
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
    const [hooks] = createHooks({
      checkedPrevious: ":checked + &",
      groupHover: ".hover-group &",
    });
    assert.equal(
      normalizeCSS(hooks),
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
    const [hooks] = createHooks({
      "checked-previous": ":checked + &",
      "nth-custom": ":nth-child(3n+2)",
      dark: "@media (prefers-color-scheme: dark)",
      "extra-large": "@container (min-width: 2000px)",
    });
    assert.equal(
      normalizeCSS(hooks),
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
    const [hooks] = createHooks({
      dark: {
        or: ["@media (prefers-color-scheme: dark)", "[data-theme='dark'] &"],
      },
    });
    assert.equal(
      normalizeCSS(hooks),
      normalizeCSS(`
        * {
          --darkA-0:initial;
          --darkA-1: ;
          --darkB-0:initial;
          --darkB-1: ;
          --dark-0:var(--darkA-0,var(--darkB-0));
          --dark-1:var(--darkA-1) var(--darkB-1);
        }
        @media (prefers-color-scheme: dark) {
          * {
            --darkA-0: ;
            --darkA-1:initial;
          }
        }
        [data-theme="dark"] * {
          --darkB-0: ;
          --darkB-1:initial;
        }
      `),
    );
  });

  it('renders "and" hooks', () => {
    const [hooks] = createHooks({
      dark: {
        and: ["@media (prefers-color-scheme: dark)", "[data-theme='dark'] &"],
      },
    });
    assert.equal(
      normalizeCSS(hooks),
      normalizeCSS(`
        * {
          --darkA-0:initial;
          --darkA-1: ;
          --darkB-0:initial;
          --darkB-1: ;
          --dark-0:var(--darkA-0) var(--darkB-0);
          --dark-1:var(--darkA-1,var(--darkB-1));
        }
        @media (prefers-color-scheme: dark) {
          * {
            --darkA-0: ;
            --darkA-1:initial;
          }
        }
        [data-theme="dark"] * {
          --darkB-0: ;
          --darkB-1:initial;
        }
      `),
    );
  });

  it('renders nested "and" and "or" hooks', () => {
    const [hooks] = createHooks({
      dark: {
        or: [
          {
            and: [
              "@media (prefers-color-scheme: dark)",
              "[data-theme='auto'] &",
            ],
          },
          "[data-theme='dark'] &",
        ],
      },
    });
    assert.equal(
      normalizeCSS(hooks),
      normalizeCSS(`
        * {
          --darkAA-0:initial;
          --darkAA-1: ;
          --darkAB-0:initial;
          --darkAB-1: ;
          --darkA-0:var(--darkAA-0) var(--darkAB-0);
          --darkA-1:var(--darkAA-1,var(--darkAB-1));
          --darkB-0:initial;
          --darkB-1: ;
          --dark-0:var(--darkA-0,var(--darkB-0));
          --dark-1:var(--darkA-1) var(--darkB-1);
        }
        @media (prefers-color-scheme: dark) {
          * {
            --darkAA-0: ;
            --darkAA-1:initial;
          }
        }
        [data-theme="auto"] * {
          --darkAB-0: ;
          --darkAB-1:initial;
        }
        [data-theme="dark"] * {
          --darkB-0: ;
          --darkB-1:initial;
        }
      `),
    );
  });

  it('ignores empty "and" hooks', () => {
    const [a] = createHooks({
      dark: {
        and: [],
      },
    });
    const [b] = createHooks({});
    assert.equal(a, b);
  });

  it('unwraps a unary "and" hook', () => {
    const spec = ":foo";
    const [a] = createHooks({
      foo: {
        and: [spec],
      },
    });
    const [b] = createHooks({
      foo: spec,
    });
    assert.equal(a, b);
  });

  it('ignores empty "or" hooks', () => {
    const [a] = createHooks({
      dark: {
        or: [],
      },
    });
    const [b] = createHooks({});
    assert.equal(a, b);
  });

  it('unwraps a unary "or" hook', () => {
    const spec = ":foo";
    const [a] = createHooks({
      foo: {
        or: [spec],
      },
    });
    const [b] = createHooks({
      foo: spec,
    });
    assert.equal(a, b);
  });
});

describe("css function", () => {
  it("renders values in the reverse of the specified order", () => {
    const createHooks = buildHooksSystem<{ color: string }>((_, value) =>
      typeof value === "string" ? value : null,
    );
    const [, css] = createHooks(
      {
        testHookA: ":a",
        testHookB: ":b",
        testHookC: ":c",
      },
      { hookNameToId: x => x },
    );
    assert.deepEqual(
      css({
        color: "red",
        testHookA: { color: "yellow" },
        testHookB: { color: "green" },
        testHookC: { color: "blue" },
      }),
      {
        color:
          "var(--testHookC-1, blue) var(--testHookC-0, var(--testHookB-1, green) var(--testHookB-0, var(--testHookA-1, yellow) var(--testHookA-0, red)))",
      },
    );
    assert.deepEqual(
      css({
        color: "red",
        testHookB: { color: "yellow" },
        testHookC: { color: "green" },
        testHookA: { color: "blue" },
      }),
      {
        color:
          "var(--testHookA-1, blue) var(--testHookA-0, var(--testHookC-1, green) var(--testHookC-0, var(--testHookB-1, yellow) var(--testHookB-0, red)))",
      },
    );
  });

  it("allows the default property value to be defined after hook styles", () => {
    const createHooks = buildHooksSystem<{ "text-decoration": string }>(
      (_, value) => (typeof value === "string" ? value : null),
    );
    const [, css] = createHooks(
      {
        "test-hook": ":test-hook",
      },
      { hookNameToId: x => x },
    );
    assert.deepEqual(
      css({
        "test-hook": { "text-decoration": "underline" },
        "text-decoration": "none",
      }),
      {
        "text-decoration":
          "var(--test-hook-1, underline) var(--test-hook-0, none)",
      },
    );
  });

  it("leaves non-hooks values as-is", () => {
    const createHooks = buildHooksSystem<{
      color?: string;
      "background-color"?: string;
    }>((_, value) => (typeof value === "string" ? value : null));
    const [, css] = createHooks({
      "test-hook": ":test-hook",
    });
    assert.equal(
      css({
        color: "white",
        "background-color": "red",
        "test-hook": {
          "background-color": "blue",
        },
      }).color,
      "white",
    );
  });

  (["unset", "revert-layer"] as const).forEach(fallback => {
    describe(`when fallback option is set to \`${fallback}\``, () => {
      it(`falls back to \`${fallback}\` when a default value is not present (single level)`, () => {
        const createHooks = buildHooksSystem<{
          color?: string;
        }>((_, value) => (typeof value === "string" ? value : null));
        const [, css] = createHooks(
          {
            "test-hook": ":test-hook",
          },
          { fallback, hookNameToId: x => x },
        );
        assert.deepEqual(css({ "test-hook": { color: "red" } }), {
          color: `var(--test-hook-1, red) var(--test-hook-0, ${fallback})`,
        });
      });

      it(`falls back to \`${fallback}\` when the default value is not present (multiple levels)`, () => {
        const createHooks = buildHooksSystem<{ color?: string }>();
        const [, css] = createHooks(
          { testHookA: ":test-hook-a", testHookB: ":test-hook-b" },
          { fallback, hookNameToId: x => x },
        );
        assert.deepEqual(css({ testHookA: { testHookB: { color: "hook" } } }), {
          color: `var(--testHookA-1, var(--testHookB-1, hook) var(--testHookB-0, ${fallback})) var(--testHookA-0, ${fallback})`,
        });
      });

      it(`falls back to \`${fallback}\` when the default value can't be stringified`, () => {
        const createHooks = buildHooksSystem<{ color: string }>((_, value) =>
          value === "hook" ? value : null,
        );
        const [, css] = createHooks(
          { testHook: ":test-hook" },
          { fallback, hookNameToId: x => x },
        );
        assert.deepEqual(
          css({ color: "invalid", testHook: { color: "hook" } }),
          {
            color: `var(--testHook-1, hook) var(--testHook-0, ${fallback})`,
          },
        );
      });
    });
  });

  it("ignores a hook value that can't be stringified", () => {
    const createHooks = buildHooksSystem<{ color: string }>((_, value) =>
      value === "default" ? value : null,
    );
    const [, css] = createHooks({ testHook: ":test-hook" });
    assert.deepEqual(
      css({ color: "default", testHook: { color: "invalid" } }),
      {
        color: "default",
      },
    );
  });

  it('uses as-is a value that is already a string starting with "var("', () => {
    const createHooks = buildHooksSystem<{ color: string }>((_, value) =>
      typeof value === "string" ? `[${value}]` : null,
    );
    const [, css] = createHooks(
      {
        "test-hook-a": ":test-hook-a",
        "test-hook-b": ":test-hook-b",
      },
      { hookNameToId: x => x },
    );
    assert.deepEqual(
      css({
        color: "blue",
        "test-hook-a": {
          color: "lightblue",
        },
        "test-hook-b": {
          color: "red",
        },
      }),
      {
        color:
          "var(--test-hook-b-1, [red]) var(--test-hook-b-0, var(--test-hook-a-1, [lightblue]) var(--test-hook-a-0, [blue]))",
      },
    );
  });

  it("allows hooks to be combined via nesting", () => {
    const createHooks = buildHooksSystem<{ color: string }>((_, value) =>
      typeof value === "string" ? `[${value}]` : null,
    );
    const [, css] = createHooks(
      {
        testHookA: ":test-hook-a",
        testHookB: ":test-hook-b",
      },
      { hookNameToId: x => x },
    );
    assert.deepEqual(
      css({
        color: "black",
        testHookA: {
          color: "red",
          testHookB: {
            color: "pink",
          },
        },
      }),
      {
        color:
          "var(--testHookA-1, var(--testHookB-1, [pink]) var(--testHookB-0, [red])) var(--testHookA-0, [black])",
      },
    );
  });

  it("falls back multiple levels if needed", () => {
    const createHooks = buildHooksSystem<{ color: string }>((_, value) =>
      typeof value === "string" && value !== "invalid" ? `[${value}]` : null,
    );
    const [, css] = createHooks(
      {
        "test-hook-a": ":test-hook-a",
        "test-hook-b": ":test-hook-b",
      },
      { hookNameToId: x => x },
    );
    assert.deepEqual(
      css({
        color: "black",
        "test-hook-a": {
          color: "invalid",
          "test-hook-b": {
            color: "pink",
          },
        },
      }),
      {
        color:
          "var(--test-hook-a-1, var(--test-hook-b-1, [pink]) var(--test-hook-b-0, [black])) var(--test-hook-a-0, [black])",
      },
    );
  });
});

describe("createHooks function", () => {
  it("uses hash identifiers for variable names by default", () => {
    const createHooks = buildHooksSystem();
    const [hooks, css] = createHooks({
      foo: ":disabled",
      bar: {
        or: [
          ":hover",
          {
            and: ["&.hover", "&.debug"],
          },
        ],
      },
    });
    assert.equal(
      normalizeCSS(hooks),
      normalizeCSS(`
        * {
          --5g7aa6-0:initial;
          --5g7aa6-1: ;
          --ilyuetA-0:initial;
          --ilyuetA-1: ;
          --ilyuetBA-0:initial;
          --ilyuetBA-1: ;
          --ilyuetBB-0:initial;
          --ilyuetBB-1: ;
          --ilyuetB-0:var(--ilyuetBA-0) var(--ilyuetBB-0);
          --ilyuetB-1:var(--ilyuetBA-1,var(--ilyuetBB-1));
          --ilyuet-0:var(--ilyuetA-0,var(--ilyuetB-0));
          --ilyuet-1:var(--ilyuetA-1) var(--ilyuetB-1);
        }
        :disabled {
          --5g7aa6-0: ;
          --5g7aa6-1:initial;
        }
        :hover {
          --ilyuetA-0: ;
          --ilyuetA-1:initial;
        }
        *.hover {
          --ilyuetBA-0: ;
          --ilyuetBA-1:initial;
        }
        *.debug {
          --ilyuetBB-0: ;
          --ilyuetBB-1:initial;
        }
      `),
    );
    assert.deepEqual(
      css({ color: "black", foo: { color: "gray" }, bar: { color: "red" } }),
      {
        color:
          "var(--ilyuet-1, red) var(--ilyuet-0, var(--5g7aa6-1, gray) var(--5g7aa6-0, black))",
      },
    );
  });

  it("includes user-defined hook names in variable names in debug mode", () => {
    const createHooks = buildHooksSystem();
    const [hooks, css] = createHooks(
      {
        "@media (min-width: 1000px)": "@media (min-width: 1000px)",
      },
      { debug: true },
    );
    assert.equal(
      normalizeCSS(hooks),
      normalizeCSS(`
        * {
          --_media__min-width__1000px_-umzjoj-0:initial;
          --_media__min-width__1000px_-umzjoj-1: ;
        }
        @media (min-width: 1000px) {
          * {
            --_media__min-width__1000px_-umzjoj-0: ;
            --_media__min-width__1000px_-umzjoj-1:initial;
          }
        }
      `),
    );
    assert.deepEqual(
      css({
        color: "blue",
        "@media (min-width: 1000px)": {
          color: "red",
        },
      }),
      {
        color:
          "var(--_media__min-width__1000px_-umzjoj-1, red) var(--_media__min-width__1000px_-umzjoj-0, blue)",
      },
    );
  });
});

describe("default stringify function", () => {
  it("returns a string value as-is", () => {
    assert.equal(genericStringify("display", "block"), "block");
  });
  it("returns a number value as a string", () => {
    assert.equal(genericStringify("width", 1), "1");
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
      assert.strictEqual(genericStringify("property", value), null);
    });
  });
});
