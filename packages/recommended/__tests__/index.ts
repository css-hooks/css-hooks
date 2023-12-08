import { recommended } from "../src";

describe("recommended", () => {
  describe("when no color schemes are specified", () => {
    it("produces no prefers-color-scheme media query hooks", () => {
      [
        recommended({
          colorSchemes: [],
        }),
        recommended({}),
      ].forEach(config => {
        expect(Object.keys(config).length).toEqual(0);
      });
    });
  });

  (["dark", "light"] as const).forEach(colorScheme => {
    describe(`when ${colorScheme} color scheme is specified`, () => {
      it(`produces a (prefers-color-scheme: ${colorScheme}) media query hook`, () => {
        const config = recommended({
          colorSchemes: [colorScheme],
        });
        expect(config[`@media (prefers-color-scheme: ${colorScheme})`]).toEqual(
          `@media (prefers-color-scheme: ${colorScheme})`,
        );
      });
    });
  });

  describe(`when multiple color schemes are specified`, () => {
    it(`produces prefers-color-scheme media query hooks per the specified color schemes`, () => {
      const config = recommended({
        colorSchemes: ["dark", "light"],
      });
      (["dark", "light"] as const).forEach(colorScheme => {
        expect(config[`@media (prefers-color-scheme: ${colorScheme})`]).toEqual(
          `@media (prefers-color-scheme: ${colorScheme})`,
        );
      });
    });
  });

  describe("when no breakpoints are specified", () => {
    it("produces no width media query hooks", () => {
      [
        recommended({
          breakpoints: [],
        }),
        recommended({}),
      ].forEach(config => {
        expect(Object.keys(config).length).toEqual(0);
      });
    });
  });

  describe("when one breakpoint is specified", () => {
    it("produces width media query hooks per the specified breakpoint", () => {
      const config = recommended({
        breakpoints: ["700px"],
      });
      (["@media (width < 700px)", "@media (700px <= width)"] as const).forEach(
        mediaQuery => {
          expect(config[mediaQuery]).toEqual(mediaQuery);
        },
      );
    });
  });

  describe("when multiple breakpoints are specified", () => {
    it("produces width media query hooks per the specified breakpoints", () => {
      const config = recommended({
        breakpoints: ["480px", "960px"],
      });
      (
        [
          "@media (width < 480px)",
          "@media (480px <= width < 960px)",
          "@media (960px <= width)",
        ] as const
      ).forEach(mediaQuery => {
        expect(config[mediaQuery]).toEqual(mediaQuery);
      });
    });
  });

  describe("when no pseudo-classes are specified", () => {
    it("produces no pseudo-class selector hooks", () => {
      [
        recommended({
          pseudoClasses: [],
        }),
        recommended({}),
      ].forEach(config => {
        expect(Object.keys(config).length).toEqual(0);
      });
    });
  });

  describe("when pseudo-classes are specified", () => {
    it("produces pseudo-class hooks per the specified pseudo-classes", () => {
      const config = recommended({
        pseudoClasses: [":hover", ":nth-child(2n + 3)"],
      });
      expect(config[":hover"]).toEqual(":hover");
      expect(config[":nth-child(2n + 3)"]).toEqual(":nth-child(2n + 3)");
    });
  });
});
