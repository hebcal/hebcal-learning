import gtsConfig from 'gts/build/src/index.js';
import globals from 'globals';

export default [
  ...gtsConfig,
  {
    ignores: [
      'build/',
      'test/',
      'docs/',
      'dist/',
      'src/*.json.ts',
      'src/*.po.ts',
    ],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
];
