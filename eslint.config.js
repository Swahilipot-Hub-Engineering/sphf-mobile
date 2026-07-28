const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', '.agents/**'],
  },
  {
    files: ['*.config.js'],
    languageOptions: {
      globals: {
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },
  },
  {
    rules: {
      'react/display-name': 'off',
    },
  },
]);
