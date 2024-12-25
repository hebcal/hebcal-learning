const json = require('@rollup/plugin-json');
const terser = require('@rollup/plugin-terser');
const typescript = require('@rollup/plugin-typescript');
const {dts} = require('rollup-plugin-dts');
const pkg = require('./package.json');

const banner = '/*! ' + pkg.name + ' v' + pkg.version + ' */';

module.exports = [
  {
    input: 'src/index.ts',
    output: [
      {file: pkg.module, format: 'es', name: pkg.name, banner},
    ],
    plugins: [
      json({compact: true, preferConst: true}),
      typescript(),
    ],
    external: ['@hebcal/core'],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/bundle.js',
        format: 'iife',
        name: 'hebcal__learning',
        globals: {
          '@hebcal/core': 'hebcal',
        },
        indent: false,
        banner,
      },
      {
        file: 'dist/bundle.min.js',
        format: 'iife',
        name: 'hebcal__learning',
        globals: {
          '@hebcal/core': 'hebcal',
        },
        plugins: [terser()],
        banner,
      },
    ],
    plugins: [
      json({compact: true, preferConst: true}),
      typescript(),
    ],
    external: ['@hebcal/core'],
  },
  {
    input: 'dist/index.d.ts',
    output: [{file: 'dist/module.d.ts', format: 'es'}],
    external: ['node:fs'],
    plugins: [dts()],
  },
];
