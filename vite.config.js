import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import yargsHelpers from 'yargs/helpers';
import yargs from 'yargs/yargs';

const argv = yargs(yargsHelpers.hideBin(process.argv)).argv;

const plugins = [];

if (argv._.includes('--useHttps')) {
  plugins.push(basicSsl());
}

export default defineConfig({
  build: {
    lib: {
      entry: {
        fwc: 'src/index.ts',
        'get-asset-url': 'src/get-asset-url.ts',
        'load-local-storage': 'src/load-local-storage.ts',
        'source-view': 'src/source-view.ts',
        'source-providers/nt4/NT4': 'src/source-providers/nt4/NT4.ts',
        'source-providers/nt4/nt4-provider':
          'src/source-providers/nt4/nt4-provider.ts',
        // components
        'components/bar': 'src/components/bar/index.ts',
        'components/axis': 'src/components/axis/index.ts',
        'components/icon': 'src/components/icon/index.ts',
        'components/drivebases': 'src/components/drivebases/index.ts',
        'components/field': 'src/components/field/index.ts',
        'components/field3d': 'src/components/field3d/index.ts',
        'components/canvas': 'src/components/canvas/index.ts',
        'components/line-chart': 'src/components/line-chart/index.ts',
        'components/mechanism2d': 'src/components/mechanism2d/index.ts',
        'components/logger': 'src/components/logger/index.ts',
        'components/3-axis-accelerometer':
          'src/components/3-axis-accelerometer/index.ts',
        'components/accelerometer': 'src/components/accelerometer/index.ts',
        'components/basic-fms-info': 'src/components/basic-fms-info/index.ts',
        'components/boolean-box': 'src/components/boolean-box/index.ts',
        'components/gauge': 'src/components/gauge/index.ts',
        'components/gyro': 'src/components/gyro/index.ts',
        'components/number-bar': 'src/components/number-bar/index.ts',
        'components/sendable-chooser':
          'src/components/sendable-chooser/index.ts',
        'components/encoder': 'src/components/encoder/index.ts',
        'components/relay': 'src/components/relay/index.ts',
        // all components
        components: 'src/components/index.ts',
        // lit
        'lit/create-dashboard': 'src/lit/create-dashboard.ts',
        'lit/directives': 'src/lit/directives.ts',
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
  },
  server: {
    open: '/',
  },
  plugins,
});
