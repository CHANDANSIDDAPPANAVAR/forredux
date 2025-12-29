// eslint.config.js
import reactNative from '@react-native/eslint-config';

export default [
  ...reactNative,  // Spread the official config (array of configs)
  {
    // Optional overrides or additions
    ignores: ['node_modules', 'android', 'ios', 'build', 'dist'],
    // rules: { /* custom rules */ },
  },
];