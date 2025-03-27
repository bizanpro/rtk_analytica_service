import { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import getData from "../../utils/getData";

import TeammatesSection from "../TeammatesSection";
import ContractorsSection from "../ContractorsSection";

const ProjectReportWindow = ({
    sendReport,
    reportWindowsState,
    contracts,
    reportId,
    updateReport,
}) => {
    const [reportData, setReportData] = useState({
        report_status_id: 1,
        report_type_id: 1,
        budget_in_billions: 0,
        service_cost_in_rubles: 0,
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
    const [reportStatuses, setReportStatuses] = useState([]);
    const [addReport, setAddReport] = useState(false);

    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // Валидация полей
    const validateFields = () => {
        const newErrors = {};

        if (!reportData.report_type_id) {
            newErrors.report_type_id = "Тип отчёта обязателен";
        }

        if (
            !reportData.budget_in_billions ||
            reportData.budget_in_billions <= 0
        ) {
            newErrors.budget_in_billions = "Бюджет должен быть больше 0";
        }

        if (
            !reportData.service_cost_in_rubles ||
            reportData.service_cost_in_rubles <= 0
        ) {
            newErrors.service_cost_in_rubles =
                "Стоимость услуг должна быть больше 0";
        }

        if (!reportData.contract_id) {
            newErrors.contract_id = "Договор обязателен";
        }

        if (!reportData.report_period.start || !reportData.report_period.end) {
            newErrors.report_period = "Укажите полный отчетный период";
        }

        if (
            !reportData.implementation_period.start ||
            !reportData.implementation_period.end
        ) {
            newErrors.implementation_period =
                "Укажите полный период реализации";
        }

        if (!reportData.execution_period.start) {
            newErrors.execution_period = "Укажите начало периода выполнения";
        }

        if (reportData.responsible_persons.length === 0) {
            newErrors.responsible_persons =
                "Добавьте хотя бы одного сотрудника";
        }

        if (reportData.contragents.length === 0) {
            newErrors.contragents = "Добавьте хотя бы одного подрядчика";
        }

        return newErrors;
    };

    // Сохранение отчета
    const handleSave = () => {
        const newErrors = validateFields();

        if (Object.keys(newErrors).length === 0) {
            reportId
                ? updateReport(reportData, reportId)
                : sendReport(reportData, addReport);
        } else {
            alert(
                "Исправьте ошибки перед сохранением:\n" +
                    Object.values(newErrors).join("\n")
            );
        }
    };

    // Обработка инпутов
    const handleInputChange = useCallback(
        (e, name) => {
            let value =
                name === "service_cost_in_rubles"
                    ? Number(e.target.value.replace(/\s/g, "")) || 0
                    : e.target.value;

            if (name === "budget_in_billions") {
                value = value.replace(/[^0-9.]/g, "");

                const parts = value.split(".");
                if (parts.length > 2) {
                    value = parts[0] + "." + parts[1];
                }

                if (parts[1]?.length > 5) {
                    value = `${parts[0]}.${parts[1].slice(0, 5)}`;
                }
            }

            setReportData((prev) => ({
                ...prev,
                [name]: value,
            }));
        },
        [setReportData]
    );

    // Обработка дат
    const handleChangeDateRange = useCallback(
        (id) =>
            ([newStartDate, newEndDate]) => {
                setReportData((prev) => ({
                    ...prev,
                    [id]: { start: newStartDate, end: newEndDate },
                }));
            },
        [setReportData]
    );

    // Форматируем стоимость
    const formatPrice = (price) =>
        new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 0 }).format(
            price
        );

    // Добавление блока заказчика или кредитора
    const addBlock = useCallback((type) => {
        if (type === "teammate") {
            setTeammates((prev) => [...prev, { id: Date.now() }]);
        } else if (type === "contractor") {
            setContractors((prev) => [...prev, { id: Date.now() }]);
        }
    }, []);

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
                    contract_id: null,
                };
            }
            updatedContractors[index][key] = value;
            return { ...prev, contragents: updatedContractors };
        });
    };

    // Удаление сотрудника из teammates
    const removeTeammate = (index) => {
        setTeammates((prev) => {
            const updatedTeammates = [...prev];
            updatedTeammates.splice(index, 1);
            return updatedTeammates;
        });

        setReportData((prev) => {
            const updatedPersons = [...prev.responsible_persons];
            updatedPersons.splice(index, 1);
            return { ...prev, responsible_persons: updatedPersons };
        });
    };

    // Удаление подрядчика из contractors
    const removeContractor = (index) => {
        setContractors((prev) => {
            const updatedContractors = [...prev];
            updatedContractors.splice(index, 1);
            return updatedContractors;
        });

        setReportData((prev) => {
            const updatedContragents = [...prev.contragents];
            updatedContragents.splice(index, 1);
            return { ...prev, contragents: updatedContragents };
        });
    };
    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split(".");
        return new Date(`${year}-${month}-${day}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            const [
                reportTypesRes,
                physicalPersonsRes,
                suppliersRes,
                rolesRes,
                reportStatusesRes,
            ] = await Promise.all([
                getData(
                    `${
                        import.meta.env.VITE_API_URL
                    }report-types?=with-count=true`
                ),
                getData(`${import.meta.env.VITE_API_URL}physical-persons`),
                getData(
                    `${import.meta.env.VITE_API_URL}/contragents/suppliers`
                ),
                getData(`${import.meta.env.VITE_API_URL}roles`),
                getData(`${import.meta.env.VITE_API_URL}report-statuses`),
            ]);

            setReportTypes(reportTypesRes.data.data); // Получение Типов отчета
            setPhysicalPersons(physicalPersonsRes.data); // Получение физ. лиц для команды проекта
            setSuppliers(suppliersRes.data); // Получение подрядчиков
            setRoles(rolesRes.data.data); // Получение ролей
            setReportStatuses(reportStatusesRes.data); // Получение статусов отчета

            setIsDataLoaded(true);
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Обновление статуса проекта в отчете
        const updateStatus = () => {
            const today = new Date();
            const { start, end } = reportData["execution_period"];
            let newStatus = reportData.report_status_id;

            if (start <= today && (end === null || today < end)) {
                newStatus = 1;
            } else if (start > today) {
                newStatus = 2;
            } else if (end && end < today) {
                newStatus = 4;
            }

            if (newStatus !== reportData.report_status_id) {
                setReportData((prev) => ({
                    ...prev,
                    report_status_id: newStatus,
                }));
            }
        };

        updateStatus();
    }, [reportData["execution_period"]]);

    useEffect(() => {
        if (isDataLoaded && reportId) {
            getData(`${import.meta.env.VITE_API_URL}reports/${reportId}`).then(
                (response) => {
                    setReportData(response.data);

                    [
                        "implementation_period",
                        "execution_period",
                        "report_period",
                    ].forEach((key) => {
                        setReportData((prev) => ({
                            ...prev,
                            [key]: {
                                start:
                                    parseDate(
                                        response.data[key]
                                            ?.split("-")[0]
                                            ?.trim()
                                    ) || "",
                                end:
                                    parseDate(
                                        response.data[key]
                                            ?.split("-")[1]
                                            ?.trim()
                                    ) || "",
                            },
                        }));
                    });

                    setTeammates(response.data.responsible_persons);
                    setContractors(response.data.contragents);
                }
            );
        }
    }, [isDataLoaded, reportId]);

    useEffect(() => {
        console.log(reportData);
    }, [reportData]);

    return (
        <div className="grid gap-6">
            <div className="grid gap-3 grid-cols-2">
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

            <div className="grid gap-3 grid-cols-2">
                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">
                        Бюджет проекта, млрд руб.
                    </span>
                    <div className="border-2 border-gray-300 p-1 h-[32px]">
                        <input
                            type="text"
                            className="w-full"
                            placeholder="0.0"
                            value={reportData.budget_in_billions}
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
                            value={reportData.contract_id}
                        >
                            {contracts.length > 0 &&
                                contracts.map((contract) => (
                                    <option
                                        value={contract.id}
                                        key={contract.id}
                                    >
                                        {contract.contract_name}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid gap-3 grid-cols-2">
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
                        ? "grid-cols-2"
                        : "grid-cols-1"
                }`}
            >
                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">Статус</span>
                    <div className="border-2 border-gray-300 p-1 h-[32px]">
                        <select
                            className="w-full"
                            value={reportData.report_status_id}
                            onChange={(e) =>
                                handleInputChange(e, "report_status_id")
                            }
                        >
                            {reportStatuses.map((status) => (
                                <option value={status.id} key={status.id}>
                                    {status.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {reportData["report_status_id"] == 4 && (
                    <div className="flex flex-col gap-2 justify-between">
                        <span className="text-gray-400">
                            Добавить заключение по отчёту
                        </span>

                        <div className="grid gap-3 grid-cols-2">
                            <div className="radio-field">
                                <input
                                    type="radio"
                                    name="add_report"
                                    id="addReportYes"
                                    onChange={() => setAddReport(true)}
                                    checked={addReport ? true : false}
                                />
                                <label htmlFor="addReportYes">Да</label>
                            </div>
                            <div className="radio-field">
                                <input
                                    type="radio"
                                    name="add_report"
                                    id="addReportNo"
                                    onChange={() => setAddReport(false)}
                                    checked={addReport ? false : true}
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
                            title="Добавить сотрудника"
                        >
                            <span></span>
                        </button>
                    </span>
                </div>
            </div>

            {teammates.map((person, index) => (
                <TeammatesSection
                    key={person}
                    index={index}
                    person={person}
                    handleTeammateChange={handleTeammateChange}
                    physicalPersons={physicalPersons}
                    roles={roles}
                    removeTeammate={removeTeammate}
                />
            ))}

            <div className="grid gap-3 grid-cols-1">
                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400 flex items-center gap-2">
                        Подрядчики
                        <button
                            type="button"
                            className="add-button"
                            onClick={() => addBlock("contractor")}
                            title="Добавить подрядчика"
                        >
                            <span></span>
                        </button>
                    </span>
                </div>
            </div>

            {contractors.length > 0 &&
                contractors.map((person, index) => (
                    <ContractorsSection
                        key={person}
                        index={index}
                        person={person}
                        handleContractorChange={handleContractorChange}
                        suppliers={suppliers}
                        roles={roles}
                        getData={getData}
                        removeContractor={removeContractor}
                    />
                ))}

            <div className="mt-5 flex items-center gap-6 justify-between">
                <button
                    type="button"
                    className="rounded-lg py-3 px-5 bg-black text-white flex-[1_1_50%]"
                    onClick={() => handleSave()}
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
