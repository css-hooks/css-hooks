// @ts-nocheck

const helpers = {
  and: (...and) => ({ and }),
  or: (...or) => ({ or }),
  not: not => ({ not }),
};

function genericStringify(_, value) {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return `${value}`;
  }

  return null;
}

function hash(obj) {
  const jsonString = JSON.stringify(obj);

  let hashValue = 0;

  for (let i = 0; i < jsonString.length; i++) {
    const charCode = jsonString.charCodeAt(i);
    hashValue = (hashValue << 5) - hashValue + charCode;
    hashValue &= 0x7fffffff;
  }

  return hashValue.toString(36);
}

function normalizeCondition(cond) {
  if (!cond) {
    return undefined;
  }
  if (typeof cond === "string") {
    return cond;
  }
  if (typeof cond !== "object") {
    return undefined;
  }
  if ("not" in cond) {
    if (!cond.not) {
      return undefined;
    }
    if (cond.not.not) {
      return normalizeCondition(cond.not.not);
    }
    const inner = normalizeCondition(cond.not);
    return inner ? { not: inner } : undefined;
  }
  const [operator] = Object.keys(cond);
  const [head, ...tail] = cond[operator].map(normalizeCondition).filter(x => x);
  if (!head) {
    return undefined;
  }
  if (tail.length === 0) {
    return head;
  }
  if (tail.length === 1) {
    return { [operator]: [head, tail[0]] };
  }
  return { [operator]: [head, normalizeCondition({ [operator]: tail })] };
}

