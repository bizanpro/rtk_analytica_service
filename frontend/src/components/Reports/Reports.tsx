import { useState, useEffect, useMemo } from "react";

import getData from "../../utils/getData";
import postData from "../../utils/postData";
import { sortDateList } from "../../utils/sortDateList";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock.js";
import buildQueryParams from "../../utils/buildQueryParams";

import TheadRow from "./TheadRow";
import ReportItem from "./ReportItem";
import ManagementItem from "./ManagementItem";

import ManagementReportEditor from "./ManagementReportEditor";
import ReportRateEditor from "../ReportRateEditor/ReportRateEditor";
import ReportWindow from "../ReportWindow/ReportWindow";
import Loader from "../Loader";

import OverlayTransparent from "../Overlay/OverlayTransparent";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./Reports.scss";

const Reports = () => {
    let query;

    const REPORTS_URL = `${import.meta.env.VITE_API_URL}reports`;
    const MANAGEMENT_URL = `${import.meta.env.VITE_API_URL}management-reports`;

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

    const [reportExecutionPeriodQuery, setReportExecutionPeriodQuery] =
        useState(""); // Период выполнение
    const [reportMonthQuery, setReportMonthQuery] = useState(""); // Отчетный месяц

    const [reportData, setReportData] = useState({});
    const [reportName, setReportName] = useState("");
    const [contracts, setContracts] = useState([]);
    const [reportId, setReportId] = useState(null);

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

    // Получение списка отчетов
    const getReports = () => {
        setIsLoading(true);

        if (Object.keys(reportExecutionPeriodQuery).length > 0) {
            reportExecutionPeriodQuery.date_from =
                reportExecutionPeriodQuery.days_from;

            reportExecutionPeriodQuery.date_to =
                reportExecutionPeriodQuery.days_to;

            delete reportExecutionPeriodQuery.days_from;
            delete reportExecutionPeriodQuery.days_to;
        }

        getData(
            `${REPORTS_URL}?${buildQueryParams(reportExecutionPeriodQuery)}`
        )
            .then((response) => {
                if (response.status === 200) {
                    setReportsList(response.data);
                }
            })
            .finally(() => setIsLoading(false));
    };

    // Получение списка доступных фильтров
    const getManagementReports = () => {
        setIsLoading(true);

        getData(`${MANAGEMENT_URL}?${buildQueryParams(reportMonthQuery)}`)
            .then((response) => {
                if (response.status === 200) {
                    setManagementList(response.data);
                    setSortedManagementList(response.data);
                }
            })
            .finally(() => setIsLoading(false));
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

                    getManagementReports();
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
                    getManagementReports();
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

    // ОТЧЕТЫ ПРОЕКТОВ //

    // Заполняем селектор Отчетов
    const reportOptions = useMemo(() => {
        const allItems = reportsList
            .map((item) => item.report_period_code)
            .filter((report_period_code) => report_period_code !== null);

        return Array.from(new Set(allItems));
    }, [reportsList]);

    // Заполняем селектор проектов
    const projectOptions = useMemo(() => {
        const allItems = reportsList
            .map((item) => item.project.name)
            .filter((name) => name !== null);

        return Array.from(new Set(allItems));
    }, [reportsList]);

    // Заполняем селектор отраслей
    const industryOptions = useMemo(() => {
        const allItems = reportsList
            .map((item) => item.industry)
            .filter((industry) => industry !== null);

        return Array.from(new Set(allItems));
    }, [reportsList]);

    // Заполняем селектор заказчиков
    const contragentOptions = useMemo(() => {
        const allItems = reportsList
            .map((item) => item.contragent.name)
            .filter((name) => name !== null);

        return Array.from(new Set(allItems));
    }, [reportsList]);

    // Заполняем селектор банков
    const creditorOptions = useMemo(() => {
        const allItems = reportsList.flatMap((item) =>
            item.creditors?.map((bank) => bank.name)
        );

        return Array.from(new Set(allItems));
    }, [reportsList]);

    // Заполняем селектор руководителей
    const managerOptions = useMemo(() => {
        const allItems = reportsList.flatMap((item) =>
            item.project_managers?.map((item) => item.name)
        );

        return Array.from(new Set(allItems));
    }, [reportsList]);

    // Заполняем селектор руководителей
    const statusOptions = useMemo(() => {
        const allItems = reportsList
            .map((item) => item.status)
            .filter((status) => status !== null);

        return Array.from(new Set(allItems));
    }, [reportsList]);

    // ОТЧЕТЫ СОТРУДНИКОВ //

    // Заполняем селектор Отчетов
    const managementReportOptions = useMemo(() => {
        const allItems = managementList
            .map((item) => item.name)
            .filter((name) => name !== null);

        return Array.from(new Set(allItems));
    }, [managementList]);

    // Заполняем селектор Ответственных
    const managemenReponsiblePersontOptions = useMemo(() => {
        const allItems = managementList
            .map((item) => item.physical_person?.name)
            .filter((name) => name !== null);

        return Array.from(new Set(allItems));
    }, [managementList]);

    // Заполняем селектор оценок
    const managemenStatusOptions = useMemo(() => {
        const allItems = managementList
            .map((item) => item.status)
            .filter((status) => status !== null);

        return Array.from(new Set(allItems));
    }, [managementList]);

    const rateOptions = [
        {
            label: (
                <span className="flex items-center gap-[5px]">
                    Проблем нет
                    <span
                        style={{
                            display: "block",
                            background: "var(--color-green-60)",
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                        }}
                    ></span>
                </span>
            ),
            value: 2,
        },
        {
            label: (
                <span className="flex items-center gap-[5px]">
                    Есть сложности
                    <span
                        style={{
                            display: "block",
                            background: "var(--color-orange-60)",
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                        }}
                    ></span>
                </span>
            ),
            value: 1,
        },
        {
            label: (
                <span className="flex items-center gap-[5px]">
                    Есть проблемы
                    <span
                        style={{
                            display: "block",
                            background: "var(--color-red-60)",
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                        }}
                    ></span>
                </span>
            ),
            value: 0,
        },
    ];

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
                options: projectOptions,
            },
            {
                label: "Отрасль",
                key: "industry",
                filter: "selectedIndusties",
                options: industryOptions,
            },
            {
                label: "Заказкчик",
                key: "contragent",
                filter: "selectedContragents",
                options: contragentOptions,
            },
            {
                label: "Банк",
                key: "creditors",
                filter: "selectedCreditors",
                options: creditorOptions,
            },
            { label: "Бюджет", key: "project_budget" },
            { label: "Срок", key: "implementation_period" },
            {
                label: "Руководитель",
                key: "project_managers",
                filter: "selectedManagers",
                options: managerOptions,
            },
            {
                label: "Период вып.",
                key: "days",
                date: "days",
                dateValue: reportExecutionPeriodQuery,
                setFunc: setReportExecutionPeriodQuery,
            },
            {
                label: "Статус",
                key: "report_status",
                filter: "selectedStatus",
                options: statusOptions,
            },
        ],
        [
            {
                label: "Отчёт",
                key: "name",
                filter: "selectedManagementReports",
                options: managementReportOptions,
            },
            {
                label: "Отчётный месяц",
                key: "report_month",
                date: "months",
                dateValue: reportMonthQuery,
                setFunc: setReportMonthQuery,
            },
            {
                label: "Оценка",
                key: "score",
                filter: "selectedRates",
                options: rateOptions,
            },
            {
                label: "Отвественный",
                key: "physical_person",
                filter: "selectedResponsiblePersons",
                options: managemenReponsiblePersontOptions,
            },
            {
                label: "Статус",
                key: "status",
                filter: "selectedManagementStatus",
                options: managemenStatusOptions,
            },
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

    // ОТЧЕТЫ ПРОЕКТОВ //
    const filteredProjectReports = useMemo(() => {
        return reportsList.filter((report) => {
            return (
                (projectReportsFilters.selectedReports.length === 0 ||
                    projectReportsFilters.selectedReports.includes(
                        report.report_period_code
                    )) &&
                (projectReportsFilters.selectedProjects.length === 0 ||
                    projectReportsFilters.selectedProjects.includes(
                        report.project?.name
                    )) &&
                (projectReportsFilters.selectedIndusties.length === 0 ||
                    projectReportsFilters.selectedIndusties.includes(
                        report.industry
                    )) &&
                (projectReportsFilters.selectedContragents.length === 0 ||
                    projectReportsFilters.selectedContragents.includes(
                        report.contragent?.name
                    )) &&
                (projectReportsFilters.selectedCreditors.length === 0 ||
                    report.creditors?.some((c) =>
                        projectReportsFilters.selectedCreditors.includes(c.name)
                    )) &&
                (projectReportsFilters.selectedManagers.length === 0 ||
                    report.project_managers?.some((c) =>
                        projectReportsFilters.selectedManagers.includes(c.name)
                    )) &&
                (projectReportsFilters.selectedStatus.length === 0 ||
                    projectReportsFilters.selectedStatus.includes(
                        report.status
                    ))
            );
        });
    }, [reportsList, projectReportsFilters]);

    const [managementReportsFilters, setManagementReportsFilters] = useState({
        selectedManagementReports: [],
        selectedRates: [],
        selectedResponsiblePersons: [],
        selectedManagementStatus: [],
    });

    // ОТЧЕТЫ СОТРУДНИКОВ //
    const filteredManagementReports = useMemo(() => {
        return managementList.filter((report) => {
            return (
                (managementReportsFilters.selectedManagementReports.length ===
                    0 ||
                    managementReportsFilters.selectedManagementReports.includes(
                        report.name
                    )) &&
                (managementReportsFilters.selectedResponsiblePersons.length ===
                    0 ||
                    managementReportsFilters.selectedResponsiblePersons.includes(
                        report?.physical_person?.name
                    )) &&
                (managementReportsFilters.selectedRates.length === 0 ||
                    managementReportsFilters.selectedRates.includes(
                        report?.general_assessment
                    )) &&
                (managementReportsFilters.selectedManagementStatus.length ===
                    0 ||
                    managementReportsFilters.selectedManagementStatus.includes(
                        report.status
                    ))
            );
        });
    }, [managementList, managementReportsFilters]);

    useEffect(() => {
        getReports();
    }, [reportExecutionPeriodQuery]);

    useEffect(() => {
        getManagementReports();
    }, [reportMonthQuery]);

    useEffect(() => {
        setSortedManagementList(
            sortDateList(filteredManagementReports, sortBy)
        );
    }, [sortBy, filteredManagementReports]);

    useBodyScrollLock(
        reportWindowsState || rateEditorState || managementEditorState
    ); // Блокируем экран при открытии редакторов отчета

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
                                <span>{filteredProjectReports.length}</span>
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
                                <span>{filteredManagementReports.length}</span>
                            </label>
                        </li>
                    </ul>
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
                            <TheadRow
                                columns={COLUMNS}
                                activeTab={activeTab}
                                projectReportsFilters={projectReportsFilters}
                                managementReportsFilters={
                                    managementReportsFilters
                                }
                                setProjectReportsFilters={
                                    setProjectReportsFilters
                                }
                                setManagementReportsFilters={
                                    setManagementReportsFilters
                                }
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                                openFilter={openFilter}
                                setOpenFilter={setOpenFilter}
                            />
                        </thead>

                        <tbody className="registry-table__tbody">
                            {isLoading ? (
                                <tr>
                                    <td>
                                        <Loader />
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
                                sortedManagementList.length > 0 &&
                                sortedManagementList.map((item) => (
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

                    {activeTab === "projects" && (
                        <ReportWindow
                            reportWindowsState={reportWindowsState}
                            setReportWindowsState={setReportWindowsState}
                            contracts={contracts}
                            reportId={reportId}
                            setReportId={setReportId}
                            reportName={reportName}
                            mode={"read"}
                        />
                    )}

                    {activeTab === "management" && (
                        <>
                            <ReportRateEditor
                                rateEditorState={rateEditorState}
                                reportData={reportData}
                                closeEditor={closeRateReportEditor}
                                updateReportDetails={updateReportDetails}
                                mode={"edit"}
                            />

                            <ManagementReportEditor
                                editorState={managementEditorState}
                                managementReportData={managementReportData}
                                setManagementReportData={
                                    setManagementReportData
                                }
                                updateReport={updateReport}
                                closeEditor={closeManagementReportEditor}
                                mode={"edit"}
                            />
                        </>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Reports;
