#!/usr/bin/env node

import { create } from 'create-create-app';
import { resolve } from 'path';
import fs from 'fs';
import { DownloaderHelper } from 'node-downloader-helper';
import decompress from 'decompress';

const templateRoot = resolve(__dirname, '..', 'templates');
const modelsUrl =
  'https://github.com/frc-web-components/frc-web-components/raw/master/assets/3d-models-zip.zip';
const downloadName = '3d-models-zip';
const downloadUnzipName = '3d-models';

// const caveat = `
// This is a caveat!
// You can change this in \`src/cli.ts\`.
// `;

// See https://github.com/uetchy/create-create-app/blob/master/README.md for other options.

create('create-plugin', {
  templateRoot,
  promptForTemplate: true,
  defaultTemplate: 'lit-plugin',
  // extra: {
  //   architecture: {
  //     type: 'list',
  //     describe: 'choose your fave os',
  //     choices: ['macOS', 'Windows', 'Linux'],
  //     prompt: 'if-no-arg',
  //   },
  // },
  after: ({ packageDir, template }) => {
    if (
      template == 'react-custom-dashboard' ||
      template == 'svelte-custom-dashboard'
    ) {
      const zipPath = resolve(packageDir, './public/temp'); // defines the path to the zip download
      const outputPath = resolve(packageDir, './public/3d-models'); // defines the path to the folder to copy the files to
      fs.mkdirSync(zipPath); // makes the output directory
      const dl = new DownloaderHelper(modelsUrl, zipPath); // downloads the zip file form the link to a temporary folder

      dl.on('end', () => {
        console.log('Files downloaded. Unzipping files');
        decompress(resolve(zipPath, downloadName + '.zip'), zipPath).then(
          () => {
            // decompresses the zip
            console.log('Files unzipped successfully.');
            fs.cpSync(resolve(zipPath, downloadUnzipName), outputPath, {
              recursive: true,
            }); // copies the files to the destination folder
            fs.rmSync(zipPath, { recursive: true }); // removes the temporary folder
          },
        );
      });
      dl.on('error', (err) => {
        console.log('failed to download');
        console.error(err);
      });
      console.log('Downloading files from git');
      dl.start();
    }
  },
  // caveat,
});
