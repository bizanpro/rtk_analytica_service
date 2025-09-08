import { useState, useEffect, useRef } from "react";

import getData from "../../../utils/getData";
import { sortFinanceValues } from "../../../utils/sortFinanceValues";
import buildQueryParams from "../../../utils/buildQueryParams";

import ChartDataLabels from "chartjs-plugin-datalabels";

import FinancialMetrics from "./FinancialMetrics";
import FunnelMetrics from "./FunnelMetrics";
import FunnelProjectItem from "./FunnelProjectItem";
import GrossMetrics from "./GrossMetrics";
import CompletedReportItem from "./CompletedReportItem";
import EmployeeItem from "./EmployeeItem";
import EmployeeMetrics from "./EmployeeMetrics";
import ManagerReportsWindow from "./ManagerReportsWindow";
import Loader from "../../Loader";
import SortBtn from "../../SortBtn";

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

    const [receiptsSortBy, setReceiptsSortBy] = useState({
        key: "",
        action: "",
    });
    const [revenueSortBy, setRevenueSortBy] = useState({ key: "", action: "" });

    const [grossProfitSortBy, setGrossProfitSortBy] = useState({
        key: "",
        action: "",
    });
    const [grossMarginSortBy, setGrossMarginSortBy] = useState({
        key: "",
        action: "",
    });

    const [selectedReportMonth, setSelectedReportMonth] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({});

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

    const [funnelMetricsFilters, setFunnelMetricsFilters] = useState({});
    const [financialMetrics, setFinancialMetrics] = useState({});

    const [financialList, setFinancialList] = useState({}); // Сортированные ключевые финансовые показатели - Поступления и выручка

    const [sortedReceiptsList, setSortedReceiptsList] = useState({}); // Сортированные ключевые финансовые показатели - Поступления
    const [sortedRevenueList, setSortedRevenueList] = useState({}); // Сортированные ключевые финансовые показатели - Выручка

    const [financialProfitList, setFinancialProfitList] = useState({}); // Сортированные ключевые финансовые показатели - Выловая прибыль и рентабельность

    const [sortedGrossProfitList, setSortedGrossProfitList] = useState({}); // Сортированные ключевые финансовые показатели - Выловая прибыль
    const [sortedGrossMarginList, setSortedGrossMarginListt] = useState({}); // Сортированные ключевые финансовые показатели - Валовая рентабельность

    const [funnelMetrics, setFunnelMetrics] = useState({});
    const [employeeMetrics, setEmployeeMetrics] = useState({});

    const [contragents, setContragents] = useState([]);
    const [completedReports, setCompletedReports] = useState([]);

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

    // Ключевые финансовые показатели - Поступления
    const financialListData1 = {
        labels: sortedReceiptsList.items?.map((item) => item.name),
        datasets: [
            {
                label: "",
                data: sortedReceiptsList.items?.map((item) =>
                    parseFloat(item.receipts.value)
                ),
                backgroundColor: "black",
                borderRadius: 2,
                categoryPercentage: 0.1,
            },
        ],
    };

    // Ключевые финансовые показатели - Выручка
    const financialListData2 = {
        labels: sortedRevenueList.items?.map((item) => item.name),
        datasets: [
            {
                label: "",
                data: sortedRevenueList.items?.map((item) =>
                    parseFloat(item.revenue.value)
                ),

                backgroundColor: "black",
                borderRadius: 2,
                categoryPercentage: 0.1,
            },
        ],
    };

    // Ключевые финансовые показатели - Выловая прибыль
    const financialProfitListData1 = {
        labels: sortedGrossProfitList.items?.map((item) => item.name),
        datasets: [
            {
                label: "",
                data: sortedGrossProfitList.items?.map((item) =>
                    parseFloat(item.gross_profit.value)
                ),
                backgroundColor: "black",
                borderRadius: 2,
                categoryPercentage: 0.5,
            },
        ],
    };

    // Ключевые финансовые показатели - Валовая рентабельность
    const financialProfitListData2 = {
        labels: sortedGrossMarginList.items?.map((item) => item.name),
        datasets: [
            {
                label: "",
                data: sortedGrossMarginList.items?.map((item) =>
                    parseFloat(item.gross_margin.value)
                ),
                backgroundColor: "black",
                borderRadius: 2,
                categoryPercentage: 0.5,
            },
        ],
    };

    const EmployeeMetricsData = {
        labels: employeeMetrics.headcount_by_position?.map((item) => item.name),
        datasets: [
            {
                label: "",
                data: employeeMetrics.headcount_by_position?.map(
                    (item) => item.count
                ),
                backgroundColor: "black",
                borderRadius: 2,
                categoryPercentage: 0.5,
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

    const horizontalOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        indexAxis: "y",
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
                text: "",
            },
            datalabels: {
                anchor: "end",
                align: "end",
                color: "#000",
                formatter: (value) => value,
            },
        },

        scales: {
            // x: { beginAtZero: true, position: "top" },
            y: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    callback: function (value) {
                        let label = this.getLabelForValue(value);
                        return label.length > 20
                            ? label.slice(0, 20) + "…"
                            : label;
                    },
                },
                barPercentage: 0.7,
                categoryPercentage: 0.8,
            },
        },
    };

    const horizontalOptionsNoLabels = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        indexAxis: "y",
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
                text: "",
            },
            datalabels: {
                anchor: "end",
                align: "end",
                color: "#000",
                formatter: (value) => value,
            },
        },

        scales: {
            // x: { beginAtZero: true, position: "top" },
            y: {
                ticks: {
                    display: false,
                },
                barPercentage: 0.7,
                categoryPercentage: 0.8,
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

    const getFinancialList = () => {
        const queryString = buildQueryParams(financialListFilters);

        getData(
            `${
                import.meta.env.VITE_API_URL
            }company/financial-list?${queryString}`
        ).then((response) => {
            if (response?.status == 200) {
                setFinancialList(response.data);
                setSortedReceiptsList(response.data);
                setSortedRevenueList(response.data);
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
                setSortedGrossProfitList(response.data);
                setSortedGrossMarginListt(response.data);
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
                }
            }
        );
    };

    useEffect(() => {
        getFilterOptions();
        getContragents();
    }, []);

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
        }
    }, [funnelMetricsFilters]);

    useEffect(() => {
        if (financialList?.items) {
            setSortedReceiptsList((prev) => ({
                ...prev,
                items: sortFinanceValues(financialList?.items, receiptsSortBy),
            }));
        }
    }, [receiptsSortBy]);

    useEffect(() => {
        if (financialList?.items) {
            setSortedRevenueList((prev) => ({
                ...prev,
                items: sortFinanceValues(
                    financialList?.items,
                    revenueSortBy
                ),
            }));
        }
    }, [revenueSortBy]);

    useEffect(() => {
        if (financialProfitList?.items) {
            setSortedGrossProfitList((prev) => ({
                ...prev,
                items: sortFinanceValues(
                    financialProfitList?.items,
                    grossProfitSortBy
                ),
            }));
        }
    }, [grossProfitSortBy]);

    useEffect(() => {
        if (financialProfitList?.items) {
            setSortedGrossMarginListt((prev) => ({
                ...prev,
                items: sortFinanceValues(
                    financialProfitList?.items,
                    grossMarginSortBy
                ),
            }));
        }
    }, [grossMarginSortBy]);

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
                                onChange={(evt) =>
                                    setFunnelMetricsFilters((prev) => ({
                                        ...prev,
                                        contragent_id: [evt.target.value],
                                    }))
                                }
                            >
                                <option value="">Заказчик</option>
                                {contragents.length > 0 &&
                                    contragents.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.program_name}
                                        </option>
                                    ))}
                            </select>

                            <select
                                className="border-2 h-[32px] p-1 border-gray-300 min-w-full max-w-[140px] cursor-pointer"
                                onChange={(evt) => {}}
                            >
                                <option value="">Проект</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="border rounded-lg py-1 px-5 h-[32px]"
                        // onClick={() => setSelectedFilters([])}
                    >
                        Очистить
                    </button>
                </div>
            </section>

            <section className="flex flex-col gap-5">
                <section className="flex flex-col gap-8 border border-gray-300 p-4">
                    <h2 className="mb-4 text-3xl font-semibold tracking-tight text-balance">
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

                    <div className="flex flex-col gap-3 p-4">
                        <div className="grid grid-cols-[32%_1fr_1fr_1fr]">
                            <div className="flex items-center gap-5">
                                <select
                                    className="border-2 h-[30px] p-1 border-gray-300 w-full max-w-[125px] cursor-pointer"
                                    onChange={(evt) => {
                                        setFinancialListFilters((prev) => ({
                                            ...prev,
                                            type: [evt.target.value],
                                        }));
                                        setFinancialProfitListFilters(
                                            (prev) => ({
                                                ...prev,
                                                type: [evt.target.value],
                                            })
                                        );
                                    }}
                                >
                                    <option value="project">Проект</option>
                                    <option value="customer">Заказчик</option>
                                </select>

                                <SortBtn
                                    label={"Поступления, млн руб."}
                                    value={"receipts.value"}
                                    sortBy={receiptsSortBy}
                                    setSortBy={setReceiptsSortBy}
                                />
                            </div>

                            <SortBtn
                                label={"Выручка, млн руб."}
                                value={"revenue.value"}
                                sortBy={revenueSortBy}
                                setSortBy={setRevenueSortBy}
                                className={"text-left ml-[10px]"}
                            />

                            <SortBtn
                                label={"Валовая прибыль, млн руб."}
                                value={"gross_profit.value"}
                                sortBy={grossProfitSortBy}
                                setSortBy={setGrossProfitSortBy}
                                className={"text-left ml-[10px]"}
                            />

                            <SortBtn
                                label={"Валовая рентабельность"}
                                value={"gross_margin.value"}
                                sortBy={grossMarginSortBy}
                                setSortBy={setGrossMarginSortBy}
                                className={"text-left ml-[10px]"}
                            />
                        </div>

                        <div className="h-[190px] overflow-x-hidden overflow-y-auto grid grid-cols-[32%_1fr_1fr_1fr] gap-2">
                            <div
                                style={{
                                    height: `${Math.max(
                                        300,
                                        (financialProfitListData1.labels
                                            ?.length || 0) * 40
                                    )}px`,
                                }}
                            >
                                <Bar
                                    data={financialListData1}
                                    options={horizontalOptions}
                                />
                            </div>

                            <div
                                className="pt-[8px]"
                                style={{
                                    height: `${Math.max(
                                        300,
                                        (financialProfitListData1.labels
                                            ?.length || 0) * 40
                                    )}px`,
                                }}
                            >
                                <Bar
                                    data={financialListData2}
                                    options={horizontalOptionsNoLabels}
                                />
                            </div>

                            <div
                                className="pt-[8px]"
                                style={{
                                    height: `${Math.max(
                                        300,
                                        (financialProfitListData1.labels
                                            ?.length || 0) * 40
                                    )}px`,
                                }}
                            >
                                <Bar
                                    data={financialProfitListData1}
                                    options={horizontalOptionsNoLabels}
                                />
                            </div>

                            <div
                                className="pt-[8px]"
                                style={{
                                    height: `${Math.max(
                                        300,
                                        (financialProfitListData1.labels
                                            ?.length || 0) * 40
                                    )}px`,
                                }}
                            >
                                <Bar
                                    data={financialProfitListData2}
                                    options={horizontalOptionsNoLabels}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex flex-col gap-8 border border-gray-300 p-4">
                    <h2 className="mb-4 text-3xl font-semibold tracking-tight text-balance">
                        Персонал
                    </h2>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="flex flex-col gap-3">
                            <EmployeeMetrics {...employeeMetrics} />

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <select
                                        className="border-2 h-[30px] p-1 border-gray-300 max-w-[175px] w-full"
                                        onChange={(evt) =>
                                            setEmployeeFilters((prev) => ({
                                                ...prev,
                                                metric_type: [evt.target.value],
                                            }))
                                        }
                                    >
                                        <option value="headcount">
                                            Численность, чел
                                        </option>
                                        <option value="gross_salary">
                                            ФОТ gross, млн руб.
                                        </option>
                                        <option value="average_salary">
                                            Средняя зп, тыс. руб.
                                        </option>
                                    </select>

                                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                        ?
                                    </span>
                                </div>

                                <div className="h-[280px] overflow-x-hidden overflow-y-auto">
                                    <div
                                        style={{
                                            height: `${Math.max(
                                                280,
                                                (EmployeeMetricsData.labels
                                                    ?.length || 0) * 40
                                            )}px`,
                                        }}
                                    >
                                        <Bar
                                            data={EmployeeMetricsData}
                                            options={horizontalOptions}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-5">
                            <div className="grid items-stretch grid-cols-5 gap-3 mb-5">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-medium">
                                        Пришли
                                    </div>
                                    <div className="flex items-center flex-grow gap-2">
                                        <strong className="font-normal text-3xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                                            <span>
                                                {employeeMetrics.hired_employees
                                                    ?.length || 0}
                                            </span>
                                        </strong>
                                        <small className="text-sm">чел.</small>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-medium">
                                        Ушли
                                    </div>
                                    <div className="flex items-center flex-grow gap-2">
                                        <strong className="font-normal text-3xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                                            <span>
                                                {employeeMetrics
                                                    .dismissed_employees
                                                    ?.length || 0}
                                            </span>
                                        </strong>
                                        <small className="text-sm">чел.</small>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-7 max-h-[280px] overflow-x-hidden overflow-y-auto">
                                <div>
                                    <div className="mb-3 font-medium">
                                        Новые сотрудники
                                    </div>

                                    <ul className="flex flex-col gap-2">
                                        {employeeMetrics.hired_employees
                                            ?.length > 0 &&
                                            employeeMetrics.hired_employees.map(
                                                (item) => (
                                                    <EmployeeItem
                                                        key={item.id}
                                                        {...item}
                                                    />
                                                )
                                            )}
                                    </ul>
                                </div>

                                <div>
                                    <div className="mb-3 font-medium">
                                        Ушедшие сотрудники
                                    </div>

                                    <ul className="flex flex-col gap-2">
                                        {employeeMetrics.dismissed_employees
                                            ?.length > 0 &&
                                            employeeMetrics.dismissed_employees.map(
                                                (item) => (
                                                    <EmployeeItem
                                                        key={item.id}
                                                        {...item}
                                                    />
                                                )
                                            )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-2 gap-4">
                    <ManagerReportsWindow
                        selectedReportMonth={selectedReportMonth}
                    />

                    <div className="flex flex-col gap-3 border border-gray-300 p-4">
                        <h2 className="mb-4 text-3xl font-semibold tracking-tight text-balance">
                            Продажи
                        </h2>

                        <FunnelMetrics funnelMetrics={funnelMetrics.metrics} />

                        <ul className="max-h-[300px] overflow-x-hidden overflow-y-auto p-4 flex flex-col gap-3">
                            {funnelMetrics
                                .sales_funnel_projects_with_stage_changes
                                ?.length > 0 &&
                                funnelMetrics.sales_funnel_projects_with_stage_changes.map(
                                    (project) => (
                                        <FunnelProjectItem
                                            key={project.id}
                                            {...project}
                                        />
                                    )
                                )}
                        </ul>
                    </div>
                </section>

                <section className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-3 border border-gray-300 p-4">
                        <h2 className="mb-4 text-3xl font-semibold tracking-tight text-balance">
                            Отчёты руководителей проектов (20)
                        </h2>
                    </div>

                    <div className="flex flex-col gap-3 border border-gray-300 p-4">
                        <h2 className="mb-4 text-3xl font-semibold tracking-tight text-balance">
                            Завершённые отчёты (
                            {completedReports.items?.length || 0})
                        </h2>

                        <ul className="max-h-[280px] overflow-x-hidden overflow-y-auto p-4 flex flex-col gap-3">
                            {completedReports.items?.length > 0 &&
                                completedReports.items.map((report) => (
                                    <CompletedReportItem
                                        key={report.id}
                                        {...report}
                                    />
                                ))}
                        </ul>
                    </div>
                </section>
            </section>
        </div>
    );
};

export default Indicators;
