const json = require('@rollup/plugin-json');
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
    external: [/@hebcal/],
  },
];
