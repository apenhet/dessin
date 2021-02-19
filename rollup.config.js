import { camelCase, merge } from 'lodash';
import { dirname, resolve } from 'path';
import { main, module, name, typings } from './package.json'

import typescript from '@rollup/plugin-typescript';

const config = {
  input: 'src/index.ts',
  output: {
    dir: __dirname,
    sourcemap: true
  },
  external: [],
  watch: {
    include: 'src/**',
  },
  plugins: []
}

const esConfig = merge({}, config, {
  output: {
    entryFileNames: module,
    format: 'es'
  },
  plugins: [typescript({
    tsconfig: resolve('tsconfig.json')
  })]
})

const umdConfig = merge({}, config, {
  output: {
    entryFileNames: main,
    name: camelCase(name),
    format: 'umd'
  },
  plugins: [typescript({
    tsconfig: resolve('tsconfig.json'),
    declaration: true,
    declarationDir: dirname(typings),
    rootDir: 'src/'
  })]
})

export default [esConfig, umdConfig]