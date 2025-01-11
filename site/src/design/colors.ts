function color(chroma: number, hue: number) {
  return function (
    shade:
      | `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
      | `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}${
          | 1
          | 2
          | 3
          | 4
          | 5
          | 6
          | 7
          | 8
          | 9
          | 0}` extends `${infer Shade extends number}`
      ? Shade
      : never,
  ) {
    return `oklch(${Math.round((109.9 - 1.069 * shade) * 100) / 100}% ${chroma} ${hue})`;
  };
}

export const gray = color(0.02, 251);
export const pink = color(0.18, 350);
export const purple = color(0.17, 294);
export const blue = color(0.18, 258);
export const teal = color(0.08, 202);
export const green = color(0.14, 147);
export const yellow = color(0.16, 92);
export const orange = color(0.18, 46);
export const red = color(0.19, 20);
export const black = "oklch(9.5% 0.01 260)";
export const white = "oklch(100% 0.01 260)";