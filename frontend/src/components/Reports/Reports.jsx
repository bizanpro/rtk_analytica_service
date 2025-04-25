import { useState, useEffect } from "react";
import getData from "../../utils/getData";

import ReportItem from "./ReportItem";

const Reports = () => {
    const URL = `${import.meta.env.VITE_API_URL}reports`;
    const [activeTab, setActiveTab] = useState("projects");
    const [isLoading, setIsLoading] = useState(true);

    const [reportsList, setReportsList] = useState([]);
    const [managementList, setManagementList] = useState([]);

    const getReports = () => {
        getData(URL, { Accept: "application/json" })
            .then((response) => {
                if (response.status === 200) {
                    setReportsList(response.data.reports);
                }
            })
            .finally(() => setIsLoading(false));
    };

    const COLUMNS = [
        [
            { label: "Отчёт", key: "name" },
            { label: "Проект", key: "project" },
            { label: "Заказкчик", key: "contragent" },
            { label: "Банк", key: "creditors" },
            { label: "Бюджет", key: "project_budget" },
            { label: "Срок", key: "implementation_period" },
            { label: "Руководитель проекта", key: "project_managers" },
            { label: "Статус", key: "status" },
            { label: "Период выполнения", key: "days" },
        ],
        [
            { label: "Отчёт", key: "name" },
            { label: "Отчётный месяц", key: "contragent" },
            { label: "Отвественный", key: "creditors" },
            { label: "Дата создания", key: "project_budget" },
            { label: "Дата изменения", key: "implementation_period" },
        ],
    ];

    useEffect(() => {
        getReports();
    }, []);

    return (
        <main className="page">
            <div className="container py-8">
                <div className="flex flex-col justify-between gap-6 mb-8">
                    <h1 className="text-3xl font-medium">Реестр отчётов</h1>

                    <nav className="flex items-center gap-10 border-b border-gray-300 text-lg">
                        <button
                            type="button"
                            className={`py-2 transition-all border-b-2 ${
                                activeTab == "projects"
                                    ? "border-gray-500"
                                    : "border-transparent"
                            }`}
                            onClick={() => setActiveTab("projects")}
                            title="Перейти на вкладку Проекты"
                        >
                            Проекты ({reportsList.length})
                        </button>
                        <button
                            type="button"
                            className={`py-2 transition-all border-b-2 ${
                                activeTab == "management"
                                    ? "border-gray-500"
                                    : "border-transparent"
                            }`}
                            onClick={() => setActiveTab("management")}
                            title="Перейти на вкладку Менеджмент"
                        >
                            Менеджмент ({managementList.length})
                        </button>
                    </nav>

                    <div className="flex items-center justify-between gap-6">
                        {activeTab === "projects" && (
                            <>
                                <div className="flex items-center gap-5">
                                    <select
                                        className={
                                            "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                        }
                                    >
                                        <option value="">Заказчик</option>
                                    </select>
                                    <select
                                        className={
                                            "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                        }
                                    >
                                        <option value="">Отрасль</option>
                                    </select>
                                    <select
                                        className={
                                            "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                        }
                                    >
                                        <option value="">Банк</option>
                                    </select>
                                    <select
                                        className={
                                            "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                        }
                                    >
                                        <option value="">
                                            Руководитель проекта
                                        </option>
                                    </select>
                                    <select
                                        className={
                                            "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                        }
                                    >
                                        <option value="">Тип отчёта</option>
                                    </select>
                                    <select
                                        className={
                                            "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                        }
                                    >
                                        <option value="">Статус</option>
                                    </select>
                                </div>

                                <button
                                    type="button"
                                    className="border rounded-lg py-1 px-5"
                                >
                                    Очистить
                                </button>
                            </>
                        )}
                        {activeTab === "management" && (
                            <>
                                <div className="flex items-center gap-5">
                                    <select
                                        className={
                                            "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                        }
                                    >
                                        <option value="">Отчёт</option>
                                    </select>
                                    <select
                                        className={
                                            "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                        }
                                    >
                                        <option value="">Отчётный месяц</option>
                                    </select>

                                    <button
                                        type="button"
                                        className="border rounded-lg py-1 px-5"
                                    >
                                        Очистить
                                    </button>
                                </div>

                                <button type="button" className="py-1 px-5">
                                    Создать отчёт
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto w-full pb-5">
                    <table className="table-auto w-full border-collapse border-gray-300 text-sm">
                        <thead className="text-gray-400 text-left">
                            <tr className="border-b border-gray-300">
                                {COLUMNS[activeTab === "projects" ? 0 : 1].map(
                                    ({ label, key }) => (
                                        <th
                                            className="text-base px-4 py-2 min-w-[180px] max-w-[200px]"
                                            rowSpan="2"
                                            key={key}
                                        >
                                            {label}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td className="text-base px-4 py-2">
                                        Загрузка...
                                    </td>
                                </tr>
                            ) : activeTab === "projects" ? (
                                reportsList.length > 0 &&
                                reportsList.map((item) => (
                                    <ReportItem
                                        key={item.id}
                                        activeTab={"projects"}
                                        columns={COLUMNS[0]}
                                        props={item}
                                    />
                                ))
                            ) : (
                                managementList.length > 0 &&
                                managementList.map((item) => (
                                    <ReportItem
                                        key={item.id}
                                        activeTab={"management"}
                                        columns={COLUMNS[1]}
                                        props={item}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* 
                {popupState && (
                    <Popup onClick={closePopup} title="Создание проекта">
                        <div className="min-w-[280px]">
                            <div className="action-form__body">
                                <label
                                    htmlFor="project_name"
                                    className="block mb-3"
                                >
                                    Введите наименование проекта
                                </label>
                                <input
                                    type="text"
                                    name="project_name"
                                    id="project_name"
                                    className="border-2 border-gray-300 p-3 w-full"
                                    value={newProjectName}
                                    onChange={(e) =>
                                        handleProjectsNameChange(e)
                                    }
                                />
                            </div>
                            <div className="action-form__footer mt-5 flex items-center gap-6 justify-between">
                                <button
                                    type="button"
                                    className="rounded-lg py-2 px-5 bg-black text-white flex-[1_1_50%]"
                                    onClick={createProject}
                                >
                                    Создать
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPopupState(false)}
                                    className="border rounded-lg py-2 px-5 flex-[1_1_50%]"
                                >
                                    Отменить
                                </button>
                            </div>
                        </div>
                    </Popup>
                )} */}
            </div>
        </main>
    );
};

export default Reports;
