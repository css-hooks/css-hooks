export const options = ["light", "auto", "dark"] as const;
export const defaultOption: (typeof options)[number] = "auto";
export const switcherId = "global-theme-switcher";
