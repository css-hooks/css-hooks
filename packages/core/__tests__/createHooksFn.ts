import createHooksFn from "../src/createHooksFn";

describe("`createHooksFn`-produced hooks function", () => {
  it("renders hook values in the reverse of the specified order", () => {
    const casing = "camel" as const;
    const hookTypes = ["test-hook-a", "test-hook-b", "test-hook-c"] as const;
    const hooks = createHooksFn<
      typeof casing,
      typeof hookTypes,
      { color?: string }
    >(casing, hookTypes, (_, x) => (typeof x === "string" ? `${x}` : ""));
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
    const casing = "kebab" as const;
    const hookTypes = ["test-hook"] as const;
    const hooks = createHooksFn<
      typeof casing,
      typeof hookTypes,
      { "text-decoration"?: "underline" | "none" }
    >(casing, hookTypes, (_, value) =>
      typeof value === "string" ? value : null,
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
    const casing = "kebab" as const;
    const hookTypes = ["test-hook"] as const;
    const hooks = createHooksFn<
      typeof casing,
      typeof hookTypes,
      {
        color?: string;
        "background-color"?: string;
      }
    >("kebab", hookTypes, () => "");
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
    const casing = "kebab" as const;
    const hookTypes = ["test-hook"] as const;
    const hooks = createHooksFn<
      typeof casing,
      typeof hookTypes,
      { color?: string }
    >(casing, hookTypes, (_, value) =>
      typeof value === "string" ? value : null,
    );
    expect(hooks({ "test-hook": { color: "red" } })).toEqual({
      color: "var(--test-hook-1, red) var(--test-hook-0, unset)",
    });
  });

  it("falls back to `unset` when the default value can't be stringified", () => {
    const casing = "camel" as const;
    const hookTypes = ["test-hook"] as const;
    const hooks = createHooksFn<
      typeof casing,
      typeof hookTypes,
      { color?: string }
    >(casing, hookTypes, (_, value) => (value === "hook" ? value : null));
    expect(hooks({ color: "invalid", testHook: { color: "hook" } })).toEqual({
      color: "var(--test-hook-1, hook) var(--test-hook-0, unset)",
    });
  });

  it("ignores a hook value that can't be stringified", () => {
    const casing = "camel";
    const hookTypes = ["test-hook"] as const;
    const hooks = createHooksFn<
      typeof casing,
      typeof hookTypes,
      { color?: string }
    >(casing, hookTypes, (_, value) => (value === "default" ? value : null));
    expect(hooks({ color: "default", testHook: { color: "invalid" } })).toEqual(
      { color: "default" },
    );
  });

  it('uses as-is a value that is already a string starting with "var("', () => {
    const casing = "kebab" as const;
    const hookTypes = ["test-hook-a", "test-hook-b"] as const;
    const hooks = createHooksFn<
      typeof casing,
      typeof hookTypes,
      { color?: string }
    >(casing, hookTypes, (_, value) =>
      typeof value === "string" ? `[${value}]` : null,
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

  it("allows hooks to be combined via nesting", () => {
    const casing = "camel" as const;
    const hookTypes = ["test-hook-a", "test-hook-b"] as const;
    const hooks = createHooksFn<
      typeof casing,
      typeof hookTypes,
      { color?: string }
    >(casing, hookTypes, (_, value) =>
      typeof value === "string" ? `[${value}]` : null,
    );
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
        "var(--test-hook-a-1, var(--test-hook-b-1, [pink]) var(--test-hook-b-0, [red])) var(--test-hook-a-0, [black])",
    });
  });

  it("falls back multiple levels if needed", () => {
    const casing = "kebab" as const;
    const hookTypes = ["test-hook-a", "test-hook-b"] as const;
    const hooks = createHooksFn<
      typeof casing,
      typeof hookTypes,
      { color?: string }
    >(casing, hookTypes, (_, value) =>
      typeof value === "string" && value !== "invalid" ? `[${value}]` : null,
    );
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
