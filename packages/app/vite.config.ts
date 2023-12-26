import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: {
        "fwc-app": "src/index.ts",
      },
      name: "FwcApp",
      // TODO: multiple entry points are not supported with umd
      // How do we add umd support then?
      formats: ["es"],
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
    rollupOptions: {
      external: ["lit", '@frc-web-components/fwc'],
    },
  },
});
