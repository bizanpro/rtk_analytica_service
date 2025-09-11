import { useState, useEffect, useRef } from "react";

import getData from "../../../utils/getData";
import buildQueryParams from "../../../utils/buildQueryParams";
import ChartDataLabels from "chartjs-plugin-datalabels";

import FinancialMetrics from "./FinancialMetrics";
import Sales from "./Sales";
import GrossMetrics from "./GrossMetrics";
import CompletedReportsList from "./CompletedReportsList";
import EmployeesStats from "./EmployeesStats";
import FinancialIndicators from "./FinancialIndicators";
import ProjectManagerReports from "./ProjectManagerReports";
import ManagerReports from "./ManagerReports";
import Loader from "../../Loader";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    LineController,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    LineController,
    PointElement,
    Tooltip,
    Legend,
    ChartDataLabels
);

import { Bar } from "react-chartjs-2";

const Indicators = () => {
    const [isLoading, setIsLoading] = useState(true);

    const [filtertOptions, setFilterOptions] = useState([]);

    const [selectedReportMonth, setSelectedReportMonth] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({});

    const [funnelMetricsFilters, setFunnelMetricsFilters] = useState({});
    const [financialMetrics, setFinancialMetrics] = useState({});

    const [financialList, setFinancialList] = useState({}); // Сортированные ключевые финансовые показатели - Поступления и выручка
    const [financialProfitList, setFinancialProfitList] = useState({}); // Сортированные ключевые финансовые показатели - Выловая прибыль и рентабельность

    const [funnelMetrics, setFunnelMetrics] = useState({});
    const [employeeMetrics, setEmployeeMetrics] = useState({});

    const [contragents, setContragents] = useState([]);
    const [projects, setProjects] = useState([]);

    const [filteredContragents, setFilteredContragents] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);

    const [completedReports, setCompletedReports] = useState([]);
    const [projectManagerReports, setProjectManagerReports] = useState([]);

    const [financialListFilters, setFinancialListFilters] = useState({
        type: ["project"],
        metric: ["revenue"],
    });

    const [financialProfitListFilters, setFinancialProfitListFilters] =
        useState({
            type: ["project"],
            metric: ["gross_profit"],
        });

    const [employeeFilters, setEmployeeFilters] = useState({
        view_type: ["headcount"],
        metric_type: ["headcount"],
    });

    const hasInitialized = useRef(false);
    const hasCalledListOnSelected = useRef(false);
    const hasCalledProfitListOnSelected = useRef(false);
    const hasCalledFunnelMetricsOnSelected = useRef(false);
    const hasEmployeeMetricsOnSelected = useRef(false);

    const isFinancialListFiltersReady =
        Object.keys(financialListFilters).length > 3;

    const isFinancialProfitListFiltersReady =
        Object.keys(financialProfitListFilters).length > 3;

    const isFunnelMetricsFiltersReady =
        Object.keys(funnelMetricsFilters).length > 1;

    const isEmployeeMetricsFiltersReady =
        Object.keys(employeeFilters).length > 3;

    const financialMetricsData = {
        labels: financialMetrics.monthly_chart?.map((item) => item.month),
        datasets: [
            {
                label: "",
                data: financialMetrics.monthly_chart?.map(
                    (item) => item.revenue
                ),
                backgroundColor: "black",
                categoryPercentage: 0.5,
                stack: "stack1",
                borderRadius: 2,
            },
            {
                label: "",
                data: financialMetrics.monthly_chart?.map(
                    (item) => item.receipts
                ),
                backgroundColor: "rgba(204, 204, 204, 0.5)",
                categoryPercentage: 0.5,
                stack: "stack2",
                borderRadius: 2,
            },
        ],
    };

    const grossMetricsData = {
        labels: financialMetrics.monthly_chart?.map((item) => item.month),
        datasets: [
            {
                type: "line",
                label: "",
                data: financialMetrics.monthly_chart?.map(
                    (item) => item.gross_margin
                ),
                backgroundColor: "rgba(204, 204, 204, 1)",
                borderColor: "rgba(204, 204, 204, 1)",
                borderWidth: 2,
                fill: false,
                pointBackgroundColor: "#ccc",
                pointRadius: 4,
                tension: 0.3,
            },
            {
                type: "bar",
                label: "",
                data: financialMetrics.monthly_chart?.map(
                    (item) => item.gross_profit
                ),
                backgroundColor: "black",
                categoryPercentage: 0.5,
                stack: "stack1",
                borderRadius: 2,
            },
        ],
    };

    const verticalOptions = {
        responsive: true,
        animation: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
                text: "",
            },
            datalabels: false,
        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };

    const verticalOptions2 = {
        responsive: true,
        animation: false,
        indexAxis: "x",
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            datalabels: false,
        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: false,
            },
        },
    };

    // Обработка фильтров
    const handleFilterChange = (filterKey, value) => {
        const filteredValues = value.filter((v) => v !== "");

        setSelectedReportMonth({
            [filterKey]: filteredValues.length > 0 ? filteredValues : [],
        });

        setSelectedFilters((prev) => ({
            ...prev,
            [filterKey]: filteredValues.length > 0 ? filteredValues : [],
        }));

        setFinancialListFilters((prev) => ({
            ...prev,
            [filterKey]: filteredValues.length > 0 ? filteredValues : [],
        }));

        setFinancialProfitListFilters((prev) => ({
            ...prev,
            [filterKey]: filteredValues.length > 0 ? filteredValues : [],
        }));

        setFunnelMetricsFilters((prev) => ({
            ...prev,
            [filterKey]: filteredValues.length > 0 ? filteredValues : [],
        }));

        setEmployeeFilters((prev) => ({
            ...prev,
            [filterKey]: filteredValues.length > 0 ? filteredValues : [],
        }));
    };

    const getFilterOptions = () => {
        getData(`${import.meta.env.VITE_API_URL}company/filter-options`).then(
            (response) => {
                if (response?.status == 200) {
                    setFilterOptions(response.data);

                    const periodValue = response.data.periods[0]?.value;
                    const reportMonthValue = response.data.months[0]?.value;

                    setSelectedReportMonth({
                        report_month: [reportMonthValue],
                    });

                    setSelectedFilters({
                        period: [periodValue],
                        report_month: [reportMonthValue],
                    });

                    setFinancialListFilters((prev) => ({
                        ...prev,
                        period: [periodValue],
                        report_month: [reportMonthValue],
                    }));

                    setFinancialProfitListFilters((prev) => ({
                        ...prev,
                        period: [periodValue],
                        report_month: [reportMonthValue],
                    }));

                    setFunnelMetricsFilters((prev) => ({
                        ...prev,
                        period: [periodValue],
                        report_month: [reportMonthValue],
                    }));

                    setEmployeeFilters((prev) => ({
                        ...prev,
                        period: [periodValue],
                        report_month: [reportMonthValue],
                    }));
                }
            }
        );
    };

    const getFinancialMetrics = () => {
        setIsLoading(true);
        const queryString = buildQueryParams(selectedFilters);

        getData(
            `${
                import.meta.env.VITE_API_URL
            }company/financial-metrics?${queryString}`
        ).then((response) => {
            if (response?.status == 200) {
                setFinancialMetrics(response.data);
                setIsLoading(false);
            }
        });
    };

    // Получение сотрудников
    const getEmployeeMetrics = () => {
        const queryString = buildQueryParams(employeeFilters);

        getData(
            `${
                import.meta.env.VITE_API_URL
            }company-metrics/employee-metrics?${queryString}`
        ).then((response) => {
            if (response?.status == 200) {
                setEmployeeMetrics(response.data);
            }
        });
    };

    // Получение завершенных отчетов
    const getCompletedReports = () => {
        const queryString = buildQueryParams(funnelMetricsFilters);

        getData(
            `${import.meta.env.VITE_API_URL}completed-reports?${queryString}`
        ).then((response) => {
            if (response?.status == 200) {
                setCompletedReports(response.data);
            }
        });
    };

    // Получение отчетов руководителя проектов
    const getProjectManagerReports = () => {
        const queryString = buildQueryParams(funnelMetricsFilters);

        getData(
            `${
                import.meta.env.VITE_API_URL
            }company/project-manager-reports-dashboard?${queryString}`
        ).then((response) => {
            if (response?.status == 200) {
                setProjectManagerReports(response.data);
            }
        });
    };

    const getFinancialList = () => {
        const queryString = buildQueryParams(financialListFilters);

        getData(
            `${
                import.meta.env.VITE_API_URL
            }company/financial-list?${queryString}`
        ).then((response) => {
            if (response?.status == 200) {
                setFinancialList(response.data);
            }
        });
    };

    const getFinancialProfitList = () => {
        const queryString = buildQueryParams(financialProfitListFilters);

        getData(
            `${
                import.meta.env.VITE_API_URL
            }company/financial-profit-list?${queryString}`
        ).then((response) => {
            if (response?.status == 200) {
                setFinancialProfitList(response.data);
            }
        });
    };

    const getFunnelMetrics = () => {
        const queryString = buildQueryParams(funnelMetricsFilters);

        getData(
            `${
                import.meta.env.VITE_API_URL
            }company/funnel-metrics?${queryString}`
        ).then((response) => {
            if (response?.status == 200) {
                setFunnelMetrics(response.data);
            }
        });
    };

    // Получение заказчиков
    const getContragents = () => {
        getData(`${import.meta.env.VITE_API_URL}contragents?all=true`).then(
            (response) => {
                if (response?.status == 200) {
                    setContragents(response.data);
                    setFilteredContragents(response.data);
                }
            }
        );
    };

    // Получение проектов
    const getProjects = () => {
        getData(`${import.meta.env.VITE_API_URL}projects`).then((response) => {
            if (response?.status == 200) {
                setProjects(response.data);
                setFilteredProjects(response.data);
            }
        });
    };

    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            return;
        }

        if (isFinancialListFiltersReady) {
            getFinancialList();
            hasCalledListOnSelected.current = true;
        }

        if (isFinancialProfitListFiltersReady) {
            getFinancialProfitList();
            hasCalledProfitListOnSelected.current = true;
        }

        if (isFunnelMetricsFiltersReady) {
            getFunnelMetrics();
            hasCalledFunnelMetricsOnSelected.current = true;
        }

        if (isEmployeeMetricsFiltersReady) {
            getEmployeeMetrics();
            hasEmployeeMetricsOnSelected.current = true;
        }

        if (isFinancialListFiltersReady && isFinancialProfitListFiltersReady) {
            getFinancialMetrics();
            getCompletedReports();
            getProjectManagerReports();
        }
    }, [selectedFilters]);

    useEffect(() => {
        if (!hasInitialized.current) return;

        if (isFinancialListFiltersReady) {
            if (hasCalledListOnSelected.current) {
                hasCalledListOnSelected.current = false;
                return;
            }
            getFinancialList();
        }
    }, [
        financialListFilters.report_month,
        financialListFilters.period,
        financialListFilters.type,
    ]);

    useEffect(() => {
        if (!hasInitialized.current) return;

        if (isFinancialProfitListFiltersReady) {
            if (hasCalledProfitListOnSelected.current) {
                hasCalledProfitListOnSelected.current = false;
                return;
            }
            getFinancialProfitList();
        }
    }, [
        financialProfitListFilters.report_month,
        financialProfitListFilters.period,
        financialProfitListFilters.type,
    ]);

    useEffect(() => {
        if (!hasInitialized.current) return;

        if (isEmployeeMetricsFiltersReady) {
            if (hasEmployeeMetricsOnSelected.current) {
                hasEmployeeMetricsOnSelected.current = false;
                return;
            }
            getEmployeeMetrics();
        }
    }, [employeeFilters]);

    useEffect(() => {
        if (!hasInitialized.current) return;

        if (isFunnelMetricsFiltersReady) {
            if (hasCalledFunnelMetricsOnSelected.current) {
                hasCalledFunnelMetricsOnSelected.current = false;
                return;
            }
            getFunnelMetrics();
            getCompletedReports();
            getProjectManagerReports();
        }
    }, [funnelMetricsFilters]);

    useEffect(() => {
        getFilterOptions();
        getContragents();
        getProjects();
    }, []);

    return (
        <div className="flex flex-col justify-between gap-6 mb-8">
            {isLoading && <Loader transparent={true} />}

            {/* ФИЛЬТРЫ */}
            <section className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-8">
                    <div className="flex flex-col">
                        <span className="block mb-2 text-gray-400">
                            Отчётный месяц
                        </span>
                        <select
                            className="border-2 h-[32px] p-1 border-gray-300 min-w-full max-w-[140px] cursor-pointer"
                            onChange={(e) => {
                                const selectedValue = Array.from(
                                    e.target.selectedOptions
                                ).map((option) => option.value);

                                handleFilterChange(
                                    "report_month",
                                    selectedValue
                                );
                            }}
                        >
                            {filtertOptions?.months?.length > 0 &&
                                filtertOptions?.months?.map((month) => (
                                    <option
                                        key={month.value}
                                        value={month.value}
                                    >
                                        {month.label}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <span className="block mb-2 text-gray-400">
                            Отчётный период
                        </span>
                        <select
                            className="border-2 h-[32px] p-1 border-gray-300 min-w-full max-w-[140px] cursor-pointer"
                            onChange={(e) => {
                                const selectedValue = Array.from(
                                    e.target.selectedOptions
                                ).map((option) => option.value);
                                handleFilterChange("period", selectedValue);
                            }}
                        >
                            {filtertOptions?.periods?.length > 0 &&
                                filtertOptions?.periods?.map((period) => (
                                    <option
                                        key={period.value}
                                        value={period.value}
                                    >
                                        {period.label}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-end gap-8">
                    <div className="flex flex-col">
                        <span className="block mb-2 text-gray-400">
                            Фильтры
                        </span>

                        <div className="grid grid-cols-2 gap-5">
                            <select
                                className="border-2 h-[32px] p-1 border-gray-300 min-w-full max-w-[140px] cursor-pointer"
                                onChange={(evt) => {
                                    setFunnelMetricsFilters((prev) => ({
                                        ...prev,
                                        contragent_id: [evt.target.value],
                                    }));

                                    if (evt.target.value !== "") {
                                        const selectedContragentProjects =
                                            contragents.find(
                                                (item) =>
                                                    item.id ===
                                                    +evt.target.value
                                            ).project_ids;

                                        if (
                                            selectedContragentProjects.length >
                                            0
                                        ) {
                                            setFilteredProjects(
                                                projects.filter((item) =>
                                                    selectedContragentProjects.includes(
                                                        item.id
                                                    )
                                                )
                                            );
                                        } else {
                                            setFilteredProjects(projects);
                                        }
                                    } else {
                                        setFilteredProjects(projects);
                                    }
                                }}
                                value={funnelMetricsFilters.contragent_id || ""}
                            >
                                <option value="">Заказчик</option>
                                {filteredContragents.length > 0 &&
                                    filteredContragents.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.program_name}
                                        </option>
                                    ))}
                            </select>

                            <select
                                className="border-2 h-[32px] p-1 border-gray-300 min-w-full max-w-[140px] cursor-pointer"
                                onChange={(evt) => {
                                    setFunnelMetricsFilters((prev) => ({
                                        ...prev,
                                        project_id: [evt.target.value],
                                    }));

                                    if (evt.target.value !== "") {
                                        setFilteredContragents(
                                            contragents.filter((item) =>
                                                item.project_ids.includes(
                                                    +evt.target.value
                                                )
                                            )
                                        );
                                    } else {
                                        setFilteredContragents(contragents);
                                    }
                                }}
                                value={funnelMetricsFilters.project_id || ""}
                            >
                                <option value="">Проект</option>
                                {filteredProjects.length > 0 &&
                                    filteredProjects.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="border rounded-lg py-1 px-5 h-[32px]"
                        onClick={() => {
                            setFunnelMetricsFilters((prev) => {
                                const { project_id, contragent_id, ...rest } =
                                    prev;
                                return rest;
                            });
                            setFilteredProjects(projects);
                            setFilteredContragents(contragents);
                        }}
                    >
                        Очистить
                    </button>
                </div>
            </section>

            <section className="flex flex-col gap-5">
                <section className="flex flex-col gap-8 border border-gray-300 p-4">
                    <h2 className="mb-2 text-2xl font-semibold tracking-tight text-balance">
                        Ключевые финансовые показатели
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <FinancialMetrics
                                financialMetrics={financialMetrics}
                            />

                            <Bar
                                data={financialMetricsData}
                                options={verticalOptions}
                            />
                        </div>

                        <div>
                            <GrossMetrics financialMetrics={financialMetrics} />

                            <Bar
                                data={grossMetricsData}
                                options={verticalOptions2}
                            />
                        </div>
                    </div>

                    <FinancialIndicators
                        financialList={financialList}
                        financialProfitList={financialProfitList}
                        setFinancialListFilters={setFinancialListFilters}
                        setFinancialProfitListFilters={
                            setFinancialProfitListFilters
                        }
                    />
                </section>

                <EmployeesStats
                    employeeMetrics={employeeMetrics}
                    setEmployeeFilters={setEmployeeFilters}
                />

                <section className="grid grid-cols-2 gap-4">
                    <ManagerReports
                        selectedReportMonth={selectedReportMonth}
                    />

                    <Sales funnelMetrics={funnelMetrics} />
                </section>

                <section className="grid grid-cols-2 gap-4">
                    <ProjectManagerReports
                        projectManagerReports={projectManagerReports}
                    />

                    <CompletedReportsList completedReports={completedReports} />
                </section>
            </section>
        </div>
    );
};

export default Indicators;
