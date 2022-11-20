const { defineConfig } = require('vite');

module.exports = defineConfig({
  build: {
    lib: {
      name: 'frc-web-components',
      entry: 'src/index.ts',
      formats: ['es'],
    },
  },
});
