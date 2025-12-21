const formatDateYM = (input) => {
    const [year, month] = input.split("-");

    const months = [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
    ];

    const monthName = months[parseInt(month, 10) - 1];
    return `${monthName} ${year}`;
};

export default formatDateYM;
