// const path = require('path');

// module.exports = {
//   // build: {
//   //   lib: {
//   //     entry: path.resolve(__dirname, 'src/index.js'),
//   //     name: 'components'
//   //   },
//   //   rollupOptions: {
//   //     // make sure to externalize deps that shouldn't be bundled
//   //     // into your library
//   //     external: ['lit-element', 'd3'],
//   //     output: {
//   //       // Provide global variables to use in the UMD build
//   //       // for externalized deps
//   //       globals: {
//   //         'lit-element': 'litElement',
//   //         'd3': 'd3'
//   //       }
//   //     }
//   //   }
//   // },
//   // plugins: [
//   //   ['@babel/plugin-proposal-decorators', {decoratorsBeforeExport: true}],
//   //   ["@babel/plugin-proposal-class-properties", {"loose": true}],
//   // ]
// }

const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'MyLib',
      // fileName: (format) => `index.${format}.js`
    }
  }
})