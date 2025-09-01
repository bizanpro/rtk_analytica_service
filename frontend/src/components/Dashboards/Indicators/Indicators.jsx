import { useState, useEffect, useRef } from "react";
import getData from "../../../utils/getData";
import buildQueryParams from "../../../utils/buildQueryParams";

import ChartDataLabels from "chartjs-plugin-datalabels";

import FinancialMetrics from "./FinancialMetrics";
import FunnelMetrics from "./FunnelMetrics";
import FunnelProjectItem from "./FunnelProjectItem";
import GrossMetrics from "./GrossMetrics";
import CompletedReportItem from "./CompletedReportItem";
import EmployeeItem from "./EmployeeItem";
import EmployeeMetrics from "./EmployeeMetrics";
import ManagerReportsEditor from "./ManagerReportsEditor";
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
    const [financialList, setFinancialList] = useState({});
    const [financialProfitList, setFinancialProfitList] = useState({});
    const [funnelMetrics, setFunnelMetrics] = useState({});
    const [employeeMetrics, setEmployeeMetrics] = useState({});

    const [contragents, setContragents] = useState([]);
    const [reportTypes, setReportTypes] = useState([]);
    const [completedReports, setCompletedReports] = useState([]);
    const [chartView, setChartView] = useState("headcount");

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

    const financialListData = {
        labels: financialList.items?.map((item) => item.name),
        datasets: [
            {
                label: "",
                data:
                    financialListFilters.metric[0] === "revenue"
                        ? financialList.items?.map((item) =>
                              parseFloat(item.revenue.value.replace(",", "."))
                          )
                        : financialList.items?.map((item) =>
                              parseFloat(item.receipts.value.replace(",", "."))
                          ),
                backgroundColor: "black",
                borderRadius: 2,
                categoryPercentage: 0.1,
            },
        ],
    };

    const financialProfitListData = {
        labels: financialProfitList.items?.map((item) => item.name),
        datasets: [
            {
                label: "",
                data:
                    financialProfitListFilters.metric[0] === "gross_profit"
                        ? financialProfitList.items?.map((item) =>
                              parseFloat(
                                  item.gross_profit.value.replace(",", ".")
                              )
                          )
                        : financialProfitList.items?.map((item) =>
                              parseFloat(
                                  item.gross_margin.value.replace(",", ".")
                              )
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
                // position: "top",
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
        animation: false,
        indexAxis: "y",
        plugins: {
            legend: {
                display: false,
                // position: "top",
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
            x: { beginAtZero: true, position: "top" },
            y: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    callback: function (value) {
                        let label = this.getLabelForValue(value);
                        return label.length > 15
                            ? label.slice(0, 15) + "…"
                            : label;
                    },
                },
                barPercentage: 0.7,
                categoryPercentage: 0.8,
            },
        },
    };

    // Обработка фильтров
    const handleFilterChange = (filterKey, value) => {
        const filteredValues = value.filter((v) => v !== "");

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

    const getCompletedReports = () => {
        const queryString = buildQueryParams(selectedFilters);

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
                }
            }
        );
    };

    // Получение типов отчета
    const getReportTypes = () => {
        getData(`${import.meta.env.VITE_API_URL}report-types`).then(
            (response) => {
                if (response?.status == 200) {
                    setReportTypes(response.data.data);
                }
            }
        );
    };

    useEffect(() => {
        getFilterOptions();
        getContragents();
        getReportTypes();
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
        }
    }, [funnelMetricsFilters]);

    return (
        <div className="flex flex-col justify-between gap-6 mb-8">
            {isLoading && <Loader transparent={true} />}

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
                    </div>

                    {/* <div className="flex flex-col">
                        <select
                            className="border-2 h-[32px] p-1 border-gray-300 min-w-full max-w-[140px] cursor-pointer"
                            onChange={(evt) =>
                                setFunnelMetricsFilters((prev) => ({
                                    ...prev,
                                    report_type_id: [evt.target.value],
                                }))
                            }
                        >
                            <option value="">Тип отчёта</option>
                            {reportTypes.length > 0 &&
                                reportTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                        </select>
                    </div> */}

                    <button
                        type="button"
                        className="border rounded-lg py-1 px-5 h-[32px]"
                        // onClick={() => setSelectedFilters([])}
                    >
                        Очистить
                    </button>
                </div>
            </section>

            <div className="grid grid-cols-3 gap-7 justify-between items-start">
                <section className="flex flex-col gap-4">
                    {/* ФИНАНСОВЫЕ ПОКАЗАТЕЛИ */}
                    <div className="flex flex-col gap-8 border border-gray-300 p-2">
                        <div className="p-4">
                            <FinancialMetrics
                                financialMetrics={financialMetrics}
                            />

                            <Bar
                                data={financialMetricsData}
                                options={verticalOptions}
                            />
                        </div>

                        <div className="p-4">
                            <div className="grid grid-cols-2 items-center justify-between gap-5 mb-5">
                                <select
                                    className="border-2 h-[30px] p-1 border-gray-300 min-w-[140px] cursor-pointer"
                                    onChange={(evt) =>
                                        setFinancialListFilters((prev) => ({
                                            ...prev,
                                            type: [evt.target.value],
                                        }))
                                    }
                                >
                                    <option value="project">Проект</option>
                                    <option value="customer">Заказчик</option>
                                </select>

                                <select
                                    className="border-2 h-[30px] p-1 border-gray-300 min-w-[140px] cursor-pointer"
                                    onChange={(evt) =>
                                        setFinancialListFilters((prev) => ({
                                            ...prev,
                                            metric: [evt.target.value],
                                        }))
                                    }
                                >
                                    <option value="revenue">
                                        Выручка, млн руб.
                                    </option>
                                    <option value="receipts">
                                        Поступления, млн руб.
                                    </option>
                                </select>
                            </div>

                            <div className="h-[214px] overflow-x-hidden overflow-y-auto">
                                <Bar
                                    data={financialListData}
                                    options={horizontalOptions}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 border border-gray-300 p-5">
                        <EmployeeMetrics {...employeeMetrics} />

                        <div className="grid grid-cols-2 items-center justify-between gap-5 mb-5">
                            <div className="flex items-center gap-3">
                                <select
                                    className="border-2 h-[30px] p-1 border-gray-300 min-w-[140px] w-full"
                                    value={chartView}
                                    onChange={(evt) => {
                                        setChartView(evt.target.value);

                                        setEmployeeFilters((prev) => ({
                                            ...prev,
                                            view_type: [evt.target.value],
                                        }));
                                    }}
                                >
                                    <option value="headcount">Структура</option>
                                    <option value="turnover">
                                        Пришли / ушли
                                    </option>
                                </select>
                                <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                    ?
                                </span>
                            </div>

                            {chartView == "headcount" && (
                                <div className="flex items-center gap-3">
                                    <select
                                        className="border-2 h-[30px] p-1 border-gray-300 min-w-[140px] w-full"
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
                            )}
                        </div>

                        {chartView == "headcount" ? (
                            <Bar
                                data={EmployeeMetricsData}
                                options={horizontalOptions}
                            />
                        ) : (
                            <div className="flex flex-col gap-7 max-h-[340px] overflow-x-hidden overflow-y-auto">
                                <div>
                                    <div className="mb-3 font-medium">
                                        Новые сотрудники (
                                        {employeeMetrics.hired_employees
                                            ?.length || 0}
                                        )
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
                                        Ушедшие сотрудники (
                                        {employeeMetrics.dismissed_employees
                                            ?.length || 0}
                                        )
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
                        )}
                    </div>
                </section>

                <section className="flex flex-col gap-4">
                    {/* ФИНАНСОВЫЕ ПОКАЗАТЕЛИ */}
                    <div className="flex flex-col gap-8 border border-gray-300 p-2">
                        <div className="p-4">
                            <GrossMetrics financialMetrics={financialMetrics} />

                            <Bar
                                data={grossMetricsData}
                                options={verticalOptions2}
                            />
                        </div>

                        <div className="p-4">
                            <div className="grid grid-cols-2 items-center justify-between gap-5 mb-5">
                                <select
                                    className="border-2 h-[30px] p-1 border-gray-300 min-w-[140px] cursor-pointer"
                                    onChange={(evt) =>
                                        setFinancialProfitListFilters(
                                            (prev) => ({
                                                ...prev,
                                                type: [evt.target.value],
                                            })
                                        )
                                    }
                                >
                                    <option value="project">Проект</option>
                                    <option value="customer">Заказчик</option>
                                </select>

                                <select
                                    className="border-2 h-[30px] p-1 border-gray-300 min-w-[140px] cursor-pointer"
                                    onChange={(evt) =>
                                        setFinancialProfitListFilters(
                                            (prev) => ({
                                                ...prev,
                                                metric: [evt.target.value],
                                            })
                                        )
                                    }
                                >
                                    <option value="gross_profit">
                                        Валовая прибыль, млн руб.
                                    </option>
                                    <option value="gross_margin">
                                        Валовая рентабельность
                                    </option>
                                </select>
                            </div>

                            <div className="h-[214px] overflow-x-hidden overflow-y-auto">
                                <Bar
                                    data={financialProfitListData}
                                    options={horizontalOptions}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 border border-gray-300 py-3 px-2">
                        <div className="flex items-center gap-2 font-medium pl-3">
                            Завершённые отчёты (
                            {completedReports.items?.length || 0})
                            <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                ?
                            </span>
                        </div>

                        <ul className="max-h-[300px] overflow-x-hidden overflow-y-auto p-4 flex flex-col gap-3">
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

                <section className="flex flex-col gap-4">
                    <div className="flex flex-col border border-gray-300 p-2">
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

                    <ManagerReportsEditor />
                </section>
            </div>
        </div>
    );
};

export default Indicators;
