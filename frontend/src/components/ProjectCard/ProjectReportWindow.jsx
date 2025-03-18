import { useState, useEffect } from "react";

import DatePicker from "react-datepicker";

const ProjectReportWindow = ({ ReportWindowsState }) => {
    const [agreementStatus, setAgreementStatus] = useState("запланирован");
    const [teammates, setTeammates] = useState([]);
    const [contractors, setContractors] = useState([]);
    const [dateRanges, setDateRanges] = useState(defaultRanges);

    const defaultRanges = {
        picker1: { start: new Date("2024-08-01"), end: new Date("2024-10-01") },
        picker2: { start: new Date("2024-06-01"), end: new Date("2024-07-01") },
        picker3: { start: new Date("2024-06-01"), end: new Date("2024-07-01") },
    };

    // Добавление блока заказчика или кредитора
    const addBlock = (type) => {
        if (type === "teammate") {
            if (teammates.length < 1) {
                setTeammates([
                    ...teammates,
                    {
                        id: Date.now(),
                    },
                ]);
            }
        } else if (type === "contractor") {
            if (contractors.length < 1) {
                setContractors([
                    ...contractors,
                    {
                        id: Date.now(),
                    },
                ]);
            }
        }
    };

    const handleChangeDateRange =
        (id) =>
        ([newStartDate, newEndDate]) => {
            setDateRanges((prev) => ({
                ...prev,
                [id]: { start: newStartDate, end: newEndDate },
            }));
        };

    // Обновление статуса проекта в отчете
    const updateStatus = () => {
        const today = new Date();
        const { start, end } = dateRanges.picker3;

        if (end && end < today) {
            setAgreementStatus("завершён");
        } else if (start > today) {
            setAgreementStatus("запланирован");
        } else if (start <= today && !end) {
            setAgreementStatus("в работе");
        }
    };

    useEffect(() => {
        updateStatus();
    }, [dateRanges]);

    return (
        <div className="grid gap-6">
            <div className="grid gap-3 grid-cols-[50%_50%]">
                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">Тип отчёта</span>
                    <div className="border-2 border-gray-300 p-1">
                        <select className="w-full" disabled>
                            <option value="ФТА">ФТА</option>
                            <option value="ФТМ">ФТМ</option>
                            <option value="ФМ">ФМ</option>
                            <option value="ИЗ">ИЗ</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">Отчетный период</span>
                    <DatePicker
                        className="border-2 border-gray-300 p-1 w-full"
                        selected={dateRanges.picker1.start}
                        startDate={dateRanges.picker1.start}
                        endDate={dateRanges.picker1.end}
                        onChange={handleChangeDateRange("picker1")}
                        excludeDates={[
                            new Date("2024-05-01"),
                            new Date("2024-02-01"),
                            new Date("2024-01-01"),
                            new Date("2024-11-01"),
                        ]}
                        dateFormat="dd.MM.yyyy"
                        placeholderText=""
                        selectsRange
                    />
                </div>
            </div>

            <div className="grid gap-3 grid-cols-[50%_50%]">
                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">
                        Бюджет проекта, млрд руб.
                    </span>
                    <div className="border-2 border-gray-300 p-1">
                        <input
                            type="number"
                            className="w-full"
                            placeholder="0,0"
                            readOnly
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">Период реализации</span>
                    <DatePicker
                        className="border-2 border-gray-300 p-1 w-full"
                        selected={dateRanges.picker2.start}
                        startDate={dateRanges.picker2.start}
                        endDate={dateRanges.picker2.end}
                        onChange={handleChangeDateRange("picker2")}
                        excludeDates={[
                            new Date("2024-05-01"),
                            new Date("2024-02-01"),
                            new Date("2024-01-01"),
                            new Date("2024-11-01"),
                        ]}
                        dateFormat="dd.MM.yyyy"
                        placeholderText=""
                        selectsRange
                    />
                </div>
            </div>

            <div className="grid gap-3 grid-cols-1">
                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">Договор</span>
                    <div className="border-2 border-gray-300 p-1">
                        <select className="w-full" disabled>
                            <option value="Договор 45222 от 12.01.2025">
                                Договор 45222 от 12.01.2025
                            </option>
                            <option value="Договор 45222 от 12.01.2025">
                                Договор 45222 от 13.01.2025
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid gap-3 grid-cols-[50%_50%]">
                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">Стоимость услуг, руб.</span>
                    <div className="border-2 border-gray-300 p-1">
                        <input
                            type="number"
                            className="w-full"
                            placeholder="0,0"
                            readOnly
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">Период выполнения</span>
                    <DatePicker
                        className="border-2 border-gray-300 p-1 w-full"
                        selected={dateRanges.picker3.start}
                        startDate={dateRanges.picker3.start}
                        endDate={dateRanges.picker3.end}
                        onChange={handleChangeDateRange("picker3")}
                        excludeDates={[
                            new Date("2024-05-01"),
                            new Date("2024-02-01"),
                            new Date("2024-01-01"),
                            new Date("2024-11-01"),
                        ]}
                        dateFormat="dd.MM.yyyy"
                        placeholderText=""
                        selectsRange
                    />
                </div>
            </div>

            <div
                className={`grid gap-3 ${
                    agreementStatus == "завершён"
                        ? "grid-cols-[50%_50%]"
                        : "grid-cols-1"
                }`}
            >
                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">Статус</span>
                    <div className="border-2 border-gray-300 p-1">
                        <select
                            className="w-full"
                            value={agreementStatus}
                            onChange={(evt) =>
                                setAgreementStatus(evt.target.value)
                            }
                        >
                            <option value="запланирован">запланирован</option>
                            <option value="в работе">в работе</option>
                            <option value="завершён">завершён</option>
                        </select>
                    </div>
                </div>

                {agreementStatus == "завершён" && (
                    <div className="flex flex-col gap-2 justify-between">
                        <span className="text-gray-400">Добавить отчет</span>

                        <div className="grid gap-3 grid-cols-2">
                            <div className="radio-field">
                                <input
                                    type="radio"
                                    name="add_report"
                                    id="addReportYes"
                                    readOnly
                                />
                                <label htmlFor="addReportYes">Да</label>
                            </div>
                            <div className="radio-field">
                                <input
                                    type="radio"
                                    name="add_report"
                                    id="addReportNo"
                                    readOnly
                                />
                                <label htmlFor="addReportNo">Нет</label>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid gap-3 grid-cols-1">
                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400 flex items-center gap-2">
                        Команда проекта
                        <button
                            type="button"
                            className="add-button"
                            onClick={() => addBlock("teammate")}
                        >
                            <span></span>
                        </button>
                    </span>
                </div>
            </div>

            {teammates.length > 0 &&
                teammates.map((id) => (
                    <div className="grid gap-3 grid-cols-2" key={id}>
                        <div className="flex flex-col gap-2 justify-between">
                            <div className="border-2 border-gray-300 p-1">
                                <select className="w-full" disabled>
                                    <option value="Прохоров Сергей Викторович">
                                        Прохоров Сергей Викторович
                                    </option>
                                    <option value="Прохоров Сергей Викторович">
                                        Прохоров Сергей Викторович
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 justify-between">
                            <div className="border-2 border-gray-300 p-1">
                                <select className="w-full" disabled>
                                    <option value="Руководитель проекта">
                                        Руководитель проекта
                                    </option>
                                    <option value="Руководитель проекта">
                                        Руководитель проекта
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}

            <div className="grid gap-3 grid-cols-1">
                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400 flex items-center gap-2">
                        Подрядчики
                        <button
                            type="button"
                            className="add-button"
                            onClick={() => addBlock("contractor")}
                        >
                            <span></span>
                        </button>
                    </span>
                </div>
            </div>

            {contractors.length > 0 &&
                contractors.map((id) => (
                    <div className="flex flex-col gap-1" key={id}>
                        <div className="grid gap-3 grid-cols-2">
                            <div className="flex flex-col gap-2 justify-between">
                                <div className="border-2 border-gray-300 p-1">
                                    <select className="w-full" disabled>
                                        <option value="ООО 'ИЭС'">
                                            ООО 'ИЭС'
                                        </option>
                                        <option value="ООО 'ИЭС'">
                                            ООО 'ИЭС'
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 justify-between">
                                <div className="border-2 border-gray-300 p-1">
                                    <select className="w-full" disabled>
                                        <option value="Технология">
                                            Технология
                                        </option>
                                        <option value="Технология">
                                            Технология
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-3 grid-cols-1">
                            <div className="flex flex-col gap-2 justify-between">
                                <span className="text-gray-400"></span>
                                <div className="border-2 border-gray-300 p-1">
                                    <select className="w-full" disabled>
                                        <option value="Договор 45222 от 12.01.2025">
                                            Договор 45222 от 12.01.2025
                                        </option>
                                        <option value="Договор 45222 от 12.01.2025">
                                            Договор 45222 от 13.01.2025
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

            <div className="mt-5 flex items-center gap-6 justify-between">
                <button
                    type="button"
                    className="rounded-lg py-3 px-5 bg-black text-white flex-[1_1_50%]"
                    // onClick={}
                >
                    Сохранить
                </button>

                <button
                    type="button"
                    onClick={() => ReportWindowsState(false)}
                    className="border rounded-lg py-3 px-5 flex-[1_1_50%]"
                >
                    Отменить
                </button>
            </div>
        </div>
    );
};

export default ProjectReportWindow;
