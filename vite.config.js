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
        // base components
        'components/bar': 'src/components/bar.ts',
        'components/axis': 'src/components/axis.ts',
        'components/icon': 'src/components/icon/index.ts',
        // drivebase components
        'components/drivebases/differential':
          'src/components/drivebases/differential.ts',
        'components/drivebases/mecanum': 'src/components/drivebases/mecanum.ts',
        'components/drivebases/swerve': 'src/components/drivebases/swerve.ts',
        // field components
        'components/field/field': 'src/components/field/field.ts',
        'components/field/field-robot': 'src/components/field/field-robot.ts',
        'components/field/field-configs':
          'src/components/field/field-configs.ts',
        'components/field3d/field3d': 'src/components/field3d/field3d.ts',
        'components/field3d/field3d-object':
          'src/components/field3d/field3d-object.ts',
        'components/field3d/field-configs':
          'src/components/field3d/field-configs.ts',
        'components/field3d/object-configs':
          'src/components/field3d/object-configs.ts',
        // canvas
        'components/canvas/canvas': 'src/components/canvas/canvas.ts',
        'components/canvas/canvas-circle':
          'src/components/canvas/canvas-circle.ts',
        'components/canvas/canvas-group':
          'src/components/canvas/canvas-group.ts',
        'components/canvas/canvas-line': 'src/components/canvas/canvas-line.ts',
        'components/canvas/canvas-ngon': 'src/components/canvas/canvas-ngon.ts',
        'components/canvas/canvas-rect': 'src/components/canvas/canvas-rect.ts',
        'components/canvas/canvas-text': 'src/components/canvas/canvas-text.ts',
        'components/canvas/interfaces': 'src/components/canvas/interfaces.ts',
        // other components
        'components/3-axis-accelerometer':
          'src/components/3-axis-accelerometer.ts',
        'components/accelerometer': 'src/components/accelerometer.ts',
        'components/basic-fms-info': 'src/components/basic-fms-info.ts',
        'components/boolean-box': 'src/components/boolean-box.ts',
        'components/gauge': 'src/components/gauge.ts',
        'components/gyro': 'src/components/gyro.ts',
        'components/number-bar': 'src/components/number-bar.ts',
        'components/sendable-chooser': 'src/components/sendable-chooser.ts',
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