export function buildHooksSystem(stringify = genericStringify) {
  return function createHooks({
    hooks: hooksConfigUnresolved,
    fallback = "revert-layer",
    debug,
    sort: {
      properties: sortProperties = true,
      conditionalStyles: sortConditionalStyles = true,
    } = {},
    hookNameToId: customHookNameToId,
  }) {
    const hooksConfig =
      typeof hooksConfigUnresolved === "function"
        ? hooksConfigUnresolved(helpers)
        : hooksConfigUnresolved;

    const [space, newline] = debug ? [" ", "\n"] : ["", ""];
    const indent = `${space}${space}`;

    const hookNameToId =
      customHookNameToId ||
      (hookName => {
        const specHash = hash(hooksConfig[hookName]);
        return debug
          ? `${hookName.replace(/[^A-Za-z0-9-]/g, "_")}-${specHash}`
          : specHash;
      });

    function styleSheet() {
      function variablePair({ id, initial, indents }) {
        return [0, 1]
          .map(
            i =>
              `${Array(indents).fill(indent).join("")}--${id}-${i}:${space}${
                initial === i ? "initial" : space ? "" : " "
              };${newline}`,
          )
          .join("");
      }

      let sheet = `*${space}{${newline}`;

      const hooks = Object.entries(hooksConfig)
        .map(([hookName, hookCondition]) => [
          hookName,
          normalizeCondition(hookCondition),
        ])
        .filter(([, hookCondition]) => hookCondition);

      for (const [hookName, hookCondition] of hooks) {
        (function it(id, hookCondition) {
          if (hookCondition && typeof hookCondition === "object") {
            if (hookCondition.not) {
              it(`${id}X`, hookCondition.not);
              sheet += `${indent}--${id}-0:${space}var(--${id}X-1);${newline}`;
              sheet += `${indent}--${id}-1:${space}var(--${id}X-0);${newline}`;
              return;
            }

            if ("and" in hookCondition || "or" in hookCondition) {
              const operator = hookCondition.and ? "and" : "or";
              it(`${id}A`, hookCondition[operator][0]);
              it(`${id}B`, hookCondition[operator][1]);
              if (operator === "and") {
                sheet += `${indent}--${id}-0:${space}var(--${id}A-0)${space}var(--${id}B-0);${newline}`;
                sheet += `${indent}--${id}-1:${space}var(--${id}A-1,${space}var(--${id}B-1));${newline}`;
              } else {
                sheet += `${indent}--${id}-0:${space}var(--${id}A-0,${space}var(--${id}B-0));${newline}`;
                sheet += `${indent}--${id}-1:${space}var(--${id}A-1)${space}var(--${id}B-1);${newline}`;
              }
              return;
            }
          }
          sheet += variablePair({ id, initial: 0, indents: 1 });
        })(hookNameToId(hookName), hookCondition);
      }

      sheet += `}${newline}`;

      for (const [hookName, hookCondition] of hooks) {
        (function it(id, hookCondition) {
          if (hookCondition && typeof hookCondition === "object") {
            if (hookCondition.not) {
              return it(`${id}X`, hookCondition.not);
            }

            if ("and" in hookCondition || "or" in hookCondition) {
              const operator = hookCondition.and ? "and" : "or";
              it(`${id}A`, hookCondition[operator][0]);
              it(`${id}B`, hookCondition[operator][1]);
              return;
            }
          }

          if (typeof hookCondition === "string") {
            if (hookCondition[0] === "@") {
              sheet += [
                `${hookCondition}${space}{${newline}`,
                `${indent}*${space}{${newline}`,
                variablePair({
                  id,
                  initial: 1,
                  indents: 2,
                }),
                `${indent}}${newline}`,
                `}${newline}`,
              ].join("");
            } else {
              sheet += [
                `${hookCondition.replace(/&/g, "*")}${space}{${newline}`,
                variablePair({
                  id,
                  initial: 1,
                  indents: 1,
                }),
                `}${newline}`,
              ].join("");
            }
          }
        })(hookNameToId(hookName), hookCondition);
      }

      return sheet;
    }

    function css(...args) {
      const style = {};
      let conditionCount = 0;
      const rules = JSON.parse(
        JSON.stringify(
          args
            .filter(rule => rule)
            .reduce(
              ([baseStyles, conditionalStyles], rule) => {
                if (rule.on) {
                  baseStyles.push(rule);
                  (sortConditionalStyles ? conditionalStyles : baseStyles).push(
                    ...rule.on(
                      (condition, styles) => [condition, styles],
                      helpers,
                    ),
                  );
                } else {
                  baseStyles.push(rule);
                }
                return [baseStyles, conditionalStyles];
              },
              [[], []],
            )
            .reduce((a, b) => {
              return a.concat(b);
            }, []),
        ),
      );
      for (const rule of rules) {
        if (!rule || typeof rule !== "object") {
          continue;
        }
        if (rule instanceof Array && rule.length === 2) {
          let conditionId = normalizeCondition(rule[0]);
          if (!conditionId) {
            continue;
          }
          if (typeof conditionId === "string") {
            conditionId = hookNameToId(conditionId);
          } else if (typeof conditionId === "object") {
            conditionId = (function it(name, cond) {
              if (typeof cond === "string") {
                return hookNameToId(cond);
              }
              if (cond.not) {
                const inner = it(`${name}X`, cond.not);
                style[`--${name}-0`] = `var(--${inner}-1)`;
                style[`--${name}-1`] = `var(--${inner}-0)`;
              }
              if (cond.and || cond.or) {
                const operator = cond.and ? "and" : "or";
                const a = it(`${name}A`, cond[operator][0]);
                const b = it(`${name}B`, cond[operator][1]);
                if (operator === "and") {
                  style[`--${name}-0`] = `var(--${a}-0)${space}var(--${b}-0)`;
                  style[`--${name}-1`] = `var(--${a}-1,${space}var(--${b}-1))`;
                } else {
                  style[`--${name}-0`] = `var(--${a}-0,${space}var(--${b}-0))`;
                  style[`--${name}-1`] = `var(--${a}-1)${space}var(--${b}-1)`;
                }
              }
              return name;
            })(`cond${conditionCount++}`, conditionId);
          }
          for (const [property, value] of Object.entries(rule[1])) {
            const stringifiedValue = stringify(property, value);
            if (stringifiedValue === null) {
              continue;
            }
            const fallbackValue = (() => {
              if (!(property in style)) {
                return fallback;
              }
              const stringifiedValue = stringify(property, style[property]);
              return stringifiedValue === null ? fallback : stringifiedValue;
            })();
            if (sortProperties) {
              delete style[property];
            }
            style[property] =
              `var(--${conditionId}-1,${space}${stringifiedValue})${space}var(--${conditionId}-0,${space}${fallbackValue})`;
          }
          continue;
        }
        for (const [property, value] of Object.entries(rule)) {
          if (sortProperties) {
            delete style[property];
          }
          style[property] = value;
        }
      }
      return style;
    }

    return { styleSheet, css };
  };
}
