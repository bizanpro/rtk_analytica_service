import { useEffect, useState, useMemo } from "react";
import getData from "../../utils/getData";
import postData from "../../utils/postData";
import SalesItem from "./SalesItem";
import Popup from "../Popup/Popup";
import Select from "../Select";
import { useNavigate } from "react-router-dom";

const Sales = () => {
    const URL = `${import.meta.env.VITE_API_URL}sales-funnel-projects`;
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [popupState, setPopupState] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [selectedBank, setSelectedBank] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const COLUMNS = [
        { label: "Проект", key: "name" },
        { label: "Заказчик", key: "contragent" },
        { label: "Банк", key: "creditors" },
        { label: "Тип услуг", key: "service_type" },
        { label: "Стоимость, млн руб.", key: "service_cost" },
        { label: "Дата запроса", key: "request_date" },
        { label: "Источник", key: "request_source" },
        { label: "Дата статуса", key: "status_date" },
        { label: "Статус", key: "status" },
    ];

    const filteredProjects = useMemo(() => {
        const result = list.filter((project) => {
            return (
                (selectedCustomer && selectedCustomer !== "default"
                    ? project?.contragent?.program_name === selectedCustomer
                    : true) &&
                (selectedBank && selectedBank !== "default"
                    ? Array.isArray(project.creditors)
                        ? project.creditors?.some(
                              (bank) => bank?.name === selectedBank
                          )
                        : false
                    : true) &&
                // (selectedStatus && selectedStatus !== "default"
                //     ? project.status === selectedStatus
                //     : true) &&
                (selectedPeriod && selectedPeriod !== "default"
                    ? project.request_date === selectedPeriod
                    : true)
            );
        });
        return result;
    }, [list, selectedCustomer, selectedBank, selectedStatus, selectedPeriod]);

    // Заполняем селектор заказчиков
    const customerOptions = useMemo(() => {
        const allSectors = list
            .map((item) => item?.contragent?.program_name)
            .filter((contragent) => contragent?.program_name !== null);

        return Array.from(new Set(allSectors));
    }, [list]);

    // Заполняем селектор банков
    const bankOptions = useMemo(() => {
        const allBanks = list.flatMap((item) =>
            item.creditors?.map((bank) => bank?.name)
        );
        return Array.from(new Set(allBanks));
    }, [list]);

    // // Заполняем селектор статусов
    // const statusOptions = useMemo(() => {
    //     const allPM = list
    //         .map((item) => item.manager)
    //         .filter((manager) => manager !== null);
    //     return Array.from(new Set(allPM));
    // }, [list]);

    // // Заполняем селектор периода запросов
    // const periodOptions = useMemo(() => {
    //     const allPM = list
    //         .map((item) => item.manager)
    //         .filter((manager) => manager !== null);
    //     return Array.from(new Set(allPM));
    // }, [list]);

    const handleProjectsNameChange = (e) => {
        setNewProjectName(e.target.value);
    };

    const openPopup = () => {
        setPopupState(true);
    };

    const closePopup = (evt) => {
        if (evt.currentTarget.classList.contains("popup")) setPopupState(false);
    };

    // Создание проекта
    const createProject = () => {
        postData("POST", URL, { name: newProjectName }).then((response) => {
            if (response) {
                navigate(`/sales/${response.id}`, {
                    state: { mode: "edit" },
                });
            }
        });
    };

    useEffect(() => {
        getData(URL, { Accept: "application/json" })
            .then((response) => {
                setList(response.data);
            })
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <main className="page">
            <div className="container py-8">
                <div className="flex justify-between items-center gap-6 mb-8">
                    <h1 className="text-3xl font-medium">
                        Реестр проектов в воронке продаж{" "}
                        {filteredProjects.length > 0 &&
                            `(${filteredProjects.length})`}
                    </h1>

                    <div className="flex items-center gap-6">
                        {customerOptions.length > 0 && (
                            <Select
                                className={
                                    "p-1 border border-gray-300 min-w-[120px] max-w-[200px]"
                                }
                                title={"Заказчик"}
                                items={customerOptions}
                                onChange={(evt) => {
                                    setSelectedCustomer(evt.target.value);
                                }}
                            />
                        )}

                        {bankOptions.length > 0 && (
                            <Select
                                className={
                                    "p-1 border border-gray-300 min-w-[120px] max-w-[200px]"
                                }
                                title={"Банк"}
                                items={bankOptions}
                                onChange={(evt) =>
                                    setSelectedBank(evt.target.value)
                                }
                            />
                        )}

                        {/* {statusOptions.length > 0 && (
                            <Select
                                className={
                                    "p-1 border border-gray-300 min-w-[120px] max-w-[200px]"
                                }
                                title={"Статус"}
                                items={statusOptions}
                                onChange={(evt) =>
                                    setSelectedStatus(evt.target.value)
                                }
                            />
                        )}

                        {periodOptions.length > 0 && (
                            <Select
                                className={
                                    "p-1 border border-gray-300 min-w-[120px] max-w-[200px]"
                                }
                                title={"Период запросов"}
                                items={periodOptions}
                                onChange={(evt) =>
                                    setSelectedPeriod(evt.target.value)
                                }
                            />
                        )} */}

                        <button
                            type="button"
                            className="p-1 px-4 text-gray-900 rounded-lg bg-gray-100 group text-lg"
                            onClick={openPopup}
                        >
                            Создать
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto w-full pb-5">
                    <table className="table-auto w-full border-collapse border-gray-300 text-sm">
                        <thead className="text-gray-400 text-left">
                            <tr className="border-b border-gray-300">
                                {COLUMNS.map(({ label, key }) => (
                                    <th
                                        className="text-base px-4 py-2 min-w-[180px] max-w-[200px]"
                                        rowSpan="2"
                                        key={key}
                                    >
                                        {label}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td className="text-base px-4 py-2">
                                        Загрузка...
                                    </td>
                                </tr>
                            ) : (
                                filteredProjects.length > 0 &&
                                filteredProjects.map((item) => (
                                    <SalesItem
                                        key={item.id}
                                        props={item}
                                        columns={COLUMNS}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {popupState && (
                    <Popup
                        onClick={closePopup}
                        title="Создать проект в воронке"
                    >
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
                )}
            </div>
        </main>
    );
};

export default Sales;
