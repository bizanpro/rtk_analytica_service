import { useState } from "react";

import DatePicker, { registerLocale } from "react-datepicker";
import { ru } from "date-fns/locale";

import "react-datepicker/dist/react-datepicker.css";

import "./CustomDatePicker.scss";

registerLocale("ru", ru);

const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const CustomDatePicker = ({
    type = "days",
    closePicker,
    onChange,
    fieldkey,
}: {
    type: string;
    closePicker: () => void;
    onChange: () => void;
    fieldkey: string;
}) => {
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        null,
        null,
    ]);
    const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([
        null,
        null,
    ]);

    const handleApply = () => {
        setDateRange(tempRange);

        const [start, end] = tempRange;

        if (start && end) {
            const filters = {
                [`${fieldkey}_from`]: [formatDate(start)],
                [`${fieldkey}_to`]: [formatDate(end)],
            };

            onChange(filters);
        }

        closePicker("");
    };

    return (
        <div className={`custom-datepicker custom-datepicker_${type}`}>
            <DatePicker
                selected={tempRange[0]}
                onChange={(update) =>
                    setTempRange(update as [Date | null, Date | null])
                }
                startDate={tempRange[0]}
                endDate={tempRange[1]}
                selectsRange
                inline
                locale="ru"
                showMonthYearPicker={type === "months"}
                renderDayContents={(day) => (
                    <>
                        <div className="react-datepicker__day-number">
                            {day}
                        </div>
                        <div className="react-datepicker__day-overlay"></div>
                    </>
                )}
                renderCustomHeader={({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                }) => (
                    <div
                        className={`custom-datepicker__header custom-datepicker__header_${type}`}
                    >
                        <div className="flex items-center gap-[10px]">
                            {type !== "months" && (
                                <select
                                    className="form-select"
                                    value={date.getMonth()}
                                    onChange={(e) =>
                                        changeMonth(Number(e.target.value))
                                    }
                                >
                                    {Array.from({ length: 12 }, (_, i) => {
                                        const monthName = new Date(
                                            0,
                                            i
                                        ).toLocaleString("ru-RU", {
                                            month: "long",
                                        });
                                        const capitalized =
                                            monthName.charAt(0).toUpperCase() +
                                            monthName.slice(1);
                                        return (
                                            <option key={i} value={i}>
                                                {capitalized}
                                            </option>
                                        );
                                    })}
                                </select>
                            )}

                            {type === "months" && (
                                <button
                                    onClick={decreaseMonth}
                                    disabled={prevMonthButtonDisabled}
                                    className="custom-datepicker__header-actions-prev-btn"
                                    title="К предыдущему месяцу"
                                ></button>
                            )}

                            <select
                                className="form-select custom-datepicker__select-year"
                                value={date.getFullYear()}
                                onChange={(e) =>
                                    changeYear(Number(e.target.value))
                                }
                            >
                                {Array.from(
                                    {
                                        length:
                                            new Date().getFullYear() - 1900 + 1,
                                    },
                                    (_, i) => 1900 + i
                                ).map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="custom-datepicker__header-actions">
                            {type !== "months" && (
                                <button
                                    onClick={decreaseMonth}
                                    disabled={prevMonthButtonDisabled}
                                    className="custom-datepicker__header-actions-prev-btn"
                                    title="К предыдущему месяцу"
                                ></button>
                            )}

                            <button
                                onClick={increaseMonth}
                                disabled={nextMonthButtonDisabled}
                                className="custom-datepicker__header-actions-next-btn"
                                title="К следующему месяцу"
                            ></button>
                        </div>
                    </div>
                )}
            />

            <div className="custom-datepicker__actions">
                <button
                    className="cancel-button"
                    onClick={() => closePicker(false)}
                >
                    Отменить
                </button>
                <button className="action-button" onClick={handleApply}>
                    Применить
                </button>
            </div>
        </div>
    );
};

export default CustomDatePicker;
