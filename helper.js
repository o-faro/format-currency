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
const partsObj = (parts) => {
    const partsInteger = _filter(parts, part => part.type === INTEGER);
    const partsGroup = _filter(parts, part => part.type === GROUP);
    const partsDecimal = _find(parts, part => part.type === DECIMAL).value;
    const partsFraction = _find(parts, part => part.type === FRACTION).value;
    const partsNegative = _some(parts, part => part.type === MINUS_SIGN);

    const inst = `${partsInteger[0].value}`
    const inst2 = `${partsInteger && partsInteger.length > 1 ? partsInteger[1].value : ""}`
    const group = `${partsGroup && partsGroup.length > 0 ? partsGroup[0].value : ""}`

    return {
        partsInteger,
        partsGroup,
        partsFraction,
        partsNegative,
        partsDecimal,
        inst,
        inst2,
        group,
    }
}

const customFraction = ({ inputAmount, parts, fraction, rounding }) => {
    const { partsNegative, partsFraction, inst, group, inst2, partsDecimal } = partsObj(parts);

    // adding zeros
    if (fraction > partsFraction.length) {
        const amountToAdd = fraction - partsFraction.length;
        const appendValue = new Array(amountToAdd).fill(0);
        return (
            `${inst}${group}${inst2}${partsDecimal}${partsFraction}${appendValue.join("")}`
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
    partsObj
}