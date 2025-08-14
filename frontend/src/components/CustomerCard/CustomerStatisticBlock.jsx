import { useState, useEffect } from "react";

import getData from "../../utils/getData";

import Loader from "../Loader";

const CustomerStatisticBlock = ({ contragentId, activeProject }) => {
    const [period, setPeriod] = useState("current_year");
    const [revenue, setRevenue] = useState({});
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const URL =
        activeProject != null
            ? `${
                  import.meta.env.VITE_API_URL
              }projects/${activeProject}/revenue/?period=${period}`
            : `${
                  import.meta.env.VITE_API_URL
              }contragents/${contragentId}/financial-metrics/?period=${period}`;

    const getRevenue = () => {
        setIsDataLoaded(false);

        getData(URL)
            .then((response) => {
                if (response.status == 200) {
                    setRevenue(response.data);
                }
            })
            .finally(() => setIsDataLoaded(true));
    };

    useEffect(() => {
        getRevenue();
    }, [period, activeProject]);

    return (
        <div className="border-2 border-gray-300 p-5 mb-5 relative">
            {!isDataLoaded && <Loader />}

            <div className="flex flex-col gap-2 justify-between">
                <div className="switch gap-4 w-[70%] mb-5">
                    <div>
                        <input
                            type="radio"
                            name="time_sort"
                            id="this_year"
                            checked={period === "current_year"}
                            onChange={() => setPeriod("current_year")}
                        />
                        <label
                            className="bg-gray-200 py-1 px-2 text-center rounded-md"
                            htmlFor="this_year"
                        >
                            Текущий год
                        </label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="time_sort"
                            id="all_time"
                            checked={period === "all"}
                            onChange={() => setPeriod("all")}
                        />
                        <label
                            className="bg-gray-200 py-1 px-2 text-center rounded-md"
                            htmlFor="all_time"
                        >
                            За всё время
                        </label>
                    </div>
                </div>
            </div>

            <div className="grid items-stretch grid-cols-3 gap-3 mb-3">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-gray-400">
                        Выручка
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    <div
                        className="flex items-center flex-grow gap-2"
                        title={
                            (revenue.revenue?.value ?? 0).toLocaleString(
                                "de-DE"
                            ) +
                            " " +
                            revenue.revenue?.label
                        }
                    >
                        <strong className="font-normal text-3xl max-w-[100px] whitespace-nowrap">
                            {(revenue.revenue?.value ?? 0).toLocaleString(
                                "de-DE"
                            )}
                        </strong>
                        <small className="text-sm">
                            {revenue.revenue?.label}
                        </small>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="text-gray-400">Поступления</div>
                    <div
                        className="flex items-center flex-grow gap-2"
                        title={
                            (revenue.receipts?.value ?? 0).toLocaleString(
                                "de-DE"
                            ) +
                            " " +
                            revenue.receipts?.label
                        }
                    >
                        <strong className="font-normal text-3xl max-w-[100px] whitespace-nowrap">
                            {(revenue.receipts?.value ?? 0).toLocaleString(
                                "de-DE"
                            )}
                        </strong>
                        <small className="text-sm">
                            {revenue.receipts?.label}
                        </small>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-gray-400">
                        ДЗ
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    <div
                        className="flex items-center flex-grow gap-2"
                        title={
                            (revenue.debts?.value ?? 0).toLocaleString(
                                "de-DE"
                            ) +
                            " " +
                            revenue.debts?.label
                        }
                    >
                        <strong className="font-normal text-3xl max-w-[100px] whitespace-nowrap">
                            {(revenue.debts?.value ?? 0).toLocaleString(
                                "de-DE"
                            )}
                        </strong>
                        <small className="text-sm">
                            {revenue.debts?.label}
                        </small>
                    </div>
                </div>
            </div>

            <div className="grid items-stretch grid-cols-3 gap-3">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center flex-grow gap-2 text-gray-400">
                        Валовая прибыль
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    <div
                        className="flex items-center flex-grow gap-2"
                        title={
                            (revenue.gross_profit?.value ?? 0).toLocaleString(
                                "de-DE"
                            ) +
                            " " +
                            revenue.gross_profit?.label
                        }
                    >
                        <strong className="font-normal text-3xl max-w-[100px] whitespace-nowrap">
                            {revenue.gross_profit?.value ?? 0}
                        </strong>
                        <small className="text-xl">
                            {revenue.gross_profit?.label}
                        </small>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-gray-400">
                        Подрячики
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    <div
                        className="flex items-center flex-grow gap-2"
                        title={
                            (
                                revenue.suppliers_expenses?.value ?? 0
                            ).toLocaleString("de-DE") +
                            " " +
                            revenue.suppliers_expenses?.label
                        }
                    >
                        <strong className="font-normal text-3xl max-w-[100px] whitespace-nowrap">
                            {(
                                revenue.suppliers_expenses?.value ?? 0
                            ).toLocaleString("de-DE")}
                        </strong>
                        <small className="text-sm">
                            {revenue.suppliers_expenses?.label}
                        </small>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-gray-400">
                        Валовая рент.
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    <div
                        className="flex items-center flex-grow gap-2"
                        title={
                            (revenue.gross_margin?.value ?? 0).toLocaleString(
                                "de-DE"
                            ) +
                            " " +
                            revenue.gross_margin?.label
                        }
                    >
                        <strong className="font-normal text-3xl max-w-[100px] whitespace-nowrap">
                            {revenue.gross_margin?.value ?? 0}
                        </strong>
                        <small className="text-xl">
                            {" "}
                            {revenue.gross_margin?.label}
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerStatisticBlock;
