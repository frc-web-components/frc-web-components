import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      name: 'frc-web-components',
      entry: 'src/get-asset-url.ts',
      formats: ['es'],
      fileName: 'get-asset-url',
    },
    outDir: 'dist2',
  },
  server: {
    open: '/',
  },
});
