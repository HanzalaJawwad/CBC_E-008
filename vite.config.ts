import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" &&
      visualizer({
        filename: "./dist/bundle-analysis.html",
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: "esbuild",
    cssCodeSplit: true,
    sourcemap: mode === "development",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) {
              return "vendor_react";
            }
            if (id.includes("radix-ui")) {
              return "vendor_radix";
            }
            if (id.includes("tailwindcss")) {
              return "vendor_tailwind";
            }
            return "vendor";
          }
        },
      },
    },
  },
}));
