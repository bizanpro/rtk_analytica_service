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
    const [sortedReceiptsList, setSortedReceiptsList] = useState({}); // Сортированные ключевые финансовые показатели - Поступления
    const [sortedRevenueList, setSortedRevenueList] = useState({}); // Сортированные ключевые финансовые показатели - Выручка

    const [sortedGrossProfitList, setSortedGrossProfitList] = useState({}); // Сортированные ключевые финансовые показатели - Выловая прибыль

    const [sortedGrossMarginList, setSortedGrossMarginListt] = useState({}); // Сортированные ключевые финансовые показатели - Валовая рентабельность

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
                categoryPercentage: 0.2,
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
                categoryPercentage: 0.2,
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
                categoryPercentage: 0.2,
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
                categoryPercentage: 0.2,
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
                align: "end",
                color: "#000",
                formatter: (value) => value,
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
                align: "end",
                color: "#000",
                formatter: (value) => value,
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
            // y: {
            //     ticks: {
            //         display: false,
            //     },
            //     barPercentage: 0.7,
            //     categoryPercentage: 0.8,
            // },
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
                items: sortFinanceValues(financialList?.items, revenueSortBy),
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

    useEffect(() => {
        setSortedReceiptsList(financialList);
        setSortedRevenueList(financialList);
    }, [financialList]);

    useEffect(() => {
        setSortedGrossProfitList(financialProfitList);
        setSortedGrossMarginListt(financialProfitList);
    }, [financialProfitList]);

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

                            setReceiptsSortBy({
                                key: "",
                                action: "",
                            });

                            setRevenueSortBy({
                                key: "",
                                action: "",
                            });

                            setGrossProfitSortBy({
                                key: "",
                                action: "",
                            });

                            setGrossMarginSortBy({
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
                        options={horizontalOptionsNoLabels}
                    />
                </div>
            </div>
        </div>
    );
};

export default FinancialIndicators;
