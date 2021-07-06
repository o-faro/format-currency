
const assert = require("assert");
const { EUR, US, DECIMAL, _000 } = require("./types");
const { extractFormattedParts, customFraction } = require("./helper.js");

/**
 * this calculation assumes that
 * it is run on terminal, $node ./index.js
 * inputAmount is always in american format
 * inputAmount has only two groups plus fraction (xxx.xxx,xxxxx) 
 * negative inputAmount fraction is not rounded
 * digits value to increase fraction is always zero 
 */

const formatterSetup = (delimiter, fraction) => {
    const locales = delimiter && delimiter === "." ? US : EUR;
    return new Intl.NumberFormat(locales, { style: DECIMAL, maximumFractionDigits: fraction });
}

const format = (inputAmount, fraction, delimiter, undefined, rounding = true) => {
    if (!inputAmount) {
        return _000;
    }
    const formatter = formatterSetup(delimiter, fraction ? fraction : 2);
    const parts = formatter.formatToParts(inputAmount);
    const { partsFraction, partsNegative } = extractFormattedParts(parts)

    if (partsNegative ||
        !rounding ||
        (fraction && fraction > partsFraction.length)) {
        return customFraction({ inputAmount, fraction, rounding, parts });
    }
    return `${formatter.format(inputAmount)}`
}

assert.strictEqual("0,00", format(undefined));
assert.strictEqual("2,56", format(2.555));
assert.strictEqual("10.000,556", format(10000.5555, 3));
assert.strictEqual("100.000,28", format(100000.28374, 2, ",", "."));
assert.strictEqual("100,000.6", format(100000.55555, 1, ".", ","));

assert.strictEqual("1,5550000000", format(1.555, 10, ",", "."));

assert.strictEqual("-1,5555", format(-1.55555, 4));
assert.strictEqual("-1,5555", format("-1.55555", 4));
assert.strictEqual("1,555", format(1.55555, 3, ",", ".", false));
assert.strictEqual("1,56", format("1.5555", 2));

console.log("all assertions resolve to true");
