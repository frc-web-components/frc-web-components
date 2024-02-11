import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { nodeResolve } from '@rollup/plugin-node-resolve';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: {
        "fwc-lit": "src/index.ts",
      },
      name: "FwcLit",
      // TODO: multiple entry points are not supported with umd
      // How do we add umd support then?
      formats: ["es"],
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
    rollupOptions: {
      external: [/node_modules/],
      plugins: [nodeResolve()]
    },
  },
  plugins: [dts()],
});
