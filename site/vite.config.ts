import react from "@vitejs/plugin-react";
import type { PluginOption } from "vite";
import { defineConfig } from "vite";
import { stringPlugin } from "vite-string-plugin";

export default defineConfig({
  plugins: [react(), stringPlugin() as unknown as PluginOption],
});
