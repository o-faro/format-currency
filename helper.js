const _find = require("lodash/find");
const _filter = require("lodash/filter");
const _some = require("lodash/some");
const {
    FRACTION,
    INTEGER,
    MINUS_SIGN,
    GROUP,
    DECIMAL,
} = require("./types");

// extracting formatToParts information
const extractFormattedParts = (parts) => {
    const partsInputAmount = _filter(parts, part => part.type === INTEGER);
    const partsGroup = _filter(parts, part => part.type === GROUP);
    const partsDecimal = _find(parts, part => part.type === DECIMAL).value;
    const partsFraction = _find(parts, part => part.type === FRACTION).value;
    const partsNegative = _some(parts, part => part.type === MINUS_SIGN);

    const partsGroup1 = `${partsInputAmount[0].value}`
    const partsGroup2 = `${partsInputAmount && partsInputAmount.length > 1 ? partsInputAmount[1].value : ""}`
    const partsGroupDelimiter = `${partsGroup && partsGroup.length > 0 ? partsGroup[0].value : ""}`

    return {
        partsGroup1,
        partsGroup2,
        partsFraction,
        partsNegative,
        partsDecimal,
        partsGroupDelimiter,
    }
}

const customFraction = ({ inputAmount, fraction, rounding, parts }) => {
    const { partsGroup1, partsGroup2, partsFraction, partsNegative, partsGroupDelimiter, partsDecimal } = extractFormattedParts(parts);

    // adding zeros
    if (fraction > partsFraction.length) {
        const amountToAdd = fraction - partsFraction.length;
        const appendValue = new Array(amountToAdd).fill(0);
        return (
            `${partsGroup1}${partsGroupDelimiter}`
            + `${partsGroup2}${partsDecimal}`
            + `${partsFraction}${appendValue.join("")}`
        )
    }

    // no rounding on negative values or !rounding
    if (partsNegative || !rounding) {
        let customInputAmount = inputAmount.toString().replace(".", ",");
        const delimiterIndex = customInputAmount.indexOf(",");
        return customInputAmount.slice(0, delimiterIndex + fraction + 1)
    }
}

module.exports = {
    customFraction,
    extractFormattedParts
}