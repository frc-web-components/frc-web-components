import packageJson from './package.json';
import { getConfig } from '../../vite.config';
import { defineConfig, mergeConfig } from 'vite';
import path from 'node:path';
import { resolve } from 'path';

export default defineConfig(
  mergeConfig(getConfig({ packageJson, usesReact: true }), {
    build: {
      lib: { entry: resolve(process.cwd(), 'src/main.tsx'), formats: ['es'] },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@context-providers': path.resolve(
          __dirname,
          './src/components/context-providers',
        ),
        '@store': path.resolve(__dirname, './src/store'),
      },
    },
    // https://stackoverflow.com/questions/72097831/popper-styled-default-is-not-a-function-mui-5-6-0-material-ui
    optimizeDeps: {
      include: ['@emotion/react', '@emotion/styled', '@mui/material/Tooltip'],
    },
  }),
);
