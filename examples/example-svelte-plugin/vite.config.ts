import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte({
    compilerOptions: {
      customElement: true,
    }
  })],
  build: {
    lib: {
      entry: {
        "fwc-plugin": "src/index.ts",
      },
      name: "fwc-plugin",
      // TODO: multiple entry points are not supported with umd
      // How do we add umd support then?
      formats: ["es"],
      fileName: 'fwc-plugin',
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
})
