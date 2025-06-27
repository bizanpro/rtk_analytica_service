import { useState, useEffect, useMemo } from "react";
import getData from "../../utils/getData";
import postData from "../../utils/postData";

import ReportItem from "./ReportItem";
import ManagementItem from "./ManagementItem";
import ManagementReportEditor from "./ManagementReportEditor";
import ReportRateEditor from "./ReportRateEditor";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

const Reports = () => {
    const REPORTS_URL = `${import.meta.env.VITE_API_URL}reports`;
    const MANAGEMENT_URL = `${import.meta.env.VITE_API_URL}management-reports`;

    const COLUMNS = [
        [
            { label: "Отчёт", key: "name" },
            { label: "Проект", key: "project" },
            { label: "Заказкчик", key: "contragent" },
            { label: "Банк", key: "creditors" },
            { label: "Бюджет", key: "project_budget" },
            { label: "Срок", key: "implementation_period" },
            { label: "Руководитель проекта", key: "project_managers" },
            { label: "Статус", key: "status" },
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
    const [mode, setMode] = useState("read");

    const [reportsList, setReportsList] = useState([]);
    const [managementList, setManagementList] = useState([]);

    const [managementEditorState, setManagementEditorState] = useState(false); // Конструктор отчёта
    const [reportWindowsState, setReportWindowsState] = useState(false); // Конструктор отчёта

    const [reportData, setReportData] = useState({});

    const [availableMonths, setAvailableMonths] = useState([]);

    const [filteredAvailableMonths, setFilteredAvailableMonths] = useState([]);
    const [filterOptionsList, setFilterOptionsList] = useState({}); // Список доступных параметров фильтров

    const [selectedProjectsFilters, setSelectedProjectsFilters] = useState({}); // Выбранные параметры фильтров во вкладке проектов
    const [selectedManagementFilters, setSelectedManagementFilters] = useState(
        {}
    ); // Выбранные параметры фильтров во вкладке Сотрудника

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
                    ? report.name === selectedManagementReport
                    : true) &&
                (selectedPhysicalPerson && selectedPhysicalPerson !== "default"
                    ? report.physical_person.name === selectedPhysicalPerson
                    : true)
            );
        });
        return result;
    }, [managementList, selectedManagementReport, selectedPhysicalPerson]);

    // Заполняем селектор отчетов Сотрудника
    const managementReportsOptions = useMemo(() => {
        const allReports = managementList.flatMap((item) => item.name);
        return Array.from(new Set(allReports));
    }, [managementList]);

    // Заполняем селектор ответственных
    const physicalPersonOptions = useMemo(() => {
        const allReports = managementList.flatMap(
            (item) => item.physical_person.name
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
                    setReportsList(response.data.reports);
                    setSelectedManagementReport("default");
                    setSelectedPhysicalPerson("default");
                }
            })
            .finally(() => setIsLoading(false));
    };

    const filterAvailableMonths = () => {
        if (selectedManagementReport === "default") {
            setFilteredAvailableMonths(availableMonths);
        } else {
            const targetReport = managementList.find(
                (item) => item.name === selectedManagementReport
            );

            const selectedMonth = format(
                parseISO(targetReport?.report_month),
                "yyyy-MM",
                { locale: ru }
            );

            setFilteredAvailableMonths(
                availableMonths.filter((item) => item.value === selectedMonth)
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

        getData(`${MANAGEMENT_URL}/?${queryParams.toString()}`)
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

    // Открытие окна отчёта
    const openReportEditor = (reportData) => {
        setReportData(reportData);

        if (reportData) {
            setReportWindowsState(true);
        }
    };

    // Открытие окна редактора отчета Сотрудника
    const openManagementReportEditor = (props, mode = "read") => {
        // setPopupState(false);
        setManagementReportData(props);
        setMode(mode);
        setManagementEditorState(true);
    };

    // Отправляем новый отчёт Сотрудника
    const sendNewReport = (extendReportData) => {
        query = toast.loading("Выполняется отправка", {
            containerId: "report",
            position: "top-center",
        });

        postData(
            "POST",
            `${import.meta.env.VITE_API_URL}management-reports`,
            extendReportData
        )
            .then((response) => {
                if (response?.ok) {
                    toast.update(query, {
                        render: "Данные сохранены",
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
                    toast.error("Ошибка сохранения данных", {
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

    // Обновляем  отчёт Менеджмента
    const updateReport = (extendReportData) => {
        query = toast.loading("Обновление", {
            containerId: "report",
            position: "top-center",
        });

        postData(
            "PATCH",
            `${import.meta.env.VITE_API_URL}management-reports/${
                extendReportData.id
            }`,
            extendReportData
        ).then((response) => {
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
        });
    };

    // Обновляем отчет Проекта
    const updateReportDetails = (report, action) => {
        query = toast.loading("Обновление", {
            containerId: "report",
            position: "top-center",
        });

        report.action = action;

        postData(
            "PATCH",
            `${import.meta.env.VITE_API_URL}reports/${report.id}`,
            report
        ).then((response) => {
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
                setReportWindowsState(false);
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
        });
    };

    useEffect(() => {
        setManagementEditorState(false);
        setReportWindowsState(false);
    }, [activeTab]);

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

                                <button
                                    type="button"
                                    className="border rounded-lg py-1 px-5"
                                    onClick={() =>
                                        setSelectedProjectsFilters([])
                                    }
                                >
                                    Очистить
                                </button>
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
                                    >
                                        <option value="">Ответственный</option>
                                        {physicalPersonOptions.length > 0 &&
                                            physicalPersonOptions.map(
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

                                    <button
                                        type="button"
                                        className="border rounded-lg py-1 px-5"
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
                                    />
                                ))
                            )}
                        </tbody>
                    </table>

                    {activeTab === "projects" && reportWindowsState && (
                        <div
                            className="bg-white border-2 border-gray-300 overflow-x-hidden overflow-y-auto fixed top-[5%] bottom-[5%] right-[2%] w-[35%]"
                            style={{ minHeight: "calc(100vh - 10%)" }}
                        >
                            <ReportRateEditor
                                {...reportData}
                                closeEditor={() => setReportWindowsState(false)}
                                updateReportDetails={updateReportDetails}
                                mode={mode}
                            />
                        </div>
                    )}

                    {activeTab === "management" && managementEditorState && (
                        <div
                            className="bg-white overflow-x-hidden overflow-y-auto fixed top-[5%] bottom-[5%] right-[2%] w-[35%]"
                            style={{ minHeight: "calc(100vh - 10%)" }}
                        >
                            <ManagementReportEditor
                                managementReportData={managementReportData}
                                setManagementReportData={
                                    setManagementReportData
                                }
                                setManagementEditorState={
                                    setManagementEditorState
                                }
                                sendNewReport={sendNewReport}
                                updateReport={updateReport}
                                mode={mode}
                            />
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Reports;
