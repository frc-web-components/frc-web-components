import { defineConfig } from 'vite';
import * as path from 'path';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  build: {
    lib: {
      entry: {
        fwc: 'src/index.ts',
        'get-asset-url': 'src/get-asset-url.ts',
        'load-local-storage': 'src/load-local-storage.ts',
        'components/drivebases/differential':
          'src/elements/base/drivebases/differential.ts',
        'components/drivebases/mecanum':
          'src/elements/base/drivebases/mecanum.ts',
        'components/drivebases/swerve':
          'src/elements/base/drivebases/swerve.ts',
        'components/icon': 'src/elements/base/icon/index.ts',
        'components/basic-fms-info': 'src/elements/base/basic-fms-info.ts',
        'components/boolean-box': 'src/elements/base/boolean-box.ts',
        'components/gyro': 'src/elements/base/gyro.ts',
        'components/number-bar': 'src/elements/base/number-bar.ts',
        'components/gauge': 'src/elements/base/gauge.ts',
        'components/3-axis-accelerometer':
          'src/elements/base/3-axis-accelerometer.ts',
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
  },
  server: {
    open: '/',
  },
  plugins: [basicSsl()],
});
