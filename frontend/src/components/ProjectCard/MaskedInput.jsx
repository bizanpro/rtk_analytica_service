import { IMaskInput } from "react-imask";

function MaskedInput({
    startDate,
    endDate,
    onChange,
    onClick,
    placeholder,
    inputRef,
    ...rest
}) {
    // Преобразуем даты в строку вида "dd.mm.yyyy - dd.mm.yyyy"
    function formatRange(start, end) {
        const format = (date) =>
            date instanceof Date && !isNaN(date)
                ? date.toLocaleDateString("ru-RU")
                : "";
        return start && end ? `${format(start)} - ${format(end)}` : "";
    }

    // При вводе пользователем вручную — парсим строку и передаём наружу
    function parseDatesFromValue(value) {
        if (typeof value !== "string" || !value.includes(" - ")) return;

        const [startStr, endStr] = value.split(" - ");
        const toDate = (str) => {
            const [dd, mm, yyyy] = str.split(".");
            return dd && mm && yyyy ? new Date(`${yyyy}-${mm}-${dd}`) : null;
        };

        const start = toDate(startStr);
        const end = toDate(endStr);

        if (
            start instanceof Date &&
            !isNaN(start) &&
            end instanceof Date &&
            !isNaN(end)
        ) {
            onChange?.([start, end]);
        }
    }

    const value = formatRange(startDate, endDate);

    console.log(value);
    

    return (
        <IMaskInput
            mask="00.00.0000 - 00.00.0000"
            placeholder={placeholder}
            className="border-2 border-gray-300 p-1 w-full h-[32px]"
            definitions={{ 0: /[0-9]/ }}
            value={value}
            inputRef={inputRef}
            unmask={false}
            onAccept={parseDatesFromValue}
            onClick={onClick}
        />
    );
}

export default MaskedInput;
