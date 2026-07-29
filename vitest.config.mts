import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
    deps: {
      optimizer: {
        web: {
          include: ["@testing-library/react", "@testing-library/jest-dom"],
        },
        ssr: {
          include: ["@exodus/bytes", "html-encoding-sniffer"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
