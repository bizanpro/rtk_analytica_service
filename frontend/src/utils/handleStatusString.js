const handleStatusString = (status) => {
    if (
        status.toLowerCase() === "утверждён" ||
        status.toLowerCase() === "утвержден" ||
        status.toLowerCase() === "получено согласие"
    ) {
        return "form-field__status_completed";
    } else if (
        status.toLowerCase() === "получен отказ" ||
        status.toLowerCase() === "отменен" ||
        status.toLowerCase() === "отменён"
    ) {
        return "form-field__status_canceled";
    }
};

export default handleStatusString;
