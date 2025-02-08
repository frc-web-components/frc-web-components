import {
  AliasOptions,
  defineConfig,
  mergeConfig,
  PluginOption,
  UserConfig,
} from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { atomicBuildPlugin } from './atomic-build-plugin';
import react from '@vitejs/plugin-react';

type NodePolyfill = 'stream' | 'path' | 'crypto';

interface PackageJson {
  [key: string]: unknown;
  peerDependencies?: {
    [key: string]: string;
  };
}

interface ConfigOptions {
  isDev: boolean;
  packageJson: PackageJson;
  usesReact: boolean;
  nodePolyfills: NodePolyfill[];
  disableAtomicBuild: boolean;
}

export function getConfig(options: Partial<ConfigOptions> = {}): UserConfig {
  // set defaults
  const isDev = options.isDev ?? false;
  const packageJson = options.packageJson ?? {};
  const usesReact = options.usesReact ?? false;
  const nodePolyfills = options.nodePolyfills ?? [];
  const disableAtomicBuild = options.disableAtomicBuild ?? false;

  const peerDependencies = packageJson.peerDependencies ?? {};

  let plugins: PluginOption[] = [];
  let external: string[] = [];
  const alias: AliasOptions = {
    src: resolve('src/'),
  };

  if (usesReact) {
    plugins.push(react());
    external.push('react/jsx-runtime');
  }

  plugins = [...plugins, dts({ outDir: 'types' })];
  external = [...external, ...Object.keys(peerDependencies)];

  if (!disableAtomicBuild) {
    plugins.push(atomicBuildPlugin());
  }

  if (nodePolyfills.includes('stream')) {
    alias.stream = 'stream-browserify';
  }
  if (nodePolyfills.includes('path')) {
    alias.path = 'path-browserify';
  }
  if (nodePolyfills.includes('crypto')) {
    alias.crypto = 'crypto-browserify';
  }

  // https://vitejs.dev/config/
  let config = defineConfig({
    build: {
      lib: { entry: resolve(process.cwd(), 'src/index.ts'), formats: ['es'] },
      rollupOptions: { external },
    },
    resolve: { alias },
    plugins,
  });

  if (isDev) {
    config = defineConfig(
      mergeConfig(config, {
        mode: 'development',
        build: {
          sourcemap: true,
          minify: false,
        },
      }),
    );
  }

  return config;
}
