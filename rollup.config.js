import { camelCase, merge } from 'lodash'
import { dirname, resolve } from 'path'
import { main, module, name, typings } from './package.json'

import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'

const tsConfig = {
  tsconfig: resolve('tsconfig.json')
}

const config = {
  input: 'src/index.ts',
  output: {
    dir: './',
    sourcemap: true
  },
  external: [],
  watch: {
    include: 'src/**',
  },
  plugins: [
    commonjs(),
    replace({'process.env.NODE_ENV': JSON.stringify('development')}),
    nodeResolve(),
  ]
}

const esConfig = merge({}, config, {
  output: {
    entryFileNames: module,
    format: 'es',
  },
  plugins: [typescript(tsConfig)]
})

const umdConfig = merge({}, config, {
  output: {
    entryFileNames: main,
    name: camelCase(name),
    format: 'umd'
  },
  plugins: [typescript({
    ...tsConfig,
    declaration: true,
    declarationDir: dirname(typings),
    rootDir: 'src/'
  })]
})

export default [esConfig, umdConfig]