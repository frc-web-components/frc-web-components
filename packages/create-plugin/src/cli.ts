#!/usr/bin/env node

import { create } from 'create-create-app';
import { resolve } from 'path';
import { cpSync } from "fs";

const templateRoot = resolve(__dirname, '..', 'templates');

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
      if (template == "react-custom-dashboard") {
          try {
              console.log(`Copying 3d-models into public...`);
              cpSync(resolve(packageDir, "./node_modules/@frc-web-components/fwc/dist/3d-models"), resolve(packageDir, "./public/3d-models"), {recursive: true});
              console.log("files copied successfully");
          } catch (error) {
              console.error("files could not be copied: " + error);
          }
      }
  },
  // caveat,
})

