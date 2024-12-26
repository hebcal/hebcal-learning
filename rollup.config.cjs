const json = require('@rollup/plugin-json');
const terser = require('@rollup/plugin-terser');
const typescript = require('@rollup/plugin-typescript');
const pkg = require('./package.json');

const banner = '/*! ' + pkg.name + ' v' + pkg.version + ' */';

module.exports = [
  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'dist/esm',
        format: 'es',
        preserveModules: true,
        preserveModulesRoot: 'src',
        name: pkg.name,
        banner,
      },
    ],
    plugins: [
      json({compact: true, preferConst: true}),
      typescript({outDir: 'dist/esm'}),
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
    plugins: [json({compact: true, preferConst: true}), typescript()],
    external: ['@hebcal/core'],
  },
];
