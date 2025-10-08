import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import buildQueryParams from "../../utils/buildQueryParams";
import "./CustomDatePicker.scss";

const formatDate = (date: Date) => date.toISOString().split("T")[0];

const CustomDatePicker = () => {
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
                request_date_from: [formatDate(start)],
                request_date_to: [formatDate(end)],
            };
            const query = buildQueryParams(filters);
            // getList(query);
        }
    };

    const handleCancel = () => {
        setTempRange(dateRange); // вернуть исходное значение
    };

    return (
        <div className="custom-datepicker">
            <DatePicker
                selected={tempRange[0]}
                onChange={(update) =>
                    setTempRange(update as [Date | null, Date | null])
                }
                startDate={tempRange[0]}
                endDate={tempRange[1]}
                selectsRange
                inline
                renderCustomHeader={({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                }) => (
                    <div className="header flex items-center justify-between p-2 border-b">
                        <div className="flex items-center gap-2">
                            <select
                                className="border rounded px-1 py-0.5"
                                value={date.getMonth()}
                                onChange={(e) =>
                                    changeMonth(Number(e.target.value))
                                }
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i} value={i}>
                                        {new Date(0, i).toLocaleString(
                                            "ru-RU",
                                            { month: "long" }
                                        )}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="border rounded px-1 py-0.5"
                                value={date.getFullYear()}
                                onChange={(e) =>
                                    changeYear(Number(e.target.value))
                                }
                            >
                                {Array.from({ length: 11 }, (_, i) => {
                                    const year =
                                        new Date().getFullYear() - 5 + i;
                                    return (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={decreaseMonth}
                                disabled={prevMonthButtonDisabled}
                                className="px-2 py-1 border rounded hover:bg-gray-100"
                            >
                                ‹
                            </button>
                            <button
                                onClick={increaseMonth}
                                disabled={nextMonthButtonDisabled}
                                className="px-2 py-1 border rounded hover:bg-gray-100"
                            >
                                ›
                            </button>
                        </div>
                    </div>
                )}
            />

            <div className="actions flex justify-end gap-2 p-2 border-t">
                <button className="cancel-button" onClick={handleCancel}>
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
