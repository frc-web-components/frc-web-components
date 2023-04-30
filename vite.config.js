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
        'source-providers/nt4/NT4': 'src/source-providers/nt4/NT4.ts',
        // base components
        'components/bar': 'src/elements/base/base-elements/bar.ts',
        'components/axis': 'src/elements/base/base-elements/axis.ts',
        'components/icon': 'src/elements/base/icon/index.ts',
        // drivebase components
        'components/drivebases/differential':
          'src/elements/base/drivebases/differential.ts',
        'components/drivebases/mecanum':
          'src/elements/base/drivebases/mecanum.ts',
        'components/drivebases/swerve':
          'src/elements/base/drivebases/swerve.ts',
        // field components
        'components/field/field': 'src/elements/base/field/field.ts',
        'components/field/field-robot':
          'src/elements/base/field/field-robot.ts',
        'components/field/field-configs':
          'src/elements/base/field/field-configs.ts',
        'components/field3d/field3d': 'src/elements/base/field3d/field3d.ts',
        'components/field3d/field3d-object':
          'src/elements/base/field3d/field3d-object.ts',
        'components/field3d/field-configs':
          'src/elements/base/field3d/field-configs.ts',
        'components/field3d/object-configs':
          'src/elements/base/field3d/object-configs.ts',
        // other components
        'components/3-axis-accelerometer':
          'src/elements/base/3-axis-accelerometer.ts',
        'components/accelerometer': 'src/elements/base/accelerometer.ts',
        'components/basic-fms-info': 'src/elements/base/basic-fms-info.ts',
        'components/boolean-box': 'src/elements/base/boolean-box.ts',
        'components/gauge': 'src/elements/base/gauge.ts',
        'components/gyro': 'src/elements/base/gyro.ts',
        'components/number-bar': 'src/elements/base/number-bar.ts',
        'components/sendable-chooser': 'src/elements/base/sendable-chooser.ts',
        // all components
        components: 'src/elements/base/index.ts',
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
