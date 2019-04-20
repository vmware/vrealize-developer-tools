module.exports = {
    tabWidth: 4,
    printWidth: 120,
    endOfLine: "lf",
    proseWrap: "preserve",
    semi: false,
    trailingComma: "none",
    singleQuote: false,
    quoteProps: "consistent",
    overrides: [
        {
            files: "*.json",
            options: {
                tabWidth: 2
            }
        }
    ]
}
