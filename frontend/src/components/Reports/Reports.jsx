import { useState, useEffect, useMemo } from "react";
import getData from "../../utils/getData";
import postData from "../../utils/postData";

import ReportItem from "./ReportItem";
import ManagementItem from "./ManagementItem";
import ManagementReportEditor from "./ManagementReportEditor";
import ReportRateEditor from "./ReportRateEditor";
import ProjectReportWindow from "../ProjectCard/ProjectReportWindow";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Reports = () => {
    const REPORTS_URL = `${import.meta.env.VITE_API_URL}reports`;
    const MANAGEMENT_URL = `${import.meta.env.VITE_API_URL}management-reports`;

    const COLUMNS = [
        [
            { label: "Отчёт", key: "report_period_code" },
            { label: "Проект", key: "project" },
            { label: "Заказкчик", key: "contragent" },
            { label: "Банк", key: "creditors" },
            { label: "Бюджет", key: "project_budget" },
            { label: "Срок", key: "implementation_period" },
            { label: "Руководитель проекта", key: "project_managers" },
            { label: "Статус", key: "report_status" },
            { label: "Период выполнения", key: "days" },
        ],
        [
            { label: "Отчёт", key: "name" },
            { label: "Отчётный месяц", key: "report_month" },
            { label: "Оценка", key: "score" },
            { label: "Отвественный", key: "physical_person" },
            { label: "Статус", key: "status" },
            { label: "Дата утверждения", key: "approval_date" },
            { label: "Дата изменения", key: "updated_at" },
        ],
    ];

    const FILTER_LABELS = [
        { key: "contragents", label: "Заказчик" },
        { key: "industries", label: "Отрасль" },
        { key: "creditors", label: "Банк" },
        { key: "project_managers", label: "Руководитель проекта" },
        { key: "report_types", label: "Тип отчёта" },
        { key: "statuses", label: "Статус" },
    ];

    let query;

    const [activeTab, setActiveTab] = useState("projects");
    const [isLoading, setIsLoading] = useState(true);
    // const [mode, setMode] = useState("read");

    const [reportsList, setReportsList] = useState([]);
    const [managementList, setManagementList] = useState([]);

    const [managementEditorState, setManagementEditorState] = useState(false); // Редактор оценки
    const [rateEditorState, setRateEditorState] = useState(false); // Редактор отчёта менеджмента
    const [reportWindowsState, setReportWindowsState] = useState(false); // Редактор отчёта

    const [reportData, setReportData] = useState({});
    const [contracts, setContracts] = useState([]);
    const [reportId, setReportId] = useState(null);

    const [availableMonths, setAvailableMonths] = useState([]);

    const [filteredAvailableMonths, setFilteredAvailableMonths] = useState([]);
    const [filterOptionsList, setFilterOptionsList] = useState({}); // Список доступных параметров фильтров

    const [selectedProjectsFilters, setSelectedProjectsFilters] = useState({}); // Выбранные параметры фильтров во вкладке отчетов проектов
    const [selectedManagementFilters, setSelectedManagementFilters] = useState({
        report_month: [""],
    }); // Выбранные параметры фильтров во вкладке отчетов сотрудника

    const [selectedManagementReport, setSelectedManagementReport] =
        useState("default"); // Выбранный отчет
    const [selectedPhysicalPerson, setSelectedPhysicalPerson] =
        useState("default"); // Выбранный отвественный

    const [managementReportData, setManagementReportData] = useState({
        name: "",
        physical_person_id: 1,
        report_month: "",
        status_summary: "",
        problems: "",
        prospects: "",
        team: "",
        legal_issues: "",
        misc: "",
    });

    const filteredReports = useMemo(() => {
        const result = managementList.filter((report) => {
            return (
                (selectedManagementReport &&
                selectedManagementReport !== "default"
                    ? report?.name === selectedManagementReport
                    : true) &&
                (selectedPhysicalPerson && selectedPhysicalPerson !== "default"
                    ? report?.physical_person?.name === selectedPhysicalPerson
                    : true)
            );
        });

        return result;
    }, [managementList, selectedManagementReport, selectedPhysicalPerson]); // Фильтрованный список отчетов

    // Заполняем селектор отчетов Сотрудника
    const managementReportsOptions = useMemo(() => {
        const allReports = managementList.flatMap((item) => item.name);
        return Array.from(new Set(allReports));
    }, [managementList]);

    // Заполняем селектор ответственных
    const physicalPersonOptions = useMemo(() => {
        const allReports = managementList.flatMap(
            (item) => item?.physical_person?.name
        );
        return Array.from(new Set(allReports));
    }, [managementList]);

    // Обработка фильтров
    const handleFilterChange = (filterKey, value, section) => {
        const filteredValues = value.filter((v) => v !== "");

        if (section === "projects") {
            setSelectedProjectsFilters((prev) => ({
                ...prev,
                [filterKey]: filteredValues.length > 0 ? filteredValues : [],
            }));
        } else if (section === "management") {
            setSelectedManagementFilters((prev) => ({
                ...prev,
                [filterKey]: filteredValues.length > 0 ? filteredValues : [],
            }));
        }
    };

    // Получение списка отчетов
    const getFilteredReports = () => {
        setIsLoading(true);

        const queryParams = new URLSearchParams();

        Object.entries(selectedProjectsFilters).forEach(([key, values]) => {
            values.forEach((value) => {
                queryParams.append(`filters[${key}][]`, value);
            });
        });

        getData(`${REPORTS_URL}?${queryParams.toString()}`)
            .then((response) => {
                if (response.status === 200) {
                    setReportsList(response.data);
                    setSelectedManagementReport("default");
                    setSelectedPhysicalPerson("default");
                }
            })
            .finally(() => setIsLoading(false));
    };

    // Фильтрация доступных отчётных месяцев
    const filterAvailableMonths = () => {
        if (selectedManagementReport === "default") {
            setFilteredAvailableMonths(availableMonths);
        } else {
            const availableReports = filteredReports.filter(
                (item) => item?.report_month
            );

            const monthsLabels = [
                ...new Set(
                    availableReports.map(({ report_month }) => report_month)
                ),
            ];

            console.log(
                availableMonths.filter((item) =>
                    monthsLabels.includes(item.label)
                )
            );

            setFilteredAvailableMonths(
                availableMonths.filter((item) =>
                    monthsLabels.includes(item.label)
                )
            );
        }
    };

    // Получение списка доступных фильтров
    const getUpdatedProjectsFilters = () => {
        const queryParams = new URLSearchParams();

        Object.entries(selectedProjectsFilters).forEach(([key, values]) => {
            values.forEach((value) => {
                queryParams.append(`filters[${key}][]`, value);
            });
        });

        getData(
            `${
                import.meta.env.VITE_API_URL
            }reports/filter-options?${queryParams.toString()}`
        ).then((response) => {
            if (response.status === 200) {
                setFilterOptionsList(response.data);
            }
        });
    };

    // Получение списка доступных фильтров
    const getFilteredManagementReports = () => {
        setIsLoading(true);

        const queryParams = new URLSearchParams();

        Object.entries(selectedManagementFilters).forEach(([key, values]) => {
            values.forEach((value) => {
                queryParams.append(key, value);
            });
        });

        getData(`${MANAGEMENT_URL}?${queryParams.toString()}`)
            .then((response) => {
                if (response.status === 200) {
                    setManagementList(response.data);
                }
            })
            .finally(() => setIsLoading(false));
    };

    // Получаем доступные периоды для попапа отчета Сотрудника
    const getAvailableMonths = () => {
        getData(
            `${import.meta.env.VITE_API_URL}management-reports/available-months`
        ).then((response) => {
            if (response?.status == 200) {
                setAvailableMonths(response.data);
                setFilteredAvailableMonths(response.data);
            }
        });
    };

    // Открытие окна отчёта проекта
    const openReportEditor = (reportData) => {
        getContracts(reportData.contragent?.id);
        setReportId(reportData.id);

        if (reportData.id) {
            setReportWindowsState(true);
        }
    };

    // Открытие окна редактора оценки отчета
    const openRateReportEditor = (props) => {
        setReportData(props);
        setRateEditorState(true);
    };

    // Закрытие окно редактора отчета менеджмента
    const closeRateReportEditor = () => {
        setReportData({});
        setRateEditorState(false);
    };

    // Открытие окна редактора отчета менеджмента
    const openManagementReportEditor = (props) => {
        setManagementReportData(props);
        setManagementEditorState(true);
    };

    // Закрытие окно редактора отчета менеджмента
    const closeManagementReportEditor = () => {
        setManagementReportData({});
        setManagementEditorState(false);
    };

    // Обработчик открытия отчета руководителя с учетов выставленной оценки
    const managementReportEditorHandler = (reportData, rate) => {
        switch (rate) {
            case 0: {
                const newReportData = {
                    ...reportData,
                    general_assessment: 0,
                };
                openManagementReportEditor(newReportData);
                break;
            }

            case 1: {
                const newReportData = {
                    ...reportData,
                    general_assessment: 1,
                };
                openManagementReportEditor(newReportData);
                break;
            }

            case 2: {
                const newReportData = {
                    ...reportData,
                    general_assessment: 2,
                    bank_assessment: 2,
                    customer_assessment: 2,
                    team_assessment: 2,
                    contractor_assessment: 2,
                };

                updateReportDetails(newReportData, "approve");
                break;
            }

            default:
                break;
        }
    };

    // Обновляем  отчёт менеджмента
    const updateReport = (extendReportData, action) => {
        query = toast.loading("Обновление", {
            containerId: "report",
            position: "top-center",
        });

        extendReportData.action = action;

        postData(
            "PATCH",
            `${import.meta.env.VITE_API_URL}management-reports/${
                extendReportData.id
            }`,
            extendReportData
        )
            .then((response) => {
                if (response?.ok) {
                    toast.update(query, {
                        render: "Данные обновлены",
                        type: "success",
                        containerId: "report",
                        isLoading: false,
                        autoClose: 1200,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position: "top-center",
                    });
                    getFilteredManagementReports();
                    getAvailableMonths();
                    setManagementEditorState(false);
                } else {
                    toast.dismiss(query);
                    toast.error("Ошибка обновления данных", {
                        containerId: "report",
                        isLoading: false,
                        autoClose: 1500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position: "top-center",
                    });
                }
            })
            .catch((error) => {
                toast.dismiss(query);
                toast.error(error.message || "Ошибка при обновлении", {
                    containerId: "report",
                    isLoading: false,
                    autoClose: 5000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                });
            });
    };

    // Обновляем отчет с оценками
    const updateReportDetails = (report, action) => {
        query = toast.loading("Обновление", {
            containerId: "report",
            position: "top-center",
        });

        report.action = action;

        postData(
            "PATCH",
            `${
                import.meta.env.VITE_API_URL
            }management-reports/project-manager/${report.id}`,
            report
        )
            .then((response) => {
                if (response?.ok) {
                    toast.update(query, {
                        render: "Данные обновлены",
                        type: "success",
                        containerId: "report",
                        isLoading: false,
                        autoClose: 1200,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position: "top-center",
                    });
                    closeRateReportEditor();
                    getFilteredManagementReports();
                } else {
                    toast.dismiss(query);
                    toast.error("Ошибка обновления данных", {
                        containerId: "report",
                        isLoading: false,
                        autoClose: 1500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position: "top-center",
                    });
                }
            })
            .catch((error) => {
                toast.dismiss(query);
                toast.error(error.message || "Ошибка обновления данных", {
                    containerId: "report",
                    isLoading: false,
                    autoClose: 5000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                });
            });
    };

    // Получение договоров для детального отчёта
    const getContracts = (contragentId) => {
        getData(
            `${
                import.meta.env.VITE_API_URL
            }contragents/${contragentId}/contracts`
        ).then((response) => {
            if (response?.status == 200) {
                setContracts(response.data);
            }
        });
    };

    useEffect(() => {
        setManagementEditorState(false);
        setRateEditorState(false);
        setReportWindowsState(false);
        setReportId(null);
        setReportData({});
        setManagementReportData({});
    }, [activeTab]);

    useEffect(() => {
        if (rateEditorState === true) {
            setManagementEditorState(false);
        }
    }, [rateEditorState]);

    useEffect(() => {
        if (managementEditorState === true) {
            setRateEditorState(false);
        }
    }, [managementEditorState]);

    useEffect(() => {
        getUpdatedProjectsFilters();
        getFilteredReports();
    }, [selectedProjectsFilters]);

    useEffect(() => {
        getFilteredManagementReports();
    }, [selectedManagementFilters]);

    useEffect(() => {
        filterAvailableMonths();
    }, [selectedManagementReport]);

    useEffect(() => {
        getAvailableMonths();
    }, []);

    return (
        <main className="page">
            <ToastContainer containerId="report" />

            <div className="container pt-8 min-h-screen flex flex-col">
                <section className="flex flex-col justify-between gap-6 mb-8">
                    <h1 className="text-3xl font-medium">Реестр отчётов</h1>

                    <nav className="flex items-center gap-10 border-b border-gray-300 text-lg">
                        <button
                            type="button"
                            className={`py-2 transition-all border-b-2 ${
                                activeTab == "projects"
                                    ? "border-gray-500"
                                    : "border-transparent"
                            }`}
                            onClick={() => setActiveTab("projects")}
                            title="Перейти на вкладку Отчёты проектов"
                        >
                            Отчёты проектов ({reportsList.length})
                        </button>
                        <button
                            type="button"
                            className={`py-2 transition-all border-b-2 ${
                                activeTab == "management"
                                    ? "border-gray-500"
                                    : "border-transparent"
                            }`}
                            onClick={() => setActiveTab("management")}
                            title="Перейти на вкладку Отчёты сотрудников"
                        >
                            Отчёты сотрудников ({filteredReports.length})
                        </button>
                    </nav>

                    <div className="flex items-center justify-between gap-6">
                        {activeTab === "projects" && (
                            <>
                                <div className="flex items-center gap-5">
                                    {Object.entries(filterOptionsList).map(
                                        ([filterKey, filterValues], index) => {
                                            const filterLabel =
                                                FILTER_LABELS.find(
                                                    (item) =>
                                                        item.key === filterKey
                                                )?.label || filterKey;

                                            return (
                                                <select
                                                    key={index}
                                                    className="p-1 border border-gray-300 min-w-[120px] max-w-[200px]"
                                                    value={
                                                        selectedProjectsFilters[
                                                            filterKey
                                                        ] || ""
                                                    }
                                                    onChange={(e) => {
                                                        const selectedValue =
                                                            Array.from(
                                                                e.target
                                                                    .selectedOptions
                                                            ).map(
                                                                (option) =>
                                                                    option.value
                                                            );
                                                        handleFilterChange(
                                                            filterKey,
                                                            selectedValue,
                                                            "projects"
                                                        );
                                                    }}
                                                >
                                                    <option value="">
                                                        {filterLabel}
                                                    </option>
                                                    {filterValues.map(
                                                        (item) => (
                                                            <option
                                                                key={item.id}
                                                                value={item.id}
                                                            >
                                                                {item.name}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            );
                                        }
                                    )}
                                </div>

                                {Object.entries(filterOptionsList).length >
                                    0 && (
                                    <button
                                        type="button"
                                        className="border rounded-lg py-1 px-5"
                                        onClick={() =>
                                            setSelectedProjectsFilters([])
                                        }
                                        title="Очистить фильтр"
                                    >
                                        Очистить
                                    </button>
                                )}
                            </>
                        )}
                        {activeTab === "management" && (
                            <>
                                <div className="flex items-center gap-5">
                                    <select
                                        className={
                                            "p-1 border border-gray-300 min-w-[120px] max-w-[200px]"
                                        }
                                        onChange={(evt) =>
                                            setSelectedManagementReport(
                                                evt.target.value
                                            )
                                        }
                                        value={selectedManagementReport}
                                    >
                                        <option value="default">Отчёт</option>
                                        {managementReportsOptions.length > 0 &&
                                            managementReportsOptions.map(
                                                (item) => (
                                                    <option
                                                        key={item}
                                                        value={item}
                                                    >
                                                        {item}
                                                    </option>
                                                )
                                            )}
                                    </select>
                                    <select
                                        className={
                                            "p-1 border border-gray-300 min-w-[120px] max-w-[200px]"
                                        }
                                        onChange={(e) => {
                                            const selectedValue = Array.from(
                                                e.target.selectedOptions
                                            ).map((option) => option.value);

                                            handleFilterChange(
                                                "report_month",
                                                selectedValue,
                                                "management"
                                            );
                                        }}
                                        value={
                                            selectedManagementFilters
                                                .report_month[0]
                                        }
                                    >
                                        <option value="">Отчётный месяц</option>
                                        {filteredAvailableMonths.length > 0 &&
                                            filteredAvailableMonths.map(
                                                (month) => (
                                                    <option
                                                        key={month.value}
                                                        value={month.value}
                                                    >
                                                        {month.label}
                                                    </option>
                                                )
                                            )}
                                    </select>

                                    <select
                                        className={
                                            "p-1 border border-gray-300 min-w-[120px] max-w-[200px]"
                                        }
                                        onChange={(evt) =>
                                            setSelectedPhysicalPerson(
                                                evt.target.value
                                            )
                                        }
                                        value={selectedPhysicalPerson}
                                    >
                                        <option value="default">
                                            Ответственный
                                        </option>
                                        {physicalPersonOptions.length > 0 &&
                                            physicalPersonOptions.map(
                                                (item, index) => (
                                                    <option
                                                        key={`${item}_${index}`}
                                                        value={item}
                                                    >
                                                        {item}
                                                    </option>
                                                )
                                            )}
                                    </select>

                                    <button
                                        type="button"
                                        className="border rounded-lg py-1 px-5"
                                        onClick={() => {
                                            setSelectedPhysicalPerson(
                                                "default"
                                            );
                                            setSelectedManagementReport(
                                                "default"
                                            );
                                            setSelectedManagementFilters({
                                                report_month: [""],
                                            });
                                        }}
                                        title="Очистить фильтр"
                                    >
                                        Очистить
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </section>

                <section className="w-full pb-5 relative min-h-full flex-grow overflow-y-auto">
                    <table className="table-auto w-full border-collapse border-gray-300 text-sm">
                        <thead className="text-gray-400 text-left">
                            <tr className="border-b border-gray-300">
                                {COLUMNS[activeTab === "projects" ? 0 : 1].map(
                                    ({ label, key }) => (
                                        <th
                                            className="text-base px-4 py-2 min-w-[180px] max-w-[200px]"
                                            rowSpan="2"
                                            key={key}
                                        >
                                            {label}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td className="text-base px-4 py-2">
                                        Загрузка...
                                    </td>
                                </tr>
                            ) : activeTab === "projects" ? (
                                reportsList.length > 0 &&
                                reportsList.map((item) => (
                                    <ReportItem
                                        key={item.id}
                                        columns={COLUMNS[0]}
                                        props={item}
                                        openReportEditor={openReportEditor}
                                    />
                                ))
                            ) : (
                                filteredReports.length > 0 &&
                                filteredReports.map((item) => (
                                    <ManagementItem
                                        key={item.id}
                                        columns={COLUMNS[1]}
                                        props={item}
                                        openManagementReportEditor={
                                            openManagementReportEditor
                                        }
                                        openRateReportEditor={
                                            openRateReportEditor
                                        }
                                        managementReportEditorHandler={
                                            managementReportEditorHandler
                                        }
                                    />
                                ))
                            )}
                        </tbody>
                    </table>

                    {activeTab === "projects" && reportWindowsState && (
                        <div
                            className="bg-white border-2 border-gray-300 overflow-x-hidden overflow-y-auto fixed top-[5%] bottom-[5%] right-[2%] w-[35%] p-3"
                            style={{ minHeight: "calc(100vh - 10%)" }}
                        >
                            <ProjectReportWindow
                                reportWindowsState={setReportWindowsState}
                                contracts={contracts}
                                reportId={reportId}
                                setReportId={setReportId}
                                mode={"read"}
                            />
                        </div>
                    )}

                    {activeTab === "management" && (
                        <>
                            {rateEditorState && (
                                <div
                                    className="bg-white overflow-x-hidden overflow-y-auto fixed top-[5%] bottom-[5%] right-[2%] w-[35%]"
                                    style={{ minHeight: "calc(100vh - 10%)" }}
                                >
                                    <ReportRateEditor
                                        reportData={reportData}
                                        closeEditor={closeRateReportEditor}
                                        updateReportDetails={
                                            updateReportDetails
                                        }
                                    />
                                </div>
                            )}

                            {managementEditorState && (
                                <div
                                    className="bg-white overflow-x-hidden overflow-y-auto fixed top-[5%] bottom-[5%] right-[2%] w-[35%]"
                                    style={{ minHeight: "calc(100vh - 10%)" }}
                                >
                                    <ManagementReportEditor
                                        managementReportData={
                                            managementReportData
                                        }
                                        setManagementReportData={
                                            setManagementReportData
                                        }
                                        updateReport={updateReport}
                                        closeManagementReportEditor={
                                            closeManagementReportEditor
                                        }
                                    />
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Reports;
