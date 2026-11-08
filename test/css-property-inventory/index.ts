import { chromium, firefox, webkit } from "playwright";

export async function cssPropertyInventory() {
  const properties: { name: string; unitless: boolean }[] = [];
  for (const browserType of [chromium, firefox, webkit]) {
    const browser = await browserType.launch();
    try {
      const page = await browser.newPage();
      const currentProperties = await page.evaluate(() => {
        const { style } = document.documentElement;
        const properties = new Set<string>();
        for (const key in style) {
          if (typeof key === "string") {
            properties.add(
              key
                .replace(/[A-Z]/g, "-$&")
                .toLowerCase()
                .replace(/^(webkit|moz|ms|o)-/, "-$&"),
            );
          }
        }
        return [...properties].flatMap(name => {
          if (CSS.supports(name, "1")) return [{ name, unitless: true }];
          if (CSS.supports(name, "1px")) return [{ name, unitless: false }];
          return [];
        });
      });
      for (const current of currentProperties) {
        const existing = properties.find(
          property => property.name === current.name,
        );
        if (existing) {
          existing.unitless = existing.unitless && current.unitless;
        } else {
          properties.push(current);
        }
      }
    } finally {
      await browser.close();
    }
  }
  return properties;
}
