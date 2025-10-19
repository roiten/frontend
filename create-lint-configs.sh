#!/bin/bash

echo "Создаю конфигурационные файлы для ESLint, Prettier и Stylelint..."

# 1. ESLint (.eslintrc.cjs)
cat > .eslintrc.cjs << 'EOF'
const globals = require('globals');
const tseslint = require('typescript-eslint');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const reactRefreshPlugin = require('eslint-plugin-react-refresh');

module.exports = [
  { ignores: ['dist/', 'build/', 'node_modules/'] },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    // Prettier интеграция
    plugins: { prettier: require('eslint-plugin-prettier') },
    rules: { 'prettier/prettier': 'error' },
  },
];
EOF

# 2. Prettier (.prettierrc)
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
EOF

# 3. Stylelint (.stylelintrc.cjs)
cat > .stylelintrc.cjs << 'EOF'
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-prettier/recommended'
  ],
  plugins: ['@stylistic/stylelint-plugin'],
  rules: {
    '@stylistic/indentation': 2,
    '@stylistic/linebreaks': 'unix',
    '@stylistic/no-eol-whitespace': true,
    '@stylistic/no-missing-end-of-source-newline': true,
  },
  ignoreFiles: ['**/node_modules/**', '**/dist/**', '**/build/**'],
};
EOF

# 4. .eslintignore (опционально, но полезно)
cat > .eslintignore << 'EOF'
node_modules/
dist/
build/
public/
*.css
*.scss
*.less
EOF

# 5. .stylelintignore
cat > .stylelintignore << 'EOF'
node_modules/
dist/
build/
public/
*.js
*.ts
*.tsx
EOF

echo "✅ Все конфиги созданы!"
echo "Не забудь установить зависимости:"
echo
echo "npm install -D eslint prettier stylelint \\"
echo "  typescript-eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh \\"
echo "  eslint-plugin-prettier \\"
echo "  stylelint-config-standard stylelint-prettier @stylistic/stylelint-plugin"
