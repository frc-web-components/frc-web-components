const { defineConfig } = require('vite');

module.exports = defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
    },
    rollupOptions: {
      external: /^lit|@frc-web-components\/dashboard/,
    },
  },
});
