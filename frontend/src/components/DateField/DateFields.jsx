import { useRef, useMemo, useState } from "react";
import isValidDateFormat from "../../utils/isValidDateFormat";
import { IMaskInput } from "react-imask";
import IMask from "imask";

const DateFields = ({ mode = "edit", value = "", onChange, className }) => {
    const dateToRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState("");

    // Преобразуем входящую строку в объект
    const period = useMemo(() => {
        const [from = "", to = ""] = value.split(" - ");
        return { date_from: from, date_to: to };
    }, [value]);

    const handleChange = (field, val) => {
        const newPeriod = { ...period, [field]: val };
        const newValue =
            newPeriod.date_from && newPeriod.date_to
                ? `${newPeriod.date_from} - ${newPeriod.date_to}`
                : `${newPeriod.date_from}${
                      newPeriod.date_to ? " - " + newPeriod.date_to : ""
                  }`;

        onChange?.(newValue);

        if (
            newPeriod.date_from.length === 10 &&
            newPeriod.date_to.length === 10 &&
            isValidDateFormat(newPeriod.date_from) &&
            isValidDateFormat(newPeriod.date_to)
        ) {
            const from = new Date(
                newPeriod.date_from.split(".").reverse().join("-")
            );
            const to = new Date(
                newPeriod.date_to.split(".").reverse().join("-")
            );

            if (from <= to) {
                setErrorMessage("");
            } else {
                setErrorMessage("Дата окончания не может раньше даты начала");
            }
        }
    };

    return (
        <div className="grid gap-1">
            <div className={`${className}`}>
                <IMaskInput
                    mask={Date}
                    pattern="d.`m.`Y"
                    blocks={{
                        d: { mask: IMask.MaskedRange, from: 1, to: 31 },
                        m: { mask: IMask.MaskedRange, from: 1, to: 12 },
                        Y: { mask: IMask.MaskedRange, from: 1900, to: 2099 },
                    }}
                    lazy={true}
                    autofix={true}
                    value={period.date_from}
                    onAccept={(val) => handleChange("date_from", val)}
                    onComplete={() => dateToRef.current?.focus()}
                    placeholder="дд.мм.гггг"
                    className="h-full min-w-[5ch] max-w-[8.5ch]"
                    disabled={mode === "read"}
                />

                <span className="self-center text-gray-400 mr-[3.5px]">-</span>

                <IMaskInput
                    inputRef={dateToRef}
                    mask={Date}
                    pattern="d.`m.`Y"
                    blocks={{
                        d: { mask: IMask.MaskedRange, from: 1, to: 31 },
                        m: { mask: IMask.MaskedRange, from: 1, to: 12 },
                        Y: { mask: IMask.MaskedRange, from: 1900, to: 2099 },
                    }}
                    lazy={true}
                    autofix={true}
                    value={period.date_to}
                    onAccept={(val) => handleChange("date_to", val)}
                    placeholder="дд.мм.гггг"
                    className="h-full min-w-[5ch] max-w-[8.5ch]"
                    disabled={mode === "read"}
                />
            </div>
            
            {errorMessage !== "" && (
                <span className="text-red-400 top-[100%] text-sm">
                    {errorMessage}
                </span>
            )}
        </div>
    );
};

export default DateFields;
