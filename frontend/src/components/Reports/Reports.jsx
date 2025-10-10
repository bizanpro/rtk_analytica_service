import { useState, useEffect, useMemo } from "react";

import getData from "../../utils/getData";
import postData from "../../utils/postData";
import { sortDateList } from "../../utils/sortDateList";

import ReportItem from "./ReportItem";
import ManagementItem from "./ManagementItem";

import ManagementReportEditor from "./ManagementReportEditor";
import ReportRateEditor from "../ReportRateEditor/ReportRateEditor";
import ReportWindow from "../ReportWindow/ReportWindow";

import TheadSortButton from "../TheadSortButton/TheadSortButton";
import MultiSelectWithSearch from "../MultiSelect/MultiSelectWithSearch";
import FilterButton from "../FilterButton";
import OverlayTransparent from "../Overlay/OverlayTransparent";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./Reports.scss";

const Reports = () => {
    const REPORTS_URL = `${import.meta.env.VITE_API_URL}reports`;
    const MANAGEMENT_URL = `${import.meta.env.VITE_API_URL}management-reports`;

    let query;

    const [activeTab, setActiveTab] = useState("projects");
    const [isLoading, setIsLoading] = useState(true);

    const [sortBy, setSortBy] = useState({ key: "", action: "" });

    const [openFilter, setOpenFilter] = useState("");

    const [reportsList, setReportsList] = useState([]);
    const [managementList, setManagementList] = useState([]);
    const [sortedManagementList, setSortedManagementList] = useState([]);

    const [managementEditorState, setManagementEditorState] = useState(false); // Редактор отчёта менеджмента
    const [rateEditorState, setRateEditorState] = useState(false); // Редактор оценки
    const [reportWindowsState, setReportWindowsState] = useState(false); // Редактор отчёта

    const [reportData, setReportData] = useState({});
    const [reportName, setReportName] = useState("");
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

    // Фильтрованный список отчетов
    const filteredReports = useMemo(() => {
        const result = sortedManagementList.filter((report) => {
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
    }, [
        sortedManagementList,
        selectedManagementReport,
        selectedPhysicalPerson,
    ]);

    // Заполняем селектор отчетов Сотрудника
    // const managementReportsOptions = useMemo(() => {
    //     const allReports = sortedManagementList.flatMap((item) => item.name);
    //     return Array.from(new Set(allReports));
    // }, [sortedManagementList]);

    // // Заполняем селектор ответственных
    // const physicalPersonOptions = useMemo(() => {
    //     const allReports = sortedManagementList.flatMap((item) =>
    //         item?.physical_person ? [item.physical_person.name] : []
    //     );

    //     return Array.from(new Set(allReports));
    // }, [sortedManagementList]);

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
                    setSortedManagementList(response.data);
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

        setReportName(
            `${reportData?.project?.name} / ${reportData?.report_period_code}`
        );

        if (
            reportData.id &&
            `${reportData?.project?.name} / ${reportData?.report_period_code}` !=
                ""
        ) {
            setReportWindowsState(true);
        }
    };

    // Открытие окна редактора оценки отчета
    const openRateReportEditor = (props) => {
        closeManagementReportEditor();
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
        closeRateReportEditor();
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
                openRateReportEditor(newReportData);
                break;
            }

            case 1: {
                const newReportData = {
                    ...reportData,
                    general_assessment: 1,
                };
                openRateReportEditor(newReportData);
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
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        extendReportData.action = action;

        postData(
            "PATCH",
            `${import.meta.env.VITE_API_URL}management-reports/${
                extendReportData.real_id
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
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
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
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
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
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                });
            });
    };

    // Обновляем отчет с оценками
    const updateReportDetails = (report, action) => {
        query = toast.loading("Обновление", {
            containerId: "report",
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        report.action = action;

        postData(
            "PATCH",
            `${
                import.meta.env.VITE_API_URL
            }management-reports/project-manager/${report.real_id}`,
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
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
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
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
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
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
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

    const handleListSort = () => {
        setSortedManagementList(sortDateList(managementList, sortBy));
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
        handleListSort();
    }, [sortBy]);

    useEffect(() => {
        getAvailableMonths();
    }, []);

    // Заполняем селектор Отчетов
    const reportOptions = useMemo(() => {
        const allNames = reportsList
            .map((item) => item.report_period_code)
            .filter((report_period_code) => report_period_code !== null);

        return Array.from(new Set(allNames));
    }, [reportsList]);

    const COLUMNS = [
        [
            {
                label: "Отчёт",
                key: "report_period_code",
                filter: "selectedReports",
                options: reportOptions,
            },
            {
                label: "Проект",
                key: "project",
                filter: "selectedProjects",
                // options: nameOptions,
            },
            {
                label: "Отрасль",
                key: "industry",
                filter: "selectedIndusties",
                // options: nameOptions,
            },
            {
                label: "Заказкчик",
                key: "contragent",
                filter: "selectedContragents",
                // options: nameOptions,
            },
            {
                label: "Банк",
                key: "creditors",
                filter: "selectedCreditors",
                // options: nameOptions,
            },
            { label: "Бюджет", key: "project_budget" },
            { label: "Срок", key: "implementation_period" },
            {
                label: "Руководитель",
                key: "project_managers",
                filter: "selectedManagers",
                // options: nameOptions,
            },
            {
                label: "Период вып.",
                key: "days",
                filter: "selectedPeriod",
                // options: nameOptions,
            },
            {
                label: "Статус",
                key: "report_status",
                filter: "selectedStatus",
                // options: nameOptions,
            },
        ],
        [
            { label: "Отчёт", key: "name" },
            { label: "Отчётный месяц", key: "report_month" },
            { label: "Оценка", key: "score" },
            { label: "Отвественный", key: "physical_person" },
            { label: "Статус", key: "status" },
            {
                label: "Дата утверждения",
                key: "approval_date",
                is_sortable: true,
            },
            { label: "Дата изменения", key: "updated_at" },
        ],
    ];

    const [projectReportsFilters, setProjectReportsFilters] = useState({
        selectedReports: [],
        selectedProjects: [],
        selectedIndusties: [],
        selectedContragents: [],
        selectedCreditors: [],
        selectedManagers: [],
        selectedPeriod: [],
        selectedStatus: [],
    });

    const filteredProjectReports = useMemo(() => {
        return reportsList.filter((project) => {
            return (
                projectReportsFilters.selectedReports.length === 0 ||
                projectReportsFilters.selectedReports.includes(
                    project.report_period_code
                )
                //     &&
                // (projectReportsFilters.selectedBanks.length === 0 ||
                //     project.creditors?.some((c) =>
                //         projectReportsFilters.selectedBanks.includes(c.name)
                //     )) &&
                // (projectReportsFilters.selectedManagers.length === 0 ||
                //     projectReportsFilters.selectedManagers.includes(
                //         project.manager
                //     )) &&
                // (projectReportsFilters.selectedNames.length === 0 ||
                //     projectReportsFilters.selectedNames.includes(
                //         project.name
                //     )) &&
                // (projectReportsFilters.selectedContagents.length === 0 ||
                //     projectReportsFilters.selectedContagents.includes(
                //         project.contragent
                //     ))
            );
        });
    }, [reportsList, projectReportsFilters]);

    return (
        <main className="page reports-registry">
            <ToastContainer containerId="report" />

            <div className="container registry__container">
                <section className="registry__header flex items-center">
                    <h1 className="title">Реестр отчётов</h1>

                    <ul className="card__tabs">
                        <li className="card__tabs-item radio-field_tab">
                            <input
                                type="radio"
                                name="active_tab"
                                id="project_reports"
                                defaultChecked
                                onChange={() => setActiveTab("projects")}
                            />
                            <label htmlFor="project_reports">
                                Отчёты проектов
                                <span>{reportsList.length}</span>
                            </label>
                        </li>

                        <li className="card__tabs-item radio-field_tab">
                            <input
                                type="radio"
                                name="active_tab"
                                id="management_reports"
                                onChange={() => setActiveTab("management")}
                            />
                            <label htmlFor="management_reports">
                                Отчёты сотрудников
                                <span>{filteredReports.length}</span>
                            </label>
                        </li>
                    </ul>

                    {/* <div className="flex items-center justify-between gap-6">
                        {activeTab === "projects" && (
                            <>
                                <div className="flex items-center gap-5">
                                    {FILTER_LABELS.map(({ key, label }) => {
                                        const filterValues =
                                            filterOptionsList[key];
                                        if (!filterValues) return null;

                                        return (
                                            <select
                                                key={key}
                                                className="p-1 border border-gray-300 min-w-[110px] max-w-[180px]"
                                                value={
                                                    selectedProjectsFilters[
                                                        key
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
                                                        key,
                                                        selectedValue,
                                                        "projects"
                                                    );
                                                }}
                                            >
                                                <option value="">
                                                    {label}
                                                </option>
                                                {filterValues.map((item) => (
                                                    <option
                                                        key={item.id}
                                                        value={item.id}
                                                    >
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        );
                                    })}
                                </div>
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
                                </div>
                            </>
                        )}
                    </div> */}
                </section>

                <section className="registry__table-section w-full">
                    {openFilter !== "" && (
                        <OverlayTransparent
                            state={true}
                            toggleMenu={() => setOpenFilter("")}
                        />
                    )}

                    <table className="registry-table table-auto w-full border-collapse">
                        <thead className="registry-table__thead">
                            <tr>
                                {COLUMNS[activeTab === "projects" ? 0 : 1].map(
                                    ({
                                        label,
                                        key,
                                        filter,
                                        options,
                                        is_sortable,
                                    }) => {
                                        return (
                                            <th
                                                className="min-w-[125px]"
                                                rowSpan="2"
                                                key={key}
                                            >
                                                <div className="registry-table__thead-item">
                                                    {filter ? (
                                                        <>
                                                            <div className="registry-table__thead-label">
                                                                {label}
                                                            </div>

                                                            {projectReportsFilters[
                                                                filter
                                                            ].length > 0 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setProjectReportsFilters(
                                                                            (
                                                                                prev
                                                                            ) => ({
                                                                                ...prev,
                                                                                [filter]:
                                                                                    [],
                                                                            })
                                                                        );
                                                                    }}
                                                                >
                                                                    <svg
                                                                        width="16"
                                                                        height="16"
                                                                        viewBox="0 0 16 16"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path
                                                                            d="M9.06 8l3.713 3.712-1.06 1.06L8 9.06l-3.712 3.713-1.061-1.06L6.939 8 3.227 4.287l1.06-1.06L8 6.939l3.712-3.712 1.061 1.06L9.061 8z"
                                                                            fill="#000"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            )}

                                                            {options &&
                                                                options.length >
                                                                    0 &&
                                                                options.some(
                                                                    (val) =>
                                                                        val !==
                                                                        undefined
                                                                ) && (
                                                                    <FilterButton
                                                                        label={
                                                                            label
                                                                        }
                                                                        key={
                                                                            key
                                                                        }
                                                                        filterKey={
                                                                            key
                                                                        }
                                                                        openFilter={
                                                                            openFilter
                                                                        }
                                                                        setOpenFilter={
                                                                            setOpenFilter
                                                                        }
                                                                    />
                                                                )}

                                                            {openFilter ===
                                                                key && (
                                                                <MultiSelectWithSearch
                                                                    options={
                                                                        options &&
                                                                        options.length >
                                                                            0
                                                                            ? options.map(
                                                                                  (
                                                                                      name
                                                                                  ) => ({
                                                                                      value: name,
                                                                                      label: name,
                                                                                  })
                                                                              )
                                                                            : []
                                                                    }
                                                                    selectedValues={
                                                                        projectReportsFilters[
                                                                            filter
                                                                        ]
                                                                    }
                                                                    onChange={(
                                                                        updated
                                                                    ) =>
                                                                        setProjectReportsFilters(
                                                                            (
                                                                                prev
                                                                            ) => ({
                                                                                ...prev,
                                                                                ...updated,
                                                                            })
                                                                        )
                                                                    }
                                                                    fieldName={
                                                                        filter
                                                                    }
                                                                    close={
                                                                        setOpenFilter
                                                                    }
                                                                />
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="registry-table__thead-label">
                                                            {label}
                                                        </div>
                                                    )}

                                                    {is_sortable && (
                                                        <TheadSortButton
                                                            label={label}
                                                            value={key}
                                                            sortBy={sortBy}
                                                            setSortBy={
                                                                setSortBy
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </th>
                                        );
                                    }
                                )}
                            </tr>
                        </thead>

                        <tbody className="registry-table__tbody">
                            {isLoading ? (
                                <tr>
                                    <td className="text-base px-4 py-2">
                                        Загрузка...
                                    </td>
                                </tr>
                            ) : activeTab === "projects" ? (
                                filteredProjectReports.length > 0 &&
                                filteredProjectReports.map((item) => (
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
                                        selectedRateReport={reportData}
                                        selectedReport={managementReportData}
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

                    {/* {activeTab === "projects" && reportWindowsState && (
                        <ReportWindow
                            reportWindowsState={setReportWindowsState}
                            contracts={contracts}
                            reportId={reportId}
                            setReportId={setReportId}
                            reportName={reportName}
                            mode={"read"}
                        />
                    )}

                    {activeTab === "management" && (
                        <>
                            {rateEditorState && (
                                <ReportRateEditor
                                    reportData={reportData}
                                    closeEditor={closeRateReportEditor}
                                    updateReportDetails={updateReportDetails}
                                    mode={"edit"}
                                />
                            )}

                            {managementEditorState && (
                                <ManagementReportEditor
                                    managementReportData={managementReportData}
                                    setManagementReportData={
                                        setManagementReportData
                                    }
                                    updateReport={updateReport}
                                    closeManagementReportEditor={
                                        closeManagementReportEditor
                                    }
                                    mode={"edit"}
                                />
                            )}
                        </>
                    )} */}
                </section>
            </div>
        </main>
    );
};

export default Reports;
