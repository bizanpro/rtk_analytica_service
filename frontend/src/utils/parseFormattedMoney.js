const parseFormattedMoney = (value) => {
    if (!value) return "";
    return value.replace(/\s/g, "").replace(",", ".");
};

export default parseFormattedMoney;
