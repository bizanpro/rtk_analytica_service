import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";

import Select from "react-select";
import NewCustomerWindow from "./NewCustomerWindow";
import Loader from "../Loader";

import "react-datepicker/dist/react-datepicker.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SaleCard = () => {
    const URL = `${import.meta.env.VITE_API_URL}sales-funnel-projects`;
    const location = useLocation();
    const { saleId } = useParams();

    const [mode, setMode] = useState(location.state?.mode || "read");
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const [projectData, setProjectData] = useState({});
    const [formFields, setFormFields] = useState({});

    const [addCustomer, setAddCustomer] = useState(false);
    const [addServices, setAddServices] = useState(false);
    const [addBanks, setAddBanks] = useState(false);

    const [selectedServices, setSelectedServices] = useState([]);
    const [industries, setIndustries] = useState([]);
    const [contragents, setContragents] = useState([]);
    const [banks, setBanks] = useState([]);
    const [reportTypes, setReportTypes] = useState([
        {
            id: 1,
            name: "Финансово-технический аудит",
        },
        {
            id: 2,
            name: "Финансово-технический мониторинг",
        },
        {
            id: 3,
            name: "Финансовая модель",
        },
        {
            id: 4,
            name: "Отчет технического консультанта",
        },
        {
            id: 5,
            name: "Инженерные записки",
        },
    ]);

    let query;

    // Обработка ввода данных проекта
    const handleInputChange = useCallback((e, name) => {
        setFormFields((prev) => ({ ...prev, [name]: e.target.value }));
        setProjectData((prev) => ({ ...prev, [name]: e.target.value }));
    }, []);

    // Получение отраслей
    const fetchIndustries = () => {
        getData(`${import.meta.env.VITE_API_URL}industries`, {
            Accept: "application/json",
        }).then((response) => {
            if (response?.status == 200) {
                setIndustries(response.data.data);
            }
        });
    };

    // Получение заказчика
    const fetchContragents = () => {
        getData(`${import.meta.env.VITE_API_URL}contragents/?all=true`, {
            Accept: "application/json",
        }).then((response) => {
            if (response?.status == 200) {
                setContragents(response.data.data);
            }
        });
    };

    // Получение банков
    const fetchBanks = () => {
        getData(`${import.meta.env.VITE_API_URL}banks`).then((response) => {
            if (response?.status == 200) {
                setBanks(response.data.data);
            }
        });
    };

    // Обновление заказчика
    const updateContragent = async (showMessage = true, data) => {
        query = toast.loading("Обновление", {
            containerId: "projectCard",
            position: "top-center",
        });

        try {
            const response = await postData("PATCH", `${URL}/${saleId}`, data);
            if (response?.ok && showMessage) {
                toast.update(query, {
                    render: "Проект успешно обновлен",
                    type: "success",
                    containerId: "projectCard",
                    isLoading: false,
                    autoClose: 1200,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                });
            }

            setProjectData(response);
            setFormFields(response);
            return response;
        } catch (error) {
            toast.dismiss(query);
            toast.error("Ошибка при обновлении проекта", {
                containerId: "projectCard",
                isLoading: false,
                autoClose: 1500,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                position: "top-center",
            });
            console.error("Ошибка при обновлении проекта:", error);
            throw error;
        }
    };

    // Создание нового заказчика
    const sendNewContragent = (program_name) => {
        postData(
            "POST",
            `${import.meta.env.VITE_API_URL}contragents/sales-funnel`,
            { program_name }
        ).then((response) => {
            if (response?.ok) {
                updateContragent(true, { contragent_id: response.id });
            }
        });
    };

    // Получение проекта
    const getProject = async (id) => {
        setIsDataLoaded(false);

        try {
            const response = await getData(`${URL}/${id}`, {
                Accept: "application/json",
            });
            setProjectData(response.data);

            await Promise.all([
                fetchIndustries(),
                fetchContragents(),
                fetchBanks(),
            ]);

            setIsDataLoaded(true);
        } catch (error) {
            console.error("Ошибка при загрузке проекта:", error);

            setIsDataLoaded(true);
        }
    };

    // Обновление проекта
    const updateProject = async (showMessage = true) => {
        query = toast.loading("Обновление", {
            containerId: "projectCard",
            position: "top-center",
        });

        try {
            const response = await postData(
                "PATCH",
                `${URL}/${saleId}`,
                formFields
            );
            if (response?.ok && showMessage) {
                toast.update(query, {
                    render: "Проект успешно обновлен",
                    type: "success",
                    containerId: "projectCard",
                    isLoading: false,
                    autoClose: 1200,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                });
            }

            setProjectData(response);
            setFormFields(response);
            return response;
        } catch (error) {
            toast.dismiss(query);
            toast.error("Ошибка при обновлении проекта", {
                containerId: "projectCard",
                isLoading: false,
                autoClose: 1500,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                position: "top-center",
            });
            console.error("Ошибка при обновлении проекта:", error);
            throw error;
        }
    };

    useEffect(() => {
        if (saleId) {
            getProject(saleId);
        }
    }, []);

    return (
        <main className="page">
            <div className="new-project pt-8 pb-15">
                <div className="container relative">
                    <ToastContainer containerId="projectCard" />

                    <div className="flex justify-between items-center gap-10">
                        <div className="flex items-center gap-3 flex-grow">
                            <div className="flex flex-col gap-3 w-full">
                                <input
                                    type="text"
                                    className="text-3xl font-medium"
                                    name="name"
                                    defaultValue={projectData.name}
                                    onChange={(e) =>
                                        handleInputChange(e, "name")
                                    }
                                    disabled={mode == "read" ? true : false}
                                />
                            </div>

                            {mode === "edit" &&
                                projectData?.name?.length > 2 && (
                                    <button
                                        type="button"
                                        className="update-icon"
                                        title="Обновить данные проекта"
                                        onClick={() => updateProject()}
                                    ></button>
                                )}
                        </div>

                        <nav className="switch">
                            <div>
                                <input
                                    type="radio"
                                    name="mode"
                                    id="read_mode"
                                    onChange={() => {
                                        setMode("read");
                                    }}
                                    checked={mode === "read"}
                                />
                                <label htmlFor="read_mode">Чтение</label>
                            </div>

                            <div>
                                <input
                                    type="radio"
                                    name="mode"
                                    id="edit_mode"
                                    onChange={() => setMode("edit")}
                                    checked={mode === "edit"}
                                />
                                <label htmlFor="edit_mode">
                                    Редактирование
                                </label>
                            </div>
                        </nav>
                    </div>

                    <div className="mt-15 grid grid-cols-3 gap-10 relative">
                        {!isDataLoaded ? (
                            <Loader />
                        ) : (
                            <>
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2 flex-shrink-0 flex-grow">
                                        <span className="flex items-center gap-2 text-gray-400">
                                            Заказчик{" "}
                                            <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                ?
                                            </span>
                                        </span>
                                        <div className="border-2 border-gray-300 p-5">
                                            {addCustomer ? (
                                                <NewCustomerWindow
                                                    setAddCustomer={
                                                        setAddCustomer
                                                    }
                                                    handleInputChange={
                                                        handleInputChange
                                                    }
                                                    projectData={projectData}
                                                    contragents={contragents}
                                                    updateProject={
                                                        updateProject
                                                    }
                                                    sendNewContragent={
                                                        sendNewContragent
                                                    }
                                                />
                                            ) : (
                                                <div className="flex items-center justify-between">
                                                    {projectData.contragent
                                                        ?.program_name || (
                                                        <span className="text-gray-400">
                                                            Добавьте нового или
                                                            выберите из списка
                                                        </span>
                                                    )}
                                                    <div className="h-[20px] w-[20px]">
                                                        {mode === "edit" && (
                                                            <button
                                                                type="button"
                                                                className="add-button"
                                                                title="Выбрать заказчика"
                                                                onClick={() =>
                                                                    setAddCustomer(
                                                                        true
                                                                    )
                                                                }
                                                            >
                                                                <span></span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-[1fr_40%] gap-5">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex flex-col gap-2 flex-shrink-0 flex-grow">
                                                <span className="flex items-center gap-2 text-gray-400">
                                                    Отрасль{" "}
                                                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                        ?
                                                    </span>
                                                </span>
                                                <div className="border-2 border-gray-300 p-5">
                                                    <select
                                                        className="w-full h-[21px]"
                                                        value={
                                                            projectData?.industry_id ||
                                                            ""
                                                        }
                                                        onChange={(e) => {
                                                            handleInputChange(
                                                                e,
                                                                "industry_id"
                                                            );
                                                        }}
                                                        disabled={
                                                            mode == "read"
                                                                ? true
                                                                : false
                                                        }
                                                    >
                                                        <option value="">
                                                            Выбрать отрасль
                                                        </option>
                                                        {industries.length >
                                                            0 &&
                                                            industries.map(
                                                                (item) => (
                                                                    <option
                                                                        value={
                                                                            item.id
                                                                        }
                                                                        key={
                                                                            item.id
                                                                        }
                                                                    >
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 flex-shrink-0 flex-grow">
                                                <span className="flex items-center gap-2 text-gray-400">
                                                    Источник{" "}
                                                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                        ?
                                                    </span>
                                                </span>
                                                <div className="border-2 border-gray-300 p-5">
                                                    <select
                                                        className="w-full h-[21px]"
                                                        defaultValue={""}
                                                        disabled={
                                                            mode == "read"
                                                                ? true
                                                                : false
                                                        }
                                                    >
                                                        <option value="">
                                                            Выберите из списка
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 flex-shrink-0 flex-grow">
                                            <span className="flex items-center gap-2 text-gray-400">
                                                Банк
                                                <div className="h-[20px] w-[20px]">
                                                    {mode === "edit" && (
                                                        <button
                                                            type="button"
                                                            className="add-button"
                                                            onClick={() =>
                                                                setAddBanks(
                                                                    true
                                                                )
                                                            }
                                                            title="Выбрать банк"
                                                        >
                                                            <span></span>
                                                        </button>
                                                    )}
                                                </div>
                                            </span>
                                            <ul className="border-2 border-gray-300 p-5 h-full flex flex-col gap-3">
                                                {addBanks ? (
                                                    <Select
                                                        closeMenuOnSelect={
                                                            false
                                                        }
                                                        isMulti
                                                        options={banks.map(
                                                            (item) => ({
                                                                value: item.id,
                                                                label: item.name,
                                                            })
                                                        )}
                                                        className="basic-multi-select min-w-[170px] min-h-[32px]"
                                                        classNamePrefix="select"
                                                        placeholder="Выбрать банк"
                                                        value={
                                                            projectData.creditors?.map(
                                                                (creditor) => ({
                                                                    value: creditor.id,
                                                                    label: creditor.name,
                                                                })
                                                            ) || []
                                                        }
                                                        onChange={(
                                                            selectedOptions
                                                        ) => {
                                                            const selectedIds =
                                                                selectedOptions.map(
                                                                    (option) =>
                                                                        option.value
                                                                );

                                                            const selectedBanks =
                                                                banks.filter(
                                                                    (bank) =>
                                                                        selectedIds.includes(
                                                                            bank.id
                                                                        )
                                                                );

                                                            setProjectData(
                                                                (prevData) => ({
                                                                    ...prevData,
                                                                    creditors:
                                                                        selectedBanks,
                                                                })
                                                            );

                                                            setFormFields(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    creditors:
                                                                        selectedIds,
                                                                })
                                                            );
                                                        }}
                                                        onMenuClose={() => {
                                                            setAddBanks(false);
                                                        }}
                                                    />
                                                ) : (
                                                    projectData.creditors?.map(
                                                        (creditor) => (
                                                            <li
                                                                key={
                                                                    creditor.id
                                                                }
                                                            >
                                                                {creditor.name}
                                                            </li>
                                                        )
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 flex-shrink-0 flex-grow">
                                        <span className="flex items-center gap-2 text-gray-400">
                                            Местоположение
                                        </span>
                                        <div className="border-2 border-gray-300 p-5">
                                            <input
                                                type="text"
                                                className="w-full"
                                                placeholder="Заполните местоположение"
                                                defaultValue={
                                                    projectData.location || ""
                                                }
                                                onChange={(e) => {
                                                    handleInputChange(
                                                        e,
                                                        "location"
                                                    );
                                                }}
                                                disabled={
                                                    mode == "read"
                                                        ? true
                                                        : false
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <span className="text-gray-400">
                                            Краткое описание
                                        </span>
                                        <textarea
                                            className="border-2 border-gray-300 p-5 min-h-[300px]"
                                            placeholder="Заполните описание проекта"
                                            style={{ resize: "none" }}
                                            defaultValue={
                                                projectData.short_description ||
                                                ""
                                            }
                                            onChange={(e) => {
                                                handleInputChange(
                                                    e,
                                                    "short_description"
                                                );
                                            }}
                                            disabled={
                                                mode == "read" ? true : false
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2 h-[200px]">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400">
                                                Услуги
                                            </span>
                                            <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                ?
                                            </span>
                                            <div className="h-[20px] w-[20px]">
                                                {mode === "edit" && (
                                                    <button
                                                        type="button"
                                                        className="add-button"
                                                        title="Добавить услугу"
                                                        onClick={() =>
                                                            setAddServices(true)
                                                        }
                                                    >
                                                        <span></span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="border-2 border-gray-300 py-5 px-4 h-full overflow-x-hidden overflow-y-auto">
                                            {addServices ? (
                                                <Select
                                                    closeMenuOnSelect={false}
                                                    isMulti
                                                    name="colors"
                                                    options={reportTypes.map(
                                                        (type) => ({
                                                            value: type.name,
                                                            label: type.name,
                                                        })
                                                    )}
                                                    className="basic-multi-select min-w-[170px] min-h-[32px]"
                                                    classNamePrefix="select"
                                                    placeholder="Выбрать тип отчёта"
                                                    onChange={(
                                                        selectedOptions
                                                    ) => {
                                                        setSelectedServices(
                                                            selectedOptions.map(
                                                                (option) =>
                                                                    option.value
                                                            )
                                                        );
                                                    }}
                                                    onMenuClose={() => {
                                                        setAddServices(false);
                                                    }}
                                                />
                                            ) : (
                                                <ul className="grid gap-3">
                                                    <li className="grid items-center grid-cols-[1fr_40%] gap-3 mb-2 text-gray-400">
                                                        <span>Тип услуги</span>
                                                        <span className="flex items-center gap-2">
                                                            Стоимость
                                                            <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                                ?
                                                            </span>
                                                        </span>
                                                    </li>

                                                    {selectedServices.length >
                                                        0 &&
                                                        selectedServices.map(
                                                            (service) => (
                                                                <li
                                                                    className="grid items-center grid-cols-[1fr_40%] gap-3 mb-2"
                                                                    key={
                                                                        service
                                                                    }
                                                                >
                                                                    {service}
                                                                </li>
                                                            )
                                                        )}
                                                </ul>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 flex-grow">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400">
                                                Воронка продажи
                                            </span>
                                        </div>

                                        <div className="border-2 border-gray-300 py-5 px-4 h-full overflow-x-hidden overflow-y-auto">
                                            <ul className="grid gap-3">
                                                <li className="grid items-center grid-cols-[1fr_25%_25%] gap-3 mb-2 text-gray-400">
                                                    <span className="flex items-center gap-2">
                                                        Этап
                                                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                            ?
                                                        </span>
                                                    </span>
                                                    <span className="flex items-center gap-2">
                                                        Дата
                                                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                            ?
                                                        </span>
                                                    </span>
                                                    <span className="flex items-center gap-2">
                                                        Статус
                                                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                            ?
                                                        </span>
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2 h-[200px]">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400">
                                                Перечень работ
                                            </span>
                                            <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                ?
                                            </span>
                                        </div>

                                        <textarea
                                            className="border-2 border-gray-300 p-5 h-full"
                                            placeholder="Заполните перечень работ"
                                            style={{ resize: "none" }}
                                            type="text"
                                            name="description"
                                            disabled={
                                                mode == "read" ? true : false
                                            }
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2 flex-grow">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400">
                                                Воронка продажи
                                            </span>
                                        </div>

                                        <div className="border-2 border-gray-300 py-5 px-4 h-full">
                                            <textarea
                                                className="p-5 h-full w-full"
                                                placeholder="Оставьте комментарии по этапу"
                                                style={{ resize: "none" }}
                                                type="text"
                                                name="description"
                                                disabled={
                                                    mode == "read"
                                                        ? true
                                                        : false
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};
export default SaleCard;
