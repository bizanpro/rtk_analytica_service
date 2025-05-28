import { useState, useEffect } from "react";
import getData from "../../utils/getData";

import ChartDataLabels from "chartjs-plugin-datalabels";

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
    const [financialMetrics, setFinancialMetrics] = useState({});

    const verticalLabels = ["Янв", "Фев", "Мар", "Апр", "Май"];
    const verticalData = {
        labels: verticalLabels,
        datasets: [
            {
                label: "",
                data: verticalLabels.map(() =>
                    Math.floor(Math.random() * 1000)
                ),
                backgroundColor: "black",
                categoryPercentage: 0.5,
                stack: "stack1",
                borderRadius: 4,
            },
            {
                label: "",
                data: verticalLabels.map(() => 1000),
                backgroundColor: "rgba(245, 245, 245, 0.5)",
                categoryPercentage: 0.5,
                stack: "stack1",
                borderRadius: 4,
            },
        ],
    };

    const horizontalLabels = [
        "ГОК Светловский",
        "ГОК Светловский",
        "ГОК Светловский",
        "ГОК Светловский",
        "ГОК Светловский",
        "ГОК Светловский",
    ];
    const horizontalData = {
        labels: horizontalLabels,
        datasets: [
            {
                label: "",
                data: [300, 500, 700, 550, 920, 680],
                backgroundColor: "black",
                borderRadius: 4,
                categoryPercentage: 0.5,
            },
        ],
    };

    // Опции с включённым "stacked"
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
    };

    const getFilterOptions = () => {
        getData(`${import.meta.env.VITE_API_URL}company/filter-options`).then(
            (response) => {
                if (response?.status == 200) {
                    setFilterOptions(response.data);

                    setSelectedFilters({
                        period: [response.data.periods[0].value],
                        report_month: [response.data.months[0].value],
                    });
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

    useEffect(() => {
        getFilterOptions();
    }, []);

    useEffect(() => {
        console.log(selectedFilters);

        if (Object.keys(selectedFilters).length > 0) {
            getFinancialMetrics();
        }
    }, [selectedFilters]);

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
                            // defaultValue={months[0].value || ""}
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
                            // defaultValue={periods[0].value || ""}
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
                                    <strong className="font-normal text-3xl max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                                        {financialMetrics.revenue?.value}
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
                                    <strong className="font-normal text-3xl max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                                        {financialMetrics.receipts?.value}
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
                                    <strong className="font-normal text-3xl max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                                        {financialMetrics.debts?.value}
                                    </strong>
                                    <small className="text-sm">
                                        {financialMetrics.debts?.label}
                                    </small>
                                </div>
                                {/* <div className="text-red-400">+15%</div> */}
                            </div>
                        </div>

                        <Bar data={verticalData} options={verticalOptions} />
                    </div>

                    <div className="p-5">
                        <div className="grid grid-cols-2 items-center justify-between gap-5 mb-5">
                            <select className="border-2 h-[30px] p-1 border-gray-300 min-w-[140px] cursor-pointer">
                                <option value="">Проект</option>
                            </select>

                            <select className="border-2 h-[30px] p-1 border-gray-300 min-w-[140px] cursor-pointer">
                                <option value="">Выручка</option>
                            </select>
                        </div>

                        <Bar
                            data={horizontalData}
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
                                    <strong className="font-normal text-3xl max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
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
                                        className="font-normal text-3xl max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap"
                                        title="350.000 руб."
                                    >
                                        65,5
                                    </strong>
                                    <small className="text-sm">%</small>
                                </div>
                                <div className="text-green-400">+15%</div>
                            </div>
                        </div>

                        <Bar data={verticalData} options={verticalOptions} />
                    </div>

                    <div className="p-5">
                        <div className="grid grid-cols-2 items-center justify-between gap-5 mb-5">
                            <select className="border-2 h-[30px] p-1 border-gray-300 min-w-[140px] cursor-pointer">
                                <option value="">Проект</option>
                            </select>

                            <select className="border-2 h-[30px] p-1 border-gray-300 min-w-[140px] cursor-pointer">
                                <option value="">Выручка</option>
                            </select>
                        </div>

                        <Bar
                            data={horizontalData}
                            options={horizontalOptions}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Indicators;
