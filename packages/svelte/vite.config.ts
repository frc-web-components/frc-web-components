import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true,
      },
    }),
    dts(),
  ],
  build: {
    lib: {
      entry: {
        'fwc-svelte': 'src/index.ts',
      },
      name: 'FwcSvelte',
      // TODO: multiple entry points are not supported with umd
      // How do we add umd support then?
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
    rollupOptions: {
      external: ['svelte', '@frc-web-components/fwc'],
    },
  },
});
