import { defineConfig } from 'vite';
import * as path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        fwc: 'src/index.ts',
        'get-asset-url': 'src/get-asset-url.ts',
        'load-local-storage': 'src/load-local-storage.ts',
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
  },
  server: {
    open: '/',
  },
});
