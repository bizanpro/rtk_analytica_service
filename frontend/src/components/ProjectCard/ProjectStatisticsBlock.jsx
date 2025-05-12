import { useState, useEffect } from "react";

import getData from "../../utils/getData";

import Loader from "../Loader";

const ProjectStatisticsBlock = ({ projectId }) => {
    const [period, setPeriod] = useState("current-year");
    const [revenue, setRevenue] = useState({});
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const fetchData = async () => {
        setIsDataLoaded(false);

        const [revenueRes] = await Promise.allSettled([
            getData(
                `${
                    import.meta.env.VITE_API_URL
                }projects/${projectId}/revenue/?period=${period}`
            ),
        ]);

        if (revenueRes.status === "fulfilled") {
            if (revenueRes.value.status == 200) {
                setRevenue(revenueRes.value.data); // Получение выручки
            }
        }

        setIsDataLoaded(true);
    };

    useEffect(() => {
        fetchData();
    }, [period]);

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
                            checked={period === "current-year"}
                            onChange={() => setPeriod("current-year")}
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
                        Выручка{" "}
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    <div className="flex items-center flex-grow gap-2">
                        <strong className="font-normal text-4xl">
                            {revenue.revenue || "0,0"}
                        </strong>
                        <small className="text-sm">
                            млн
                            <br />
                            руб.
                        </small>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="text-gray-400">Поступления</div>
                    <div className="flex items-center flex-grow gap-2">
                        <strong className="font-normal text-4xl">0,0</strong>
                        <small className="text-sm">
                            млн
                            <br />
                            руб.
                        </small>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-gray-400">
                        ДЗ{" "}
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    <div className="flex items-center flex-grow gap-2">
                        <strong className="font-normal text-4xl">0,0</strong>
                        <small className="text-sm">
                            млн
                            <br />
                            руб.
                        </small>
                    </div>
                </div>
            </div>
            <div className="grid items-stretch grid-cols-3 gap-3">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center flex-grow gap-2 text-gray-400">
                        Валовая прибыль{" "}
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    Нет данных
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-gray-400">
                        Подрячики{" "}
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    <div className="flex items-center flex-grow gap-2">
                        <strong className="font-normal text-4xl">0,0</strong>
                        <small className="text-sm">
                            млн
                            <br />
                            руб.
                        </small>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-gray-400">
                        Валовая рент.{" "}
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </div>
                    Нет данных
                </div>
            </div>
        </div>
    );
};

export default ProjectStatisticsBlock;
