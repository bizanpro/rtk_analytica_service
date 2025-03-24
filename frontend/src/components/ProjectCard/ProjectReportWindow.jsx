import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";

const ProjectReportWindow = ({ reportWindowsState, reportTypes }) => {
    const [reportData, setReportData] = useState({
        "agreement-status": "запланирован",
        type: "",
        budget: "",
        "services-cost": 3000000,
        "porting-period": {
            start: new Date("2025-01-01"),
            end: new Date("2025-12-31"),
        },
        "implementation-period": {
            start: new Date("2025-01-01"),
            end: new Date("2025-12-31"),
        },
        "completion-period": {
            start: new Date("2025-01-01"),
            end: new Date("2025-12-31"),
        },
    });

    const [teammates, setTeammates] = useState([]);
    const [contractors, setContractors] = useState([]);

    const handleInputChange = (e, name) => {
        if (name === "services-cost") {
            const value = e.target.value.replace(/\s/g, "");
            setReportData({ ...reportData, [name]: Number(value) || 0 });
        } else {
            setReportData({ ...reportData, [name]: e.target.value });
        }
    };

    const handleChangeDateRange =
        (id) =>
        ([newStartDate, newEndDate]) => {
            setReportData((prev) => ({
                ...prev,
                [id]: { start: newStartDate, end: newEndDate },
            }));
        };

    // Обновление статуса проекта в отчете
    const updateStatus = () => {
        const today = new Date();
        const { start, end } = reportData["completion-period"];

        if (start <= today && (end === null || today < end)) {
            setReportData({
                ...reportData,
                "agreement-status": "в работе",
            });
        } else if (start > today) {
            setReportData({
                ...reportData,
                "agreement-status": "запланирован",
            });
        } else if (end && end < today) {
            setReportData({
                ...reportData,
                "agreement-status": "завершён",
            });
        }
    };

    // Форматируем стоимость
    const formatPrice = (price) =>
        new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 0 }).format(
            price
        );

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

    useEffect(() => {
        console.log(reportData);
    }, [reportData]);

    useEffect(() => {
        updateStatus();
    }, [reportData["completion-period"]]);

    return (
        <div className="grid gap-6">
            <div className="grid gap-3 grid-cols-[50%_50%]">
                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">Тип отчёта</span>
                    <div className="border-2 border-gray-300 p-1 h-[32px]">
                        <select
                            className="w-full"
                            onChange={(e) => handleInputChange(e, "type")}
                        >
                            {reportTypes.length > 0 &&
                                reportTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">Отчетный период</span>
                    <DatePicker
                        className="border-2 border-gray-300 p-1 w-full h-[32px]"
                        selected={reportData["porting-period"].start}
                        startDate={reportData["porting-period"].start}
                        endDate={reportData["porting-period"].end}
                        onChange={handleChangeDateRange("porting-period")}
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
                    <div className="border-2 border-gray-300 p-1 h-[32px]">
                        <input
                            type="number"
                            className="w-full"
                            placeholder="0,0"
                            value={reportData.budget}
                            onChange={(e) => handleInputChange(e, "budget")}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">Период реализации</span>
                    <DatePicker
                        className="border-2 border-gray-300 p-1 w-full h-[32px]"
                        selected={reportData["implementation-period"].start}
                        startDate={reportData["implementation-period"].start}
                        endDate={reportData["implementation-period"].end}
                        onChange={handleChangeDateRange(
                            "implementation-period"
                        )}
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

            {/* <div className="grid gap-3 grid-cols-1">
                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">Договор</span>
                    <div className="border-2 border-gray-300 p-1 h-[32px]">
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
            </div> */}

            <div className="grid gap-3 grid-cols-[50%_50%]">
                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">Стоимость услуг, руб.</span>
                    <div className="border-2 border-gray-300 p-1 h-[32px]">
                        <input
                            type="text"
                            className="w-full"
                            placeholder="0"
                            value={formatPrice(reportData["services-cost"])}
                            onChange={(e) =>
                                handleInputChange(e, "services-cost")
                            }
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">Период выполнения</span>
                    <DatePicker
                        className="border-2 border-gray-300 p-1 w-full h-[32px]"
                        selected={reportData["completion-period"].start}
                        startDate={reportData["completion-period"].start}
                        endDate={reportData["completion-period"].end}
                        onChange={handleChangeDateRange("completion-period")}
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
                    reportData["agreement-status"] == "завершён"
                        ? "grid-cols-[50%_50%]"
                        : "grid-cols-1"
                }`}
            >
                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">Статус</span>
                    <div className="border-2 border-gray-300 p-1 h-[32px]">
                        <select
                            className="w-full"
                            value={reportData["agreement-status"]}
                            // onChange={(evt) =>
                            //     setAgreementStatus(evt.target.value)
                            // }
                            onChange={(e) =>
                                handleInputChange(e, "agreement-status")
                            }
                        >
                            <option value="запланирован">запланирован</option>
                            <option value="в работе">в работе</option>
                            <option value="завершён">завершён</option>
                        </select>
                    </div>
                </div>

                {reportData["agreement-status"] == "завершён" && (
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
                            <div className="border-2 border-gray-300 p-1 h-[32px]">
                                <select className="w-full">
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
                            <div className="border-2 border-gray-300 p-1 h-[32px]">
                                <select className="w-full">
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
                                <div className="border-2 border-gray-300 p-1 h-[32px]">
                                    <select className="w-full">
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
                                <div className="border-2 border-gray-300 p-1 h-[32px]">
                                    <select className="w-full">
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
                                <div className="border-2 border-gray-300 p-1 h-[32px]">
                                    <select className="w-full">
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
                    onClick={() => reportWindowsState(false)}
                    className="border rounded-lg py-3 px-5 flex-[1_1_50%]"
                >
                    Отменить
                </button>
            </div>
        </div>
    );
};

export default ProjectReportWindow;
