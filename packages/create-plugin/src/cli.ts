#!/usr/bin/env node

import { create } from 'create-create-app';
import { resolve } from 'path';
import fs from "fs";
import { DownloaderHelper } from "node-downloader-helper";
import decompress from "decompress"

const templateRoot = resolve(__dirname, '..', 'templates');
const modelsUrl = "https://github.com/HarlanHaller/3d-models-temp/raw/main/3d-models-zip.zip";
const downloadName = "3d-models-zip"

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
  after: ({ packageDir, template}) => {
      if (template == "react-custom-dashboard" || template == "svelte-custom-dashboard") {
          const zipPath = resolve(packageDir, "./public/temp");
          const outputPath = resolve(packageDir, "./public/3d-models");
          fs.mkdirSync(zipPath)
          console.log("Downloading files from git");
          const dl = new DownloaderHelper(modelsUrl, zipPath);

          dl.on('end', () => {
              console.log("Files downloaded. Unzipping files");
              decompress(resolve(zipPath, downloadName + ".zip"), zipPath).then(() => {
                  console.log("Files unzipped successfully.");
                  fs.cpSync(resolve(zipPath, downloadName), outputPath, {recursive: true})
                  fs.rmSync(zipPath, { recursive: true });
              });
          });
          dl.on('error', (err) => {
              console.log("failed to download");
              console.error(err);
          });
          dl.start();
      }
  },
  // caveat,
})

