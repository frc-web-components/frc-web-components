import { defineConfig, mergeConfig } from 'vite';
import prodConfig from './vite.config';

export default defineConfig(
  mergeConfig(prodConfig, {
    mode: 'development',
    build: {
      sourcemap: true,
      minify: false,
    },
  }),
);
