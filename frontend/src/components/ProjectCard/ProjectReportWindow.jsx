import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";

import getData from "../../utils/getData";

const ProjectReportWindow = ({ sendReport, reportWindowsState, contracts }) => {
    const [reportData, setReportData] = useState({
        report_status_id: 1,
        report_type_id: 1,
        budget_in_billions: 0,
        service_cost_in_rubles: 3000000,
        contract_id: 1,
        report_period: {
            start: new Date("2025-01-01"),
            end: new Date("2025-12-31"),
        },
        implementation_period: {
            start: new Date("2025-01-01"),
            end: new Date("2025-12-31"),
        },
        execution_period: {
            start: new Date("2025-01-01"),
            end: new Date("2025-12-31"),
        },
        responsible_persons: [],
        contragents: [],
    });

    const [teammates, setTeammates] = useState([]);
    const [contractors, setContractors] = useState([]);
    const [reportTypes, setReportTypes] = useState([]);
    const [physicalPersons, setPhysicalPersons] = useState([]);
    const [roles, setRoles] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const handleInputChange = (e, name) => {
        if (name === "service_cost_in_rubles") {
            const value = e.target.value.replace(/\s/g, "");
            setReportData({ ...reportData, [name]: Number(value) || 0 });
        } else {
            setReportData({ ...reportData, [name]: e.target.value });
        }
    };

    // Обработка дат
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
        const { start, end } = reportData["execution_period"];

        if (start <= today && (end === null || today < end)) {
            setReportData({
                ...reportData,
                report_status_id: 1,
            });
        } else if (start > today) {
            setReportData({
                ...reportData,
                report_status_id: 2,
            });
        } else if (end && end < today) {
            setReportData({
                ...reportData,
                report_status_id: 4,
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
            setTeammates([
                ...teammates,
                {
                    id: Date.now(),
                },
            ]);
        } else if (type === "contractor") {
            setContractors([
                ...contractors,
                {
                    id: Date.now(),
                },
            ]);
        }
    };

    // Обработка селектов команды проекта
    const handleTeammateChange = (index, key, value) => {
        setReportData((prev) => {
            const updatedPersons = [...prev.responsible_persons];
            if (!updatedPersons[index]) {
                updatedPersons[index] = {
                    physical_person_id: null,
                    role_id: null,
                };
            }
            updatedPersons[index][key] = value;
            return { ...prev, responsible_persons: updatedPersons };
        });
    };

    // Обработка селектов подрядчиков
    const handleContractorChange = (index, key, value) => {
        setReportData((prev) => {
            const updatedContractors = [...prev.contragents];
            if (!updatedContractors[index]) {
                updatedContractors[index] = {
                    contragent_id: null,
                    role_id: null,
                };
            }
            updatedContractors[index][key] = value;
            return { ...prev, contragents: updatedContractors };
        });
    };

    // Получение Типов отчета
    const fetchReportTypes = async () => {
        const response = await getData(
            `${import.meta.env.VITE_API_URL}report-types?=with-count=true`
        );
        setReportTypes(response.data.data);
    };

    // Получение физ. лиц для команды проекта
    const fetchPhysicalPersons = async () => {
        const response = await getData(
            `${import.meta.env.VITE_API_URL}physical-persons`
        );
        setPhysicalPersons(response.data);
    };

    // Получение ролей
    const fetchRoles = async () => {
        const response = await getData(`${import.meta.env.VITE_API_URL}roles`);
        setRoles(response.data.data);
    };

    // Получение подрядчиков
    const fetchSuppliers = async () => {
        const response = await getData(
            `${import.meta.env.VITE_API_URL}suppliers`
        );
        setSuppliers(response.data);
    };

    useEffect(() => {
        fetchReportTypes();
        fetchPhysicalPersons();
        fetchSuppliers();
        fetchRoles();
    }, []);

    useEffect(() => {
        console.log(reportData);
    }, [reportData]);

    useEffect(() => {
        updateStatus();
    }, [reportData["execution_period"]]);

    return (
        <div className="grid gap-6">
            <div className="grid gap-3 grid-cols-[50%_50%]">
                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">Тип отчёта</span>
                    <div className="border-2 border-gray-300 p-1 h-[32px]">
                        <select
                            className="w-full"
                            onChange={(e) =>
                                handleInputChange(e, "report_type_id")
                            }
                            value={reportData.type}
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

                <div className="flex flex-col">
                    <span className="block mb-2 text-gray-400">
                        Отчетный период
                    </span>
                    <DatePicker
                        className="border-2 border-gray-300 p-1 w-full h-[32px]"
                        selected={reportData["report_period"].start}
                        startDate={reportData["report_period"].start}
                        endDate={reportData["report_period"].end}
                        onChange={handleChangeDateRange("report_period")}
                        dateFormat="dd.MM.yyyy"
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
                            onChange={(e) =>
                                handleInputChange(e, "budget_in_billions")
                            }
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="block mb-2 text-gray-400">
                        Период реализации
                    </span>
                    <DatePicker
                        className="border-2 border-gray-300 p-1 w-full h-[32px]"
                        selected={reportData["implementation_period"].start}
                        startDate={reportData["implementation_period"].start}
                        endDate={reportData["implementation_period"].end}
                        onChange={handleChangeDateRange(
                            "implementation_period"
                        )}
                        dateFormat="dd.MM.yyyy"
                        selectsRange
                    />
                </div>
            </div>

            <div className="grid gap-3 grid-cols-1">
                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">Договор</span>
                    <div className="border-2 border-gray-300 p-1 h-[32px]">
                        <select
                            className="w-full"
                            onChange={(e) =>
                                handleInputChange(e, "contract_id")
                            }
                        >
                            {contracts.length > 0 &&
                                contracts.map((contract) => (
                                    <option
                                        value={contract.id}
                                        key={contract.id}
                                    >
                                        {contract.counterparty_name}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid gap-3 grid-cols-[50%_50%]">
                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">Стоимость услуг, руб.</span>
                    <div className="border-2 border-gray-300 p-1 h-[32px]">
                        <input
                            type="text"
                            className="w-full"
                            placeholder="0"
                            value={formatPrice(
                                reportData["service_cost_in_rubles"]
                            )}
                            onChange={(e) =>
                                handleInputChange(e, "service_cost_in_rubles")
                            }
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="block mb-2 text-gray-400">
                        Период выполнения
                    </span>
                    <DatePicker
                        className="border-2 border-gray-300 p-1 w-full h-[32px]"
                        selected={reportData["execution_period"].start}
                        startDate={reportData["execution_period"].start}
                        endDate={reportData["execution_period"].end}
                        onChange={handleChangeDateRange("execution_period")}
                        dateFormat="dd.MM.yyyy"
                        selectsRange
                    />
                </div>
            </div>

            <div
                className={`grid gap-3 ${
                    reportData["report_status_id"] == 4
                        ? "grid-cols-[50%_50%]"
                        : "grid-cols-1"
                }`}
            >
                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">Статус</span>
                    <div className="border-2 border-gray-300 p-1 h-[32px]">
                        <select
                            className="w-full"
                            value={reportData["report_status_id"]}
                            onChange={(e) =>
                                handleInputChange(e, "report_status_id")
                            }
                        >
                            <option value="1">в работе</option>
                            <option value="2">запланирован</option>
                            <option value="3">отменён</option>
                            <option value="4">завершён</option>
                        </select>
                    </div>
                </div>

                {reportData["report_status_id"] == 4 && (
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

            {teammates.map((id, index) => (
                <div className="grid gap-3 grid-cols-2" key={id}>
                    <div className="flex flex-col gap-2 justify-between">
                        <div className="border-2 border-gray-300 p-1 h-[32px]">
                            <select
                                className="w-full"
                                onChange={(e) =>
                                    handleTeammateChange(
                                        index,
                                        "physical_person_id",
                                        Number(e.target.value)
                                    )
                                }
                            >
                                <option value="">Выберите сотрудника</option>
                                {physicalPersons.map((person) => (
                                    <option value={person.id} key={person.id}>
                                        {person.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 justify-between">
                        <div className="border-2 border-gray-300 p-1 h-[32px]">
                            <select
                                className="w-full"
                                onChange={(e) =>
                                    handleTeammateChange(
                                        index,
                                        "role_id",
                                        Number(e.target.value)
                                    )
                                }
                            >
                                <option value="">Выберите роль</option>
                                {roles.map((role) => (
                                    <option value={role.id} key={role.id}>
                                        {role.name}
                                    </option>
                                ))}
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
                contractors.map((id, index) => (
                    <div className="flex flex-col gap-1" key={id}>
                        <div className="grid gap-3 grid-cols-2">
                            <div className="flex flex-col gap-2 justify-between">
                                <div className="border-2 border-gray-300 p-1 h-[32px]">
                                    <select
                                        className="w-full"
                                        onChange={(e) =>
                                            handleContractorChange(
                                                index,
                                                "contragent_id",
                                                Number(e.target.value)
                                            )
                                        }
                                    >
                                        <option value="">
                                            Выберите контрагента
                                        </option>
                                        {suppliers.map((supplier) => (
                                            <option
                                                value={supplier.id}
                                                key={supplier.id}
                                            >
                                                {supplier.program_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 justify-between">
                                <div className="border-2 border-gray-300 p-1 h-[32px]">
                                    <select
                                        className="w-full"
                                        onChange={(e) =>
                                            handleContractorChange(
                                                index,
                                                "role_id",
                                                Number(e.target.value)
                                            )
                                        }
                                    >
                                        <option value="">Выберите роль</option>
                                        {roles.map((role) => (
                                            <option
                                                value={role.id}
                                                key={role.id}
                                            >
                                                {role.name}
                                            </option>
                                        ))}
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
                    onClick={() => sendReport(reportData)}
                    title="Сохранить отчёт"
                >
                    Сохранить
                </button>

                <button
                    type="button"
                    onClick={() => reportWindowsState(false)}
                    className="border rounded-lg py-3 px-5 flex-[1_1_50%]"
                    title="Отменить сохранение отчёта"
                >
                    Отменить
                </button>
            </div>
        </div>
    );
};

export default ProjectReportWindow;
