#! /usr/bin/env node

import { createServer } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { program } from 'commander';
import { resolve } from 'path';

program
  .option('--dashboard <dashboard root path>', 'relative dashboard root path', '')
  .option('--plugin <plugin path>', 'relative plugin path');

program.parse(process.argv);

const options = program.opts();

const entry = process.cwd();

(async () => {
  const server = await createServer({
    // any valid user config options, plus `mode` and `configFile`
    configFile: false,
    root: resolve(entry, options.dashboard),
    server: {
      open: '/',
    },
    publicDir: __dirname,
    define: {
      'process.env.PLUGIN_PATH': JSON.stringify(options.plugin),
    },
    plugins: [
      createHtmlPlugin({
        inject: {
          tags: [
            {
              injectTo: 'body',
              tag: 'script',
              attrs: {
                type: 'module',
                src: '/iife/dashboard.js',
              },
            },
          ],
        },
      }),
    ],
  });
  await server.listen();

  server.printUrls();
})();