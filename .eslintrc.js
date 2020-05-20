module.exports = {
  root: true,
  extends: [
    'prettier',
    'eslint:recommended'
  ],
  plugins: [
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 8
  },
  env: {
    node: true,
    es6: true
  },
  rules: {
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'comma-dangle': 'error',
    'object-curly-spacing': ['error', 'always'],
    'prettier/prettier': 'error'
  },
  overrides: [
    {
      files: ['**/*.ts'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended'
      ],
      parser: '@typescript-eslint/parser',
      plugins: [
        '@typescript-eslint'
      ],
      rules: {
        '@typescript-eslint/member-delimiter-style': 'off'
      }
    }
  ]
}
