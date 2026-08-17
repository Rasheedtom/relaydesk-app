import { defineConfig } from "vite";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.js"],
    coverage: { reporter: ["text", "json-summary"] },
  },
});
