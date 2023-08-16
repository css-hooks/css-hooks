import createHooksFn from "../src/createHooksFn";

describe("`createHooksFn`-produced hooks function", () => {
  it("renders hook values in the reverse of the specified order", () => {
    const hooks = createHooksFn<{ color?: string }>()(
      "camel",
      (_, x) => (typeof x === "string" ? `${x}` : ""),
      ["test-hook-a", "test-hook-b", "test-hook-c"] as const,
    );
    expect(
      hooks({
        color: "red",
        testHookA: { color: "yellow" },
        testHookB: { color: "green" },
        testHookC: { color: "blue" },
      }),
    ).toEqual({
      color:
        "var(--test-hook-c-1, blue) var(--test-hook-c-0, var(--test-hook-b-1, green) var(--test-hook-b-0, var(--test-hook-a-1, yellow) var(--test-hook-a-0, red)))",
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
        "var(--test-hook-a-1, blue) var(--test-hook-a-0, var(--test-hook-c-1, green) var(--test-hook-c-0, var(--test-hook-b-1, yellow) var(--test-hook-b-0, red)))",
    });
  });

  it("allows the default property value to be defined after hooks (mimicking specificity)", () => {
    const hooks = createHooksFn<{ "text-decoration"?: "underline" | "none" }>()(
      "kebab",
      (_, value) => (typeof value === "string" ? value : null),
      ["test-hook"] as const,
    );
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
    const hooks = createHooksFn<{
      color?: string;
      "background-color"?: string;
    }>()("kebab", () => "", ["test-hook"] as const);
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
    const hooks = createHooksFn<{ color?: string }>()(
      "kebab",
      (_, value) => (typeof value === "string" ? value : null),
      ["test-hook"] as const,
    );
    expect(hooks({ "test-hook": { color: "red" } })).toEqual({
      color: "var(--test-hook-1, red) var(--test-hook-0, unset)",
    });
  });

  it("falls back to `unset` when the default value can't be stringified", () => {
    const hooks = createHooksFn<{ color?: string }>()(
      "camel",
      (_, value) => (value === "hook" ? value : null),
      ["test-hook"] as const,
    );
    expect(hooks({ color: "invalid", testHook: { color: "hook" } })).toEqual({
      color: "var(--test-hook-1, hook) var(--test-hook-0, unset)",
    });
  });

  it("ignores a hook value that can't be stringified", () => {
    const hooks = createHooksFn<{ color?: string }>()(
      "camel",
      (_, value) => (value === "default" ? value : null),
      ["test-hook"] as const,
    );
    expect(hooks({ color: "default", testHook: { color: "invalid" } })).toEqual(
      { color: "default" },
    );
  });

  it('uses as-is a value that is already a string starting with "var("', () => {
    const hooks = createHooksFn<{ color?: string }>()(
      "kebab",
      (_, value) => (typeof value === "string" ? `[${value}]` : null),
      ["test-hook-a", "test-hook-b"] as const,
    );
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
});
