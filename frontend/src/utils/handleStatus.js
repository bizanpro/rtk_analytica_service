const handleStatus = (status) => {
    switch (status) {
        case "active":
            return "Активный";

        case "completed":
            return "Завершён";

        case "undefined":
            return "Не установлен";

        default:
            return "—";
    }
};

export default handleStatus;
