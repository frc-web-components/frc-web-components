import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: {
        "fwc-plugin": "src/index.ts",
      },
      name: "fwc-plugin",
      // TODO: multiple entry points are not supported with umd
      // How do we add umd support then?
      formats: ["umd"],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ["lit", '@frc-web-components/app'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          '@frc-web-components/app': 'fwcApp',
        },
      },
    },
  },
  define: {
    'process.env': process.env
  }
});
