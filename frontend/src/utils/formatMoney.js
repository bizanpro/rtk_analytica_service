const formatMoney = (input) => {
    let cleaned = input.replace(/[^0-9,]/g, "");

    cleaned = cleaned.replace(".", ",");

    let [whole, fraction] = cleaned.split(",");

    whole = whole.replace(/^0+(?!$)/, "");

    whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    if (fraction?.length > 2) {
        fraction = fraction.slice(0, 2);
    }

    return fraction !== undefined ? `${whole},${fraction}` : whole;
};

export default formatMoney;
