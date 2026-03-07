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

export const purple = color(0.155, 302);
export const gray = color(0.02, 302);
export const pink = color(0.18, 340);
export const blue = color(0.18, 265);
export const teal = color(0.14, 190);
export const green = color(0.14, 145);
export const yellow = color(0.17, 95);
export const orange = color(0.18, 55);
export const red = color(0.19, 25);

export const black = "black";
export const white = "white";
