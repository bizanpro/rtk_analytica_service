import { useState, useEffect, useCallback } from "react";

import getData from "../../utils/getData";
import formatMoney from "../../utils/formatMoney";
import parseDate from "../../utils/parseDate";

import { IMaskInput } from "react-imask";

import TeammatesSection from "../TeammatesSection";
import ContractorsSection from "../ContractorsSection";
import Loader from "../Loader";

const isValidDateRange = (str) => {
    const regex = /^(\d{2})\.(\d{2})\.(\d{4}) - (\d{2})\.(\d{2})\.(\d{4})$/;
    return regex.test(str);
};
const isFirstDateValid = (str) => {
    const match = str.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
    return !!match;
};
const isValidDate = (str) => {
    const regex = /^\d{2}\.\d{2}\.\d{4}$/;
    return regex.test(str);
};

const ProjectReportWindow = ({
    sendReport,
    reportWindowsState,
    contracts,
    reportId,
    updateReport,
    setReportId,
    mode,
}) => {
    const [reportData, setReportData] = useState({
        report_status_id: "",
        report_type_id: "",
        budget_in_billions: "",
        service_cost_in_rubles: "",
        approval_date: "",
        contract_id: "",
        report_period: "",
        implementation_period: "",
        execution_period: "",
        responsible_persons: [],
        contragents: [],
        show_cost: true,
    });

    const [teammates, setTeammates] = useState([]);
    const [contractors, setContractors] = useState([]);
    const [reportTypes, setReportTypes] = useState([]);
    const [physicalPersons, setPhysicalPersons] = useState([]);
    const [roles, setRoles] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [reportStatuses, setReportStatuses] = useState([]);
    const [regularityOptions, setRegularityOptions] = useState([]);

    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [errorMessage, setErrorMessage] = useState("");

    // Валидация полей
    const validateFields = () => {
        const newErrors = {};

        if (!reportData.report_type_id) {
            newErrors.report_type_id = "Тип отчёта обязателен";
        } else {
            if (reportData.show_cost === true) {
                if (
                    !reportData.service_cost_in_rubles ||
                    reportData.service_cost_in_rubles <= 0
                ) {
                    newErrors.service_cost_in_rubles =
                        "Стоимость услуг для этого типа отчета обязательна";
                }
            }
        }

        if (isValidDate(reportData.approval_date)) {
            if (
                !reportData.budget_in_billions ||
                reportData.budget_in_billions <= 0
            ) {
                newErrors.budget_in_billions = "Бюджет должен быть больше 0";
            }

            if (!isValidDateRange(reportData.implementation_period)) {
                newErrors.implementation_period =
                    "Укажите полный период реализации";
            }
        }

        if (!reportData.contract_id) {
            newErrors.contract_id = "Договор обязателен";
        }

        if (!reportData.regularity) {
            newErrors.regularity = "Регулярность обязателена";
        }

        if (!isValidDateRange(reportData.report_period)) {
            newErrors.report_period = "Укажите полный отчетный период";
        }

        if (!isFirstDateValid(reportData.execution_period)) {
            newErrors.execution_period = "Укажите начало периода выполнения";
        } else {
            if (isValidDate(reportData.approval_date)) {
                const today = new Date();
                const approvalDate = parseDate(reportData.approval_date);
                const [startStr, endStr] =
                    reportData.execution_period.split(" - ");

                if (
                    endStr &&
                    isFirstDateValid(endStr) &&
                    isValidDate(reportData.approval_date)
                ) {
                    const endDate = parseDate(endStr);

                    if (approvalDate < endDate) {
                        newErrors.execution_period =
                            "Дата утверждения не может быть раньше даты окончания периода выполнения";
                    } else if (approvalDate > today) {
                        newErrors.execution_period =
                            "Дата утверждения не может быть в будущем от текущей даты";
                    }
                }
            }
        }

        if (reportData.responsible_persons.length === 0) {
            newErrors.responsible_persons =
                "Добавьте хотя бы одного сотрудника";
        } else {
            const invalidResponsiblePersons =
                reportData.responsible_persons.filter(
                    (person) => !person.physical_person_id || !person.role_id
                );

            if (invalidResponsiblePersons.length > 0) {
                newErrors.responsible_persons =
                    "Убедитесь, что у каждого члена команды заполнены все поля";
            }
        }

        if (reportData.contragents.length > 0) {
            const invalidContragents = reportData.contragents.filter(
                (contractor) =>
                    !contractor.contract_id ||
                    !contractor.contragent_id ||
                    !contractor.role_id
            );

            if (invalidContragents.length > 0) {
                newErrors.contragents =
                    "Убедитесь, что у каждого подрядчика заполнены все поля";
            }
        }

        return newErrors;
    };

    // Сохранение отчета
    const handleSave = () => {
        const newErrors = validateFields();

        if (Object.keys(newErrors).length === 0) {
            reportId
                ? updateReport(reportData, reportId)
                : sendReport(reportData);
        } else {
            alert(
                "Исправьте ошибки перед сохранением:\n" +
                    Object.values(newErrors).join("\n")
            );
        }
    };

    // Обработка полей
    const handleInputChange = (e, name) => {
        let value;

        if (
            name === "approval_date" ||
            name === "report_period" ||
            name === "implementation_period" ||
            name === "execution_period"
        ) {
            value = e;
        } else if (name === "report_type_id") {
            value = +e.target.value;
        } else {
            value = e.target.value;
        }

        if (name === "budget_in_billions") {
            value = value.replace(/[^0-9.,]/g, "");
            value = value.replace(".", ",");

            const parts = value.split(",");
            if (parts.length > 2) {
                value = parts[0] + "," + parts[1];
            }

            if (parts[1]?.length > 5) {
                value = `${parts[0]},${parts[1].slice(0, 5)}`;
            }
        }

        if (name === "service_cost_in_rubles") {
            value = formatMoney(value);
        }

        setReportData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

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

    useEffect(() => {
        if (isDataLoaded && reportId) {
            getData(`${import.meta.env.VITE_API_URL}reports/${reportId}`).then(
                (response) => {
                    setReportData(response.data);
                    setTeammates(response.data.responsible_persons);
                    setContractors(response.data.contragents);
                    setIsLoading(false);
                }
            );
        }
    }, [isDataLoaded, reportId]);

    // События зависимости от выбранного типа отчета
    useEffect(() => {
        const selectedType = reportTypes.find(
            (type) => type.id === +reportData.report_type_id
        );

        if (selectedType) {
            setReportData((prev) => ({
                ...prev,
                show_cost: selectedType.show_cost,
                is_regular: selectedType.is_regular,
                ...(selectedType.is_regular === false && {
                    regularity: "единоразовый",
                }),
            }));
        }
    }, [reportData.report_type_id]);

    const validateApprovalDate = () => {
        if (isValidDate(reportData.approval_date)) {
            const today = new Date();
            const approvalDate = parseDate(reportData.approval_date);
            const [startStr, endStr] = reportData.execution_period.split(" - ");

            if (
                endStr &&
                isFirstDateValid(endStr) &&
                isValidDate(reportData.approval_date)
            ) {
                const endDate = parseDate(endStr);

                if (approvalDate < endDate) {
                    setErrorMessage(
                        "Дата утверждения не может быть раньше даты окончания периода выполнения"
                    );
                } else if (approvalDate > today) {
                    setErrorMessage(
                        "Дата утверждения не может быть в будущем от текущей даты"
                    );
                } else {
                    setErrorMessage("");
                    setReportData((prev) => ({
                        ...prev,
                        report_status_id: 3,
                    }));
                }
            }
        } else {
            if (isFirstDateValid(reportData.execution_period)) {
                const today = new Date();
                const [startStr, endStr] =
                    reportData.execution_period.split(" - ");
                const startDate = parseDate(startStr);

                if (today > startDate) {
                    setReportData((prev) => ({
                        ...prev,
                        report_status_id: 2,
                    }));
                } else if (today < startDate) {
                    setReportData((prev) => ({
                        ...prev,
                        report_status_id: 1,
                    }));
                }
            } else {
                setReportData((prev) => ({
                    ...prev,
                    report_status_id: "",
                }));
            }
        }
    };

    // Обновление статуса проекта в отчете
    useEffect(() => {
        validateApprovalDate();
    }, [reportData.execution_period, reportData.approval_date]);

    useEffect(() => {
        const fetchData = async () => {
            const [
                reportTypesRes,
                physicalPersonsRes,
                suppliersRes,
                rolesRes,
                reportStatusesRes,
                regularityOptionsRes,
            ] = await Promise.allSettled([
                getData(
                    `${
                        import.meta.env.VITE_API_URL
                    }report-types?with-count=true`
                ),
                getData(`${import.meta.env.VITE_API_URL}physical-persons`),
                getData(`${import.meta.env.VITE_API_URL}suppliers`),
                getData(`${import.meta.env.VITE_API_URL}roles`),
                getData(`${import.meta.env.VITE_API_URL}report-statuses`),
                getData(
                    `${import.meta.env.VITE_API_URL}reports/regularity-options`
                ),
            ]);

            if (reportTypesRes.status === "fulfilled")
                setReportTypes(reportTypesRes.value.data.data); // Получение Типов отчета

            if (physicalPersonsRes.status === "fulfilled") {
                setPhysicalPersons(physicalPersonsRes.value.data); // Получение физ. лиц для команды проекта
            }

            if (suppliersRes.status === "fulfilled")
                setSuppliers(suppliersRes.value.data.data); // Получение подрядчиков

            if (rolesRes.status === "fulfilled")
                setRoles(rolesRes.value.data.data); // Получение ролей

            if (reportStatusesRes.status === "fulfilled")
                setReportStatuses(reportStatusesRes.value.data); // Получение статусов отчета

            if (regularityOptionsRes.status === "fulfilled")
                setRegularityOptions(regularityOptionsRes.value.data); // Получение статусов отчета

            setIsDataLoaded(true);
        };

        fetchData();
    }, []);

    return (
        <div className="grid gap-6 relative bg-white">
            {reportId ? isLoading && <Loader /> : !isDataLoaded && <Loader />}

            <div className="text-2xl w-full">
                {reportData.report_period_code}
            </div>

            <div className="grid gap-3 grid-cols-2">
                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">Тип отчёта</span>
                    <div className="border-2 border-gray-300 p-1 h-[32px]">
                        <select
                            className="w-full h-full"
                            onChange={(e) =>
                                handleInputChange(e, "report_type_id")
                            }
                            value={reportData.report_type_id}
                            disabled={mode === "read"}
                        >
                            <option value="">Выбрать тип</option>
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

                    <IMaskInput
                        mask="00.00.0000 - 00.00.0000"
                        className="border-2 border-gray-300 p-1 w-full h-[32px]"
                        onAccept={(e) => handleInputChange(e, "report_period")}
                        value={reportData.report_period}
                        placeholder="дд.мм.гггг - дд.мм.гггг"
                        disabled={mode === "read"}
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
                            value={reportData.budget_in_billions?.replace(
                                ".",
                                ","
                            )}
                            onChange={(e) =>
                                handleInputChange(e, "budget_in_billions")
                            }
                            disabled={mode === "read"}
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="block mb-2 text-gray-400">
                        Период реализации
                    </span>

                    <IMaskInput
                        mask="00.00.0000 - 00.00.0000"
                        className="border-2 border-gray-300 p-1 w-full h-[32px]"
                        onAccept={(e) =>
                            handleInputChange(e, "implementation_period")
                        }
                        value={reportData.implementation_period}
                        placeholder="дд.мм.гггг - дд.мм.гггг"
                        disabled={mode === "read"}
                    />
                </div>
            </div>

            <div className="grid gap-3 grid-cols-1">
                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">Договор</span>
                    <div className="border-2 border-gray-300 p-1 h-[32px]">
                        <select
                            className="w-full h-full"
                            onChange={(e) =>
                                handleInputChange(e, "contract_id")
                            }
                            value={reportData.contract_id || ""}
                            disabled={mode === "read"}
                        >
                            <option value="">Выбрать договор</option>
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

            <div
                className={`grid gap-3 ${
                    reportData.show_cost === true
                        ? "grid-cols-2"
                        : " grid-cols-1"
                }`}
            >
                {reportData.show_cost === true && (
                    <div className="flex flex-col gap-2 justify-between">
                        <span className="text-gray-400">
                            Стоимость услуг, руб.
                        </span>
                        <div className="border-2 border-gray-300 p-1 h-[32px]">
                            <input
                                type="text"
                                className="w-full"
                                placeholder="0.0"
                                value={formatMoney(
                                    reportData.service_cost_in_rubles
                                )}
                                onChange={(e) =>
                                    handleInputChange(
                                        e,
                                        "service_cost_in_rubles"
                                    )
                                }
                                disabled={mode === "read"}
                            />
                        </div>
                    </div>
                )}

                <div className="flex flex-col">
                    <span className="block mb-2 text-gray-400">
                        Период выполнения
                    </span>

                    <IMaskInput
                        mask="00.00.0000 - 00.00.0000"
                        className="border-2 border-gray-300 p-1 w-full h-[32px]"
                        onAccept={(e) =>
                            handleInputChange(e, "execution_period")
                        }
                        value={reportData.execution_period}
                        placeholder="дд.мм.гггг - дд.мм.гггг"
                        disabled={mode === "read"}
                    />
                </div>
            </div>

            <div className="grid gap-3 grid-cols-1">
                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">Регулярность</span>
                    <div className="border-2 border-gray-300 p-1 h-[32px]">
                        <select
                            className="w-full h-full"
                            onChange={(e) => handleInputChange(e, "regularity")}
                            value={reportData.regularity || ""}
                            disabled={
                                mode === "read" ||
                                reportData.is_regular === false
                            }
                        >
                            <option value="">Выбрать из списка</option>
                            {regularityOptions.length > 0 &&
                                regularityOptions.map((item) => {
                                    const value = item.toLowerCase();

                                    if (
                                        value === "единоразовый" &&
                                        reportData.is_regular === true
                                    ) {
                                        return null;
                                    }

                                    return (
                                        <option value={value} key={item}>
                                            {item}
                                        </option>
                                    );
                                })}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid gap-3 grid-cols-2">
                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400">Статус</span>
                    <div className="border-2 border-gray-300 p-1 h-[32px]">
                        <select
                            className="w-full h-full"
                            value={reportData?.report_status_id}
                            onChange={(e) =>
                                handleInputChange(e, "report_status_id")
                            }
                            disabled
                        >
                            <option value=""></option>
                            {reportStatuses.map((status) => (
                                <option value={status.id} key={status.id}>
                                    {status.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col relative">
                    <span className="block mb-2 text-gray-400">
                        Дата утверждения
                    </span>

                    <IMaskInput
                        mask="00.00.0000"
                        className="border-2 border-gray-300 p-1 w-full h-[32px]"
                        onAccept={(e) => handleInputChange(e, "approval_date")}
                        value={reportData.approval_date}
                        placeholder="дд.мм.гггг"
                        disabled={
                            mode === "read" ||
                            !isFirstDateValid(reportData.execution_period)
                        }
                    />

                    {errorMessage !== "" && (
                        <span className="text-red-400 absolute top-[100%] text-sm">
                            {errorMessage}
                        </span>
                    )}
                </div>
            </div>

            <div className="grid gap-3 grid-cols-1">
                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400 flex items-center gap-2">
                        Команда проекта
                        {mode === "edit" && (
                            <button
                                type="button"
                                className="add-button"
                                onClick={() => addBlock("teammate")}
                                title="Добавить сотрудника"
                            >
                                <span></span>
                            </button>
                        )}
                    </span>
                </div>
            </div>

            {teammates.map((person, index) => (
                <TeammatesSection
                    key={index}
                    index={index}
                    person={person}
                    handleTeammateChange={handleTeammateChange}
                    physicalPersons={physicalPersons}
                    roles={roles}
                    removeTeammate={removeTeammate}
                    mode={mode}
                />
            ))}

            <div className="grid gap-3 grid-cols-1">
                <div className="flex flex-col gap-2 justify-between">
                    <span className="text-gray-400 flex items-center gap-2">
                        Подрядчики
                        {mode === "edit" && (
                            <button
                                type="button"
                                className="add-button"
                                onClick={() => addBlock("contractor")}
                                title="Добавить подрядчика"
                            >
                                <span></span>
                            </button>
                        )}
                    </span>
                </div>
            </div>

            {contractors.length > 0 &&
                contractors.map((person, index) => (
                    <ContractorsSection
                        key={index}
                        index={index}
                        person={person}
                        handleContractorChange={handleContractorChange}
                        suppliers={suppliers}
                        roles={roles}
                        removeContractor={removeContractor}
                        mode={mode}
                    />
                ))}

            <div className="mt-5 flex items-center gap-6 justify-between">
                {mode === "edit" ? (
                    <>
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
                            onClick={() => {
                                setReportId(null);
                                reportWindowsState(false);
                            }}
                            className="border rounded-lg py-3 px-5 flex-[1_1_50%]"
                            title="Отменить сохранение отчёта"
                        >
                            Отменить
                        </button>
                    </>
                ) : (
                    <div className="grid gap-2 flex-grow grid-cols-1">
                        <button
                            type="button"
                            onClick={() => {
                                setReportId(null);
                                reportWindowsState(false);
                            }}
                            className="border rounded-lg py-3 px-5"
                            title="Закрыть отчёт"
                        >
                            Закрыть
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectReportWindow;
