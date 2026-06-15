// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'graphify-out/*', 'ios/*', 'android/*'],
  },
  {
    // Reanimated shared values are mutated via `.value =` inside worklets — the
    // canonical, safe idiom. The React-Compiler immutability rule doesn't model
    // shared values, so it false-positives here. Turn it off for our code.
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'react-hooks/immutability': 'off',
    },
  },
]);
