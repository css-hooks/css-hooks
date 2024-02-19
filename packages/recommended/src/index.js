// @ts-nocheck

export function recommended(config) {
  const colorSchemes = (config.colorSchemes || [])
    .map(x => `@media (prefers-color-scheme: ${x})`)
    .reduce((obj, x) => ({ ...obj, [x]: x }), {});

  const breakpoints =
    config.breakpoints
      ?.flatMap((x, i, arr) => {
        if (arr.length === 1) {
          return [`@media (width < ${x})`, `@media (${x} <= width)`];
        }
        if (i === 0) {
          return [`@media (width < ${x})`];
        }
        const previous = arr[i - 1];
        return [
          `@media (${previous} <= width < ${x})`,
          ...(i === arr.length - 1 ? [`@media (${x} <= width)`] : []),
        ];
      })
      .reduce((obj, x) => ({ ...obj, [x]: x }), {}) || {};

  const pseudoClasses =
    config.pseudoClasses?.reduce(
      (obj, x) => ({ ...obj, [`&${x}`]: `&${x}` }),
      {},
    ) || {};

  return {
    ...colorSchemes,
    ...breakpoints,
    ...pseudoClasses,
  };
}
