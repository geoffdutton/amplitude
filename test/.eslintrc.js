module.exports = {
  rules: {
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-var-requires': 'off'
  },
  globals: {
    expect: true
  },
  env: {
    mocha: true,
    es6: true
  },
  overrides: [
    {
      files: ['./**/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      },
    }
  ]
}
