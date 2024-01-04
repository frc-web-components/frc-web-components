import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
      external: ['@frc-web-components/app'],
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
})
