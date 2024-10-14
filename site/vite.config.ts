import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { stringPlugin } from "vite-string-plugin";

export default defineConfig({
  plugins: [react(), stringPlugin()],
});
