import { useState, useEffect, useRef } from "react";
import getData from "../../utils/getData";

import ChartDataLabels from "chartjs-plugin-datalabels";

import CountUp from "react-countup";

ChartJS.register(ChartDataLabels);

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Indicators = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isFiltersLoaded, setIsFiltersLoaded] = useState(false);

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
    const [financialMetrics, setFinancialMetrics] = useState({});
    const [financialList, setFinancialList] = useState({});
    const [financialProfitList, setFinancialProfitList] = useState({});

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

    const financialListData = {
        labels: financialList.items?.map((item) => item.name),
        datasets: [
            {
                label: "",
                data:
                    financialListFilters.metric[0] === "revenue"
                        ? financialList.items?.map((item) => item.revenue.value)
                        : financialList.items?.map(
                              (item) => item.receipts.value
                          ),
                backgroundColor: "black",
                borderRadius: 2,
                categoryPercentage: 0.5,
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
                        ? financialProfitList.items?.map(
                              (item) => item.gross_profit.value
                          )
                        : financialProfitList.items?.map(
                              (item) => item.gross_margin.value
                          ),
                backgroundColor: "black",
                borderRadius: 2,
                categoryPercentage: 0.5,
            },
        ],
    };

    const verticalOptions = {
        responsive: true,
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

    const horizontalOptions = {
        responsive: true,
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
            x: { beginAtZero: true },
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
                }
            }
        );
    };

    const getFinancialMetrics = () => {
        const queryParams = new URLSearchParams();

        Object.entries(selectedFilters).forEach(([key, values]) => {
            values.forEach((value) => {
                queryParams.append(`${key}`, value);
            });
        });

        getData(
            `${
                import.meta.env.VITE_API_URL
            }company/financial-metrics?${queryParams.toString()}`
        ).then((response) => {
            if (response?.status == 200) {
                setFinancialMetrics(response.data);
            }
        });
    };

    const getFinancialList = () => {
        const queryParams = new URLSearchParams();

        Object.entries(financialListFilters).forEach(([key, values]) => {
            values.forEach((value) => {
                queryParams.append(`${key}`, value);
            });
        });

        getData(
            `${
                import.meta.env.VITE_API_URL
            }company/financial-list?${queryParams.toString()}`
        ).then((response) => {
            if (response?.status == 200) {
                setFinancialList(response.data);
            }
        });
    };

    const getFinancialProfitList = () => {
        const queryParams = new URLSearchParams();

        Object.entries(financialProfitListFilters).forEach(([key, values]) => {
            values.forEach((value) => {
                queryParams.append(`${key}`, value);
            });
        });

        getData(
            `${
                import.meta.env.VITE_API_URL
            }company/financial-profit-list?${queryParams.toString()}`
        ).then((response) => {
            if (response?.status == 200) {
                setFinancialProfitList(response.data);
            }
        });
    };

    useEffect(() => {
        getFilterOptions();
    }, []);

    const hasInitialized = useRef(false);
    const hasCalledListOnSelected = useRef(false);
    const hasCalledProfitListOnSelected = useRef(false);

    const isFinancialListFiltersReady =
        Object.keys(financialListFilters).length > 3;
    const isFinancialProfitListFiltersReady =
        Object.keys(financialProfitListFilters).length > 3;

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

        if (isFinancialListFiltersReady && isFinancialProfitListFiltersReady) {
            getFinancialMetrics();
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

    return (
        <div className="flex flex-col justify-between gap-6 mb-8">
            <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-8">
                    <div className="flex flex-col">
                        <span className="block mb-2 text-gray-400">
                            Отчётный месяц
                        </span>
                        <select
                            className="border-2 h-[32px] p-1 border-gray-300 min-w-[140px] cursor-pointer"
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
                            className="border-2 h-[32px] p-1 border-gray-300 min-w-[140px] cursor-pointer"
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
                        <select className="border-2 h-[32px] p-1 border-gray-300 min-w-[140px] cursor-pointer">
                            <option value="">Заказчик</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <select className="border-2 h-[32px] p-1 border-gray-300 min-w-[140px] cursor-pointer">
                            <option value="">Тип отчёта</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        className="border rounded-lg py-1 px-5 h-[32px]"
                        onClick={() => setSelectedFilters([])}
                    >
                        Очистить
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-10 justify-between items-start">
                <div className="flex flex-col gap-8 border border-gray-300">
                    <div className="p-5">
                        <div className="grid items-stretch grid-cols-3 gap-3 mb-5">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 font-medium">
                                    Выручка
                                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                        ?
                                    </span>
                                </div>
                                <div
                                    className="flex items-center flex-grow gap-2"
                                    title={
                                        financialMetrics.revenue?.value +
                                        " " +
                                        financialMetrics.revenue?.label
                                    }
                                >
                                    <strong className="font-normal text-3xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                                        <CountUp
                                            end={
                                                financialMetrics.revenue
                                                    ?.value || 0
                                            }
                                            duration={1}
                                            separator=" "
                                        />
                                    </strong>
                                    <small className="text-sm">
                                        {financialMetrics.revenue?.label}
                                    </small>
                                </div>
                                {/* <div className="text-green-400">+15%</div> */}
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 font-medium">
                                    Поступления
                                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                        ?
                                    </span>
                                </div>
                                <div
                                    className="flex items-center flex-grow gap-2"
                                    title={
                                        financialMetrics.receipts?.value +
                                        " " +
                                        financialMetrics.receipts?.label
                                    }
                                >
                                    <strong className="font-normal text-3xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                                        <CountUp
                                            end={
                                                financialMetrics.receipts
                                                    ?.value || 0
                                            }
                                            duration={1}
                                            separator=" "
                                        />
                                    </strong>
                                    <small className="text-sm">
                                        {financialMetrics.receipts?.label}
                                    </small>
                                </div>
                                {/* <div className="text-green-400">+15%</div> */}
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 font-medium">
                                    ДЗ
                                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                        ?
                                    </span>
                                </div>
                                <div
                                    className="flex items-center flex-grow gap-2"
                                    title={
                                        financialMetrics.debts?.value +
                                        " " +
                                        financialMetrics.debts?.label
                                    }
                                >
                                    <strong className="font-normal text-3xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                                        <CountUp
                                            end={
                                                financialMetrics.debts?.value ||
                                                0
                                            }
                                            duration={1}
                                            separator=" "
                                        />
                                    </strong>
                                    <small className="text-sm">
                                        {financialMetrics.debts?.label}
                                    </small>
                                </div>
                                {/* <div className="text-red-400">+15%</div> */}
                            </div>
                        </div>

                        <Bar
                            data={financialMetricsData}
                            options={verticalOptions}
                        />
                    </div>

                    <div className="p-5">
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

                        <Bar
                            data={financialListData}
                            options={horizontalOptions}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-8 border border-gray-300">
                    <div className="p-5">
                        <div className="grid items-stretch grid-cols-3 gap-3 mb-5">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 font-medium">
                                    Валовая прибыль
                                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                        ?
                                    </span>
                                </div>
                                <div
                                    className="flex items-center flex-grow gap-2"
                                    title="350.000 руб."
                                >
                                    <strong className="font-normal text-3xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                                        350.000
                                    </strong>
                                    <small className="text-sm">млн руб.</small>
                                </div>
                                <div className="text-green-400">+15%</div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 font-medium">
                                    Валовая рентабельность
                                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                        ?
                                    </span>
                                </div>
                                <div className="flex items-center flex-grow gap-2">
                                    <strong
                                        className="font-normal text-3xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                                        title="350.000 руб."
                                    >
                                        65,5
                                    </strong>
                                    <small className="text-sm">%</small>
                                </div>
                                <div className="text-green-400">+15%</div>
                            </div>
                        </div>

                        <Bar
                            data={financialMetricsData}
                            options={verticalOptions}
                        />
                    </div>

                    <div className="p-5">
                        <div className="grid grid-cols-2 items-center justify-between gap-5 mb-5">
                            <select
                                className="border-2 h-[30px] p-1 border-gray-300 min-w-[140px] cursor-pointer"
                                onChange={(evt) =>
                                    setFinancialProfitListFilters((prev) => ({
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
                                    setFinancialProfitListFilters((prev) => ({
                                        ...prev,
                                        metric: [evt.target.value],
                                    }))
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

                        <Bar
                            data={financialProfitListData}
                            options={horizontalOptions}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Indicators;
