const handleStatusString = (status) => {
    if (
        status.toLowerCase() === "утверждён" ||
        status.toLowerCase() === "утвержден" ||
        status.toLowerCase() === "получено согласие"
    ) {
        return "text-green-400";
    } else if (
        status.toLowerCase() === "получен отказ" ||
        status.toLowerCase() === "отменен" ||
        status.toLowerCase() === "отменён"
    ) {
        return "text-red-400";
    }
};

export default handleStatusString;
