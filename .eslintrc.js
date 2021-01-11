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
    'no-console': 'off',
    'no-unused-vars': 'off',
    'no-param-reassign': 'off',
    'prefer-spread': 'off',
    'no-continue': 'off',
    'no-use-before-define': 'off',
    'consistent-return': 'off',
    'no-plusplus': 'off',
    'prefer-destructuring': 'off',
    'no-sequences': 'off',
    'no-return-assign': 'off',
    'no-unused-expressions': 'off',
    'no-prototype-builtins': 'off',
  },
};
