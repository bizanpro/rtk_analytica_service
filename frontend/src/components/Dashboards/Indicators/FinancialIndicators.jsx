import { useState, useEffect } from "react";

import { sortFinanceValues } from "../../../utils/sortFinanceValues";
import ChartDataLabels from "chartjs-plugin-datalabels";

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

const FinancialIndicators = ({
    financialList,
    financialProfitList,
    setFinancialListFilters,
    setFinancialProfitListFilters,
}) => {
    const [mergedList, setMergetList] = useState([]);
    const [sortedMergedList, setSortedMergetList] = useState([]);

    const [sortBy, setSortBy] = useState({
        key: "",
        action: "",
    });

    // Ключевые финансовые показатели - Поступления
    const financialListData1 = {
        labels: sortedMergedList?.map((item) => item.name),
        datasets: [
            {
                label: "",
                data: sortedMergedList?.map((item) =>
                    parseFloat(
                        item.receipts?.value?.toString().replace(",", ".")
                    )
                ),
                backgroundColor: "black",
                borderRadius: 2,
                categoryPercentage: 0.3,
            },
        ],
    };

    // Ключевые финансовые показатели - Выручка
    const financialListData2 = {
        labels: sortedMergedList?.map((item) => item.name),
        datasets: [
            {
                label: "",
                data: sortedMergedList?.map((item) =>
                    parseFloat(
                        item.revenue?.value?.toString().replace(",", ".")
                    )
                ),

                backgroundColor: "black",
                borderRadius: 2,
                categoryPercentage: 0.3,
            },
        ],
    };

    // // Ключевые финансовые показатели - Выловая прибыль
    const financialProfitListData1 = {
        labels: sortedMergedList?.map((item) => item.name),
        datasets: [
            {
                label: "",
                data: sortedMergedList?.map((item) =>
                    parseFloat(
                        item.gross_profit?.value?.toString().replace(",", ".")
                    )
                ),
                backgroundColor: "black",
                borderRadius: 2,
                categoryPercentage: 0.3,
            },
        ],
    };

    // // Ключевые финансовые показатели - Валовая рентабельность
    const financialProfitListData2 = {
        labels: sortedMergedList?.map((item) => item.name),
        datasets: [
            {
                label: "",
                data: sortedMergedList?.map((item) =>
                    parseFloat(
                        item.gross_margin?.value?.toString().replace(",", ".")
                    )
                ),
                backgroundColor: "black",
                borderRadius: 2,
                categoryPercentage: 0.3,
            },
        ],
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
                align: "left",
                color: "#fff",
                clip: true,
                formatter: (value) => {
                    return typeof value === "number"
                        ? value.toFixed(1).toString().replace(".", ",")
                        : value;
                },
            },
        },

        scales: {
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
            x: {
                ticks: {
                    display: false,
                },
                grid: {
                    drawTicks: false,
                },
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
                align: "left",
                color: "#fff",
                clip: true,
                formatter: (value) => {
                    return typeof value === "number"
                        ? value.toFixed(1).toString().replace(".", ",")
                        : value;
                },
            },
        },

        scales: {
            y: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    callback: function (value) {
                        let label = this.getLabelForValue(value);
                        return label.length > 0 ? label.slice(0, 0) : label;
                    },
                },
                barPercentage: 0.7,
                categoryPercentage: 0.8,
            },

            x: {
                ticks: {
                    display: false,
                },
                grid: {
                    drawTicks: false,
                },
            },
        },
    };

    const horizontalOptionsWithPercent = {
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
                align: "left",
                color: "#fff",
                clip: true,
                formatter: (value) => `${value}%`,
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        let value = context.raw;
                        return `${value}%`;
                    },
                },
            },
        },

        scales: {
            y: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    callback: function (value) {
                        let label = this.getLabelForValue(value);
                        return label.length > 0 ? label.slice(0, 0) : label;
                    },
                },
                barPercentage: 0.7,
                categoryPercentage: 0.8,
            },

            x: {
                ticks: {
                    display: false,
                },
                grid: {
                    drawTicks: false,
                },
            },
        },
    };

    useEffect(() => {
        if (sortedMergedList.length > 0) {
            setSortedMergetList(sortFinanceValues(mergedList, sortBy));
        }
    }, [sortBy]);

    useEffect(() => {
        if (financialList.items && financialProfitList.items) {
            const merged = financialList?.items?.map((item) => {
                const match = financialProfitList?.items?.find(
                    (el) => el.id === item.id
                );
                return { ...item, ...match };
            });

            setMergetList(merged);
            setSortedMergetList(merged);
        }
    }, [financialList, financialProfitList]);

    // useEffect(() => {
    //     console.log(sortedMergedList);
    // }, [sortedMergedList]);

    return (
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
                            setFinancialProfitListFilters((prev) => ({
                                ...prev,
                                type: [evt.target.value],
                            }));

                            setSortBy({
                                key: "",
                                action: "",
                            });
                        }}
                    >
                        <option value="project">Проект</option>
                        <option value="customer">Заказчик</option>
                    </select>

                    <SortBtn
                        label={"Поступления, млн руб."}
                        value={"receipts.value"}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                    />
                </div>

                <SortBtn
                    label={"Выручка, млн руб."}
                    value={"revenue.value"}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    className={"text-left ml-[10px]"}
                />

                <SortBtn
                    label={"Валовая прибыль, млн руб."}
                    value={"gross_profit.value"}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    className={"text-left ml-[10px]"}
                />

                <SortBtn
                    label={"Валовая рентабельность"}
                    value={"gross_margin.value"}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    className={"text-left ml-[10px]"}
                />
            </div>

            <div className="h-[200px] overflow-x-hidden overflow-y-auto grid grid-cols-[32%_1fr_1fr_1fr]">
                <div
                    style={{
                        height:
                            (financialProfitListData1.labels?.length || 0) > 5
                                ? `${
                                      financialProfitListData1.labels.length *
                                      40
                                  }px`
                                : "200px",
                    }}
                >
                    <Bar
                        data={financialListData1}
                        options={horizontalOptions}
                    />
                </div>

                <div
                    style={{
                        height:
                            (financialProfitListData1.labels?.length || 0) > 5
                                ? `${
                                      financialProfitListData1.labels.length *
                                      40
                                  }px`
                                : "200px",
                    }}
                >
                    <Bar
                        data={financialListData2}
                        options={horizontalOptionsNoLabels}
                    />
                </div>

                <div
                    style={{
                        height:
                            (financialProfitListData1.labels?.length || 0) > 5
                                ? `${
                                      financialProfitListData1.labels.length *
                                      40
                                  }px`
                                : "200px",
                    }}
                >
                    <Bar
                        data={financialProfitListData1}
                        options={horizontalOptionsNoLabels}
                    />
                </div>

                <div
                    style={{
                        height:
                            (financialProfitListData1.labels?.length || 0) > 5
                                ? `${
                                      financialProfitListData1.labels.length *
                                      40
                                  }px`
                                : "200px",
                    }}
                >
                    <Bar
                        data={financialProfitListData2}
                        options={horizontalOptionsWithPercent}
                    />
                </div>
            </div>
        </div>
    );
};

export default FinancialIndicators;
