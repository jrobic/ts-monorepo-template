const commonRules = {
  'no-debugger': 'off',

  // import
  'import/prefer-default-export': 'off',
  'import/namespace': 'off',
  'import/order': [
    'warn',
    {
      alphabetize: { order: 'asc' },
      'newlines-between': 'always',
    },
  ],
};

module.exports = {
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  env: {
    es2022: true,
    node: true,
  },
  extends: [
    'airbnb/base',
    'plugin:import/recommended',
    // 'plugin:prettier/recommended', 'prettier'
  ],
  plugins: [
    'import',
    'vitest',
    // 'prettier'
  ],
  rules: {
    ...commonRules,
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        'unicorn/prevent-abbreviations': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: ['**/*.config.js', '**/.eslintrc.js', '**/config/**', '**/scripts/**'],
          },
        ],
      },
    },
    {
      files: '**/*.ts',
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
      },
      plugins: ['@typescript-eslint', 'import', 'vitest', 'prettier'],
      extends: [
        'airbnb/base',
        'airbnb-typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        // 'plugin:prettier/recommended',
        // 'prettier',
      ],
      rules: {
        ...commonRules,
        '@typescript-eslint/no-unused-vars': [
          'warn', // or "error"
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
          },
        ],
      },
    },
    {
      files: ['**/*.+(test|spec|cy).+(ts|tsx|js|jsx)'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-object-literal-type-assertion': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        'global-require': 'off',
      },
    },
  ],
};
