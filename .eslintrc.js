module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'func-names': ['error', 'never'],
    'max-len': 'off',
    'no-console': 'off',
    'no-unused-vars': 'off',
    'no-param-reassign': 'off',
    'prefer-spread': 'off',
    'no-continue': 'off',
    'no-use-before-define': 'off',
    'array-callback-return': 'off',
    'no-shadow': 'off',
    'consistent-return': 'off',
    'no-plusplus': 'off',
    'prefer-destructuring': 'off',
    'no-sequences': 'off',
    'no-return-assign': 'off',
    'no-unused-expressions': 'off',
    'no-prototype-builtins': 'off',
    'no-restricted-syntax': 'off',
    'guard-for-in': 'off',
  },
};
