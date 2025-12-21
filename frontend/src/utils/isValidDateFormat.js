const isValidDateFormat = (dateStr) => {
    if (!dateStr) return false;
    const [d, m, y] = dateStr.split(".").map(Number);
    const date = new Date(y, m - 1, d);
    return (
        date.getFullYear() === y &&
        date.getMonth() === m - 1 &&
        date.getDate() === d
    );
};

export default isValidDateFormat;
