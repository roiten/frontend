module.exports = {
    extends: ['stylelint-config-standard', 'stylelint-prettier/recommended'],
    plugins: ['@stylistic/stylelint-plugin'],
    rules: {
        '@stylistic/indentation': 2,
        '@stylistic/linebreaks': 'unix',
        '@stylistic/no-eol-whitespace': true,
        '@stylistic/no-missing-end-of-source-newline': true,
    },
    ignoreFiles: ['**/node_modules/**', '**/dist/**', '**/build/**'],
};
