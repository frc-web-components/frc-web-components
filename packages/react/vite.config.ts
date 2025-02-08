import packageJson from './package.json';
import { getConfig } from '../../vite.config';
import { defineConfig, mergeConfig } from 'vite';
import fs from 'fs';
import path from 'node:path';

function getEntries(): Record<string, string> {
  const componentEntries: Record<string, string> = {};

  const folderPath = path.resolve(__dirname, 'src/components');
  const fileNames = fs.readdirSync(folderPath);

  fileNames.forEach((fileName) => {
    const componentName = fileName.split('.')[0];
    componentEntries[`components/${componentName}`] =
      `src/components/${fileName}`;
  });

  return {
    'fwc-react': 'src/index.ts',
    'components/index': 'src/components/index.ts',
    'networktables/index': 'src/networktables/index.ts',
    ...componentEntries,
  };
}

export default defineConfig(
  mergeConfig(getConfig({ packageJson, usesReact: true }), {
    build: {
      lib: {
        entry: getEntries(),
        formats: ['es'],
        fileName: (format, entryName) => `${entryName}.${format}.js`,
      },
    },
  }),
);
