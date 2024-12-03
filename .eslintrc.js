const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
    'babel',
    'deprecation',
  ],
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['node_modules/'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.tsx'],
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
      },
    ],
    'react/jsx-one-expression-per-line': 0,
    'react/state-in-constructor': 0,
    'react-hooks/exhaustive-deps': 0,
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: true,
        useTabs: false,
        tabWidth: 2,
        trailingComma: 'es5',
        printWidth: 100,
        arrowParens: 'avoid',
        endOfLine: 'lf',
      },
    ],
    'max-classes-per-file': 'off',
    'no-unused-expressions': 'off',
    'import/prefer-default-export': 'off',
    'babel/no-unused-expressions': 'error',
    'class-methods-use-this': 'off',
    '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }],
    '@typescript-eslint/no-empty-interface': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'no-use-before-define': 'off',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    'react/prop-types': [0, {}],
    '@typescript-eslint/no-namespace': 'off',
    'deprecation/deprecation': 'warn',
    "no-restricted-syntax": [
      "warn",
      {
        "selector": "BinaryExpression[operator='instanceof']",
        "message": "The 'instanceof' operator is forbidden. Consider using a type guard function instead."
      }
    ],
    'react/require-default-props': 'off'
  },
};
