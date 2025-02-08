import packageJson from './package.json';
import { getConfig } from '../../vite.config';
import { defineConfig, mergeConfig } from 'vite';
import fs from 'fs';
import path from 'node:path';

function getEntries(folder: string): Record<string, string> {
  const entries: Record<string, string> = {};

  const folderPath = path.resolve(__dirname, `src/${folder}`);
  const fileNames = fs.readdirSync(folderPath, { withFileTypes: true });

  fileNames.forEach((fileName) => {
    if (fileName.isDirectory()) {
      entries[`${folder}/${fileName.name}`] =
        `src/${folder}/${fileName.name}/index.ts`;
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
  };
}

export default defineConfig(
  mergeConfig(getConfig({ packageJson }), {
    build: {
      lib: {
        entry: getAllEntries(),
        formats: ['es'],
        fileName: (format, entryName) => `${entryName}.${format}.js`,
      },
    },
  }),
);
