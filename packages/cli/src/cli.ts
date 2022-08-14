import { createServer } from 'vite';
import { resolve } from 'path';
import { createHtmlPlugin } from 'vite-plugin-html';

const entry = process.cwd();

(async () => {
  const server = await createServer({
    // any valid user config options, plus `mode` and `configFile`
    configFile: false,
    root: entry,
    server: {
      open: '/',
    },
    publicDir: __dirname,
    plugins: [
      createHtmlPlugin({
        inject: {
          tags: [
            {
              injectTo: 'body',
              tag: 'script',
              attrs: {
                type: 'module',
                src: '/dashboard.js',
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