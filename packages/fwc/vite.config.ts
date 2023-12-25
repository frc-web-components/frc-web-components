import { defineConfig, Plugin } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
import fs from 'fs';
import path from 'node:path';

const argv = yargs(hideBin(process.argv)).argv;

const plugins: Plugin[] = [];

if ((argv as any)._.includes('--useHttps')) {
  plugins.push(basicSsl());
}

function getEntries(folder: string): Record<string, string> {
  const entries: Record<string, string> = {};

  const folderPath = path.resolve(__dirname, `src/${folder}`);
  const fileNames = fs.readdirSync(folderPath, { withFileTypes: true });

  fileNames.forEach((fileName) => {
    if (fileName.isDirectory()) {
      entries[
        `${folder}/${fileName.name}`
      ] = `src/${folder}/${fileName.name}/index.ts`;
    }
  });

  return {
    [folder]: `src/${folder}/index.ts`,
    ...entries,
  };
}

function getAllEntries(): Record<string, string> {
  return {
    ...getEntries('components'),
    ...getEntries('source-providers'),
    themes: 'src/themes/index.ts',
    fwc: 'src/index.ts',
    'source-view': 'src/source-view.ts',
    'get-asset-url': 'src/get-asset-url.ts',
    'load-local-storage': 'src/load-local-storage.ts',
  };
}

export default defineConfig({
  build: {
    lib: {
      entry: getAllEntries(),
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
  },
  server: {
    open: '/',
  },
  plugins,
});
