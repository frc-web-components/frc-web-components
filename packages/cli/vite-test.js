// import { fileURLToPath } from 'url'
const { fileURLToPath } = require('url');
const { createServer } = require('vite');

// const dirname = fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  const server = await createServer({
    // any valid user config options, plus `mode` and `configFile`
    
    configFile: false,
    root: __dirname,
    server: {
      port: 1337
    },
  })
  await server.listen()

  server.printUrls();
})()