import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { writeFileSync } from 'fs';
import { join } from 'path';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const packageJson = require('./package.json');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts(),
    {
      name: 'postbuild-commands', // the name of your custom plugin. Could be anything.
      closeBundle: async () => {
        const pluginJson = {
          name: packageJson?.displayName ?? 'Some FWC Plugin',
          description: packageJson?.description ?? '',
          version: packageJson?.version ?? '0.0.0',
        };
        const pluginJsonPath = join(__dirname, 'plugin/plugin.json');

        writeFileSync(pluginJsonPath, JSON.stringify(pluginJson, null, 4));
      },
    },
  ],
  build: {
    lib: {
      entry: {
        'fwc-plugin': 'src/index.ts',
      },
      name: 'fwc-plugin',
      // TODO: multiple entry points are not supported with umd
      // How do we add umd support then?
      formats: ['umd'],
      fileName: () => 'index.js',
    },
    outDir: 'plugin',
    rollupOptions: {
      external: ['lit', '@frc-web-components/app'],
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
    'process.env': process.env,
  },
  server: {
    open: true,
  },
});
