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
    'no-param-reassign': 'off',
  },
};
