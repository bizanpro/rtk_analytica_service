import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";
import parseFormattedMoney from "../../utils/parseFormattedMoney";

import Select from "react-select";
import MultiSelect from "../MultiSelect/MultiSelect";

import NewCustomerWindow from "./NewCustomerWindow";
import SaleServiceItem from "./SaleServiceItem";
import SaleFunnelStages from "./SaleFunnelStages";
import SaleStageDetails from "./SaleStageDetails";
import Loader from "../Loader";

import "react-datepicker/dist/react-datepicker.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SaleCard = () => {
    const URL = `${import.meta.env.VITE_API_URL}sales-funnel-projects`;
    const location = useLocation();
    const { saleId } = useParams();
    const navigate = useNavigate();

    const [mode, setMode] = useState(location.state?.mode || "read");
    const [isFirstInit, setIsFirstInit] = useState(true);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const [projectData, setProjectData] = useState({});
    const [formFields, setFormFields] = useState({});

    const [addCustomer, setAddCustomer] = useState(false);
    const [addServices, setAddServices] = useState(false);
    const [addBanks, setAddBanks] = useState(false);

    const [activeStage, setActiveStage] = useState(null);

    const [industries, setIndustries] = useState([]);
    const [contragents, setContragents] = useState([]);
    const [banks, setBanks] = useState([]);
    const [reportTypes, setReportTypes] = useState([]);
    const [services, setServices] = useState([]);
    const [sources, setSources] = useState([]);
    const [saleStages, setSaleStages] = useState([]);
    const [newServices, setNewServices] = useState({ report_type_id: [] });
    const [stageMetrics, setStageMetrics] = useState({});
    const [metrics, setMetrics] = useState([]); // Прослойка - значения динамических полей в детализации

    let query;

    const validateFields = () => {
        const newErrors = {};

        if (!projectData?.contragent_id) {
            newErrors.contragent_id = "Необходимо назначить заказчика";
        }

        if (!projectData?.industries.main) {
            newErrors.industries = "Необходимо выбрать отрасль";
        }

        if (!projectData?.request_source_id) {
            newErrors.request_source_id = "Необходимо выбрать источник";
        }

        return newErrors;
    };

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
                setContragents(response.data);
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

    // Получение услуг
    const fetchServices = () => {
        getData(
            `${
                import.meta.env.VITE_API_URL
            }sales-funnel-projects/${saleId}/services`
        ).then((response) => {
            if (response?.status == 200) {
                setServices(response.data);

                if (response.data.length > 0) {
                    getStages();
                }
            }
        });
    };

    // Получение источников
    const fetchSources = () => {
        getData(`${import.meta.env.VITE_API_URL}request-sources`).then(
            (response) => {
                if (response?.status == 200) {
                    setSources(response.data.data);
                }
            }
        );
    };

    // Получение тупов отчетов
    const fetchReportTypes = () => {
        getData(`${import.meta.env.VITE_API_URL}report-types`, {
            Accept: "application/json",
        }).then((response) => {
            if (response.status == 200) {
                setReportTypes(response.data.data);
            }
        });
    };

    // Прикрепляем услугу
    const sendService = () => {
        query = toast.loading("Обновление", {
            containerId: "projectCard",
            position: "top-center",
        });

        postData(
            "POST",
            `${
                import.meta.env.VITE_API_URL
            }sales-funnel-projects/${saleId}/services`,
            newServices
        )
            .then((response) => {
                if (response?.ok) {
                    toast.update(query, {
                        render: response.message,
                        type: "success",
                        containerId: "projectCard",
                        isLoading: false,
                        autoClose: 1200,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position: "top-center",
                    });
                    setAddServices(false);
                    fetchServices();
                }
            })
            .catch((error) => {
                toast.dismiss(query);
                toast.error(
                    error.message ||
                        "Ошибка добавления. Возможно, такая услуга уже добавлена",
                    {
                        containerId: "projectCard",
                        isLoading: false,
                        autoClose: 3000,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position: "top-center",
                    }
                );
            });
    };

    // Удалить услугу
    const deleteService = (id) => {
        query = toast.loading("Обновление", {
            containerId: "projectCard",
            position: "top-center",
        });

        postData(
            "DELETE",
            `${
                import.meta.env.VITE_API_URL
            }sales-funnel-projects/${saleId}/services/${id}`,
            {}
        ).then((response) => {
            if (response?.ok) {
                toast.update(query, {
                    render: response.message,
                    type: "success",
                    containerId: "projectCard",
                    isLoading: false,
                    autoClose: 1200,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                });
                fetchServices();
                getStages();

                if (services.length == 0) {
                    setStageMetrics({});
                }
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

    // Получаем этапы в воронке продаж
    const getStages = () => {
        getData(
            `${
                import.meta.env.VITE_API_URL
            }sales-funnel-projects/${saleId}/stages`
        ).then((response) => {
            if (response?.status == 200) {
                setSaleStages(response.data);
            }
        });
    };

    // Получаем детализацию выбранного этапа
    const getStageDetails = (stageId) => {
        const stageData = saleStages.stages?.find(
            (item) => item.id === stageId
        );

        if (stageData) {
            setStageMetrics(stageData);
            setStageMetrics((prev) => ({
                ...prev,
                stage_id: stageData.id,
            }));
        }
    };

    const handleActiveStageDate = (date, stageId) => {
        setSaleStages((prev) => {
            const updatedStages = prev.stages.map((stage) => {
                if (stage.id === stageId) {
                    return {
                        ...stage,
                        stage_date: date,
                    };
                }
                return stage;
            });

            return { ...prev, stages: updatedStages };
        });
    };

    // Обновляем детализацию этапа продажи
    const updateStageDetails = (nextStage = false, stage_status) => {
        const activeStageData = saleStages.stages.find(
            (item) => item.id === stageMetrics.stage_id
        );

        let stageMetricsData = stageMetrics;
        stageMetricsData = metrics;

        let newDate = "";

        if (activeStageData.stage_date) {
            newDate = new Date(activeStageData.stage_date).toLocaleDateString(
                "ru-RU"
            );

            const [day, month, year] = newDate.split(".");
            const formattedDate = `${year}-${month}-${day}`;

            stageMetricsData.stage_date = formattedDate;
        } else {
            stageMetricsData.stage_date = "";
        }

        stageMetricsData.metrics = stageMetricsData.metrics.map((item) => ({
            ...item,
            current_value: parseFormattedMoney(item.current_value),
        }));

        postData(
            "PATCH",
            `${
                import.meta.env.VITE_API_URL
            }sales-funnel-projects/${saleId}/stages/${
                stageMetrics.stage_id
            }/metrics`,
            stageMetricsData
        )
            .then((response) => {
                if (response.ok) {
                    getStages();
                    fetchServices();

                    if (nextStage) {
                        requestNextStage(nextStage, newDate, stage_status);
                    } else {
                        toast.success(response.message, {
                            type: "success",
                            containerId: "projectCard",
                            isLoading: false,
                            autoClose: 1200,
                            pauseOnFocusLoss: false,
                            pauseOnHover: false,
                            position: "top-center",
                        });
                    }
                } else {
                    toast.error(response.data.error || "Ошибка запроса", {
                        containerId: "projectCard",
                        isLoading: false,
                        autoClose: 2000,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position: "top-center",
                    });
                }
            })
            .catch((response) => {
                toast.error(response.data.error || "Ошибка запроса", {
                    containerId: "projectCard",
                    isLoading: false,
                    autoClose: 2000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                });
            });
    };

    // Валидация полей стоимости этапа перед сохранением
    const handleSaveDetails = () => {
        // const activeStageData = saleStages.stages.find(
        //     (item) => item.id === stageMetrics.stage_id
        // );

        // if (
        //     activeStageData.name.toLowerCase() !== "получен запрос" &&
        //     activeStageData.name.toLowerCase() !== "проект отложен" &&
        //     activeStageData.name.toLowerCase() !== "получен отказ" &&
        //     activeStageData.name.toLowerCase() !== "подготовка кп"
        // ) {
        //     if (
        //         metrics.metrics?.length > 0 &&
        //         metrics.metrics?.every(
        //             (item) =>
        //                 item.current_value !== null && item.current_value !== ""
        //         )
        //     ) {
        //         updateStageDetails();
        //     } else {
        //         toast.error("Заполните все поля стоимости предложения", {
        //             containerId: "projectCard",
        //             isLoading: false,
        //             autoClose: 2000,
        //             pauseOnFocusLoss: false,
        //             pauseOnHover: false,
        //             position: "top-center",
        //         });
        //     }
        // } else {
            updateStageDetails();
        // }
    };

    // Запрос следующего этапа в воронке продаж
    const requestNextStage = (stage_id, stage_date, stage_status) => {
        postData(
            "POST",
            `${
                import.meta.env.VITE_API_URL
            }sales-funnel-projects/${saleId}/stages`,
            { stage_id, stage_date, status: stage_status }
        )
            .then((response) => {
                if (response?.ok) {
                    toast.success(response.message, {
                        type: "success",
                        containerId: "projectCard",
                        isLoading: false,
                        autoClose: 1200,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position: "top-center",
                    });
                    getStages();
                }
            })
            .catch((response) => {
                toast.error(response.error || "Ошибка запроса", {
                    containerId: "projectCard",
                    isLoading: false,
                    autoClose: 2000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                });
            });
    };

    // Валидируем поля стоимости предложения перед запросом следующего этапа
    const handleNextStage = (stage_id, name, stage_status) => {
        if (
            name.toLowerCase() !== "получен запрос" &&
            name.toLowerCase() !== "проект отложен" &&
            name.toLowerCase() !== "получен отказ" &&
            name.toLowerCase() !== "подготовка кп"
        ) {
            if (
                metrics.metrics?.length > 0 &&
                metrics.metrics?.every(
                    (item) =>
                        item.current_value !== null && item.current_value !== ""
                )
            ) {
                updateStageDetails(stage_id, stage_status);
            } else {
                toast.error("Заполните все поля стоимости предложения", {
                    containerId: "projectCard",
                    isLoading: false,
                    autoClose: 2000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                });
            }
        } else {
            updateStageDetails(stage_id, stage_status);
        }
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
                fetchSources(),
                fetchServices(),
                fetchReportTypes(),
            ]);

            setIsDataLoaded(true);
        } catch (error) {
            if (error && error.status === 404) {
                navigate("/not-found", {
                    state: {
                        message: "Проект не найден",
                        errorCode: 404,
                        additionalInfo: "",
                    },
                });
            }
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
            fetchServices();

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

    // Сохранение отчета
    const handleSave = () => {
        const newErrors = validateFields();

        if (Object.keys(newErrors).length === 0) {
            updateProject();
        } else {
            alert(
                "Исправьте ошибки перед сохранением:\n" +
                    Object.values(newErrors).join("\n")
            );
        }
    };

    useEffect(() => {
        if (saleId) {
            getProject(saleId);
        }

        if (services.length > 0) {
            getStages();
        }
    }, []);

    useEffect(() => {
        if (mode === "read") {
            setAddCustomer(false);
            setAddServices(false);
            setAddBanks(false);
        }
    }, [mode]);

    useEffect(() => {
        if (services.length > 0) {
            setNewServices((prev) => ({
                ...prev,
                report_type_id: services.map((item) => item.id),
            }));
        } else {
            setStageMetrics({}); // Сбрасываем состояние при удалении всех услуг для перезагрузки экрана детализации
            setIsFirstInit(true);
        }
    }, [services]);

    useEffect(() => {
        if (saleStages.stages && saleStages.stages.length > 0 && isFirstInit) {
            setActiveStage(saleStages.stages[saleStages.stages?.length - 1].id);
            getStageDetails(
                saleStages.stages[saleStages.stages?.length - 1].id
            );
            setIsFirstInit(false);
        }

        if (activeStage) {
            getStageDetails(activeStage);
        }
    }, [saleStages]);

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
                                    disabled={mode == "read"}
                                />
                            </div>

                            {mode === "edit" &&
                                projectData?.name?.length > 2 && (
                                    <button
                                        type="button"
                                        className="update-icon"
                                        title="Обновить данные проекта"
                                        onClick={() => handleSave()}
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
                                            Заказчик
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
                                                    Отрасль
                                                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                        ?
                                                    </span>
                                                </span>
                                                <div className="border-2 border-gray-300 p-3">
                                                    <select
                                                        className="w-full h-[21px]"
                                                        value={
                                                            projectData
                                                                ?.industries
                                                                .main || ""
                                                        }
                                                        onChange={(evt) => {
                                                            setFormFields({
                                                                ...formFields,
                                                                industries: {
                                                                    ...formFields.industries,
                                                                    main: +evt
                                                                        .target
                                                                        .value,
                                                                },
                                                            });
                                                            setProjectData({
                                                                ...projectData,
                                                                industries: {
                                                                    ...projectData.industries,
                                                                    main: +evt
                                                                        .target
                                                                        .value,
                                                                },
                                                            });
                                                        }}
                                                        disabled={
                                                            mode == "read"
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

                                            <div className="flex flex-col gap-2 flex-shrink-0 flex-grow min-w-[200px] 2xl:min-w-[300px] 2xl:max-w-[300px]">
                                                <span className="flex items-center gap-2 text-gray-400">
                                                    Вспомогательные отрасли
                                                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                        ?
                                                    </span>
                                                </span>

                                                <Select
                                                    closeMenuOnSelect={false}
                                                    isMulti
                                                    name="colors"
                                                    options={industries.map(
                                                        (industry) => ({
                                                            value: industry.id,
                                                            label: industry.name,
                                                        })
                                                    )}
                                                    value={industries
                                                        .filter((industry) =>
                                                            projectData?.industries?.others?.includes(
                                                                industry.id
                                                            )
                                                        )
                                                        .map((industry) => ({
                                                            value: industry.id,
                                                            label: industry.name,
                                                        }))}
                                                    className="basic-multi-select min-h-[32px] w-full"
                                                    classNamePrefix="select"
                                                    placeholder="Выбрать отрасль"
                                                    isDisabled={mode == "read"}
                                                    onChange={(
                                                        selectedOptions
                                                    ) => {
                                                        setFormFields({
                                                            ...formFields,
                                                            industries: {
                                                                ...formFields.industries,
                                                                others: selectedOptions.map(
                                                                    (option) =>
                                                                        option.value
                                                                ),
                                                            },
                                                        });
                                                        setProjectData({
                                                            ...projectData,
                                                            industries: {
                                                                ...projectData.industries,
                                                                others: selectedOptions.map(
                                                                    (option) =>
                                                                        option.value
                                                                ),
                                                            },
                                                        });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2 flex-shrink-0 flex-grow">
                                                <span className="flex items-center gap-2 text-gray-400">
                                                    Источник
                                                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                        ?
                                                    </span>
                                                </span>
                                                <div className="border-2 border-gray-300 p-3">
                                                    <select
                                                        className="w-full h-[21px]"
                                                        value={
                                                            projectData?.request_source_id ||
                                                            ""
                                                        }
                                                        onChange={(e) => {
                                                            handleInputChange(
                                                                e,
                                                                "request_source_id"
                                                            );
                                                        }}
                                                        disabled={
                                                            mode == "read"
                                                        }
                                                    >
                                                        <option value="">
                                                            Выберите из списка
                                                        </option>
                                                        {sources.length > 0 &&
                                                            sources.map(
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
                                                disabled={mode == "read"}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 flex-shrink-0 flex-grow">
                                        <span className="flex items-center gap-2 text-gray-400">
                                            ТЭП
                                        </span>
                                        <div className="border-2 border-gray-300 p-5">
                                            <input
                                                type="text"
                                                className="w-full"
                                                placeholder="Заполните ТЭП"
                                                defaultValue={
                                                    projectData.tep || ""
                                                }
                                                onChange={(e) => {
                                                    handleInputChange(e, "tep");
                                                }}
                                                disabled={mode == "read"}
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
                                            disabled={mode == "read"}
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

                                        <div
                                            className={`h-full ${
                                                addServices
                                                    ? "relative"
                                                    : "overflow-x-hidden overflow-y-auto border-2 border-gray-300"
                                            }`}
                                        >
                                            {addServices ? (
                                                <div className="px-2 py-4 absolute top-0 left-0 right-0 bg-white z-99 border-2 border-gray-300 overflow-x-hidden overflow-y-auto max-h-[500px]">
                                                    <MultiSelect
                                                        options={reportTypes.map(
                                                            (type) => ({
                                                                value: type.id,
                                                                label: type.full_name,
                                                            })
                                                        )}
                                                        selectedValues={
                                                            newServices.report_type_id ??
                                                            []
                                                        }
                                                        onChange={(
                                                            updatedField
                                                        ) =>
                                                            setNewServices(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    ...updatedField,
                                                                })
                                                            )
                                                        }
                                                        fieldName="report_type_id"
                                                    />

                                                    <div className="mt-5 flex items-center gap-6 justify-between">
                                                        <button
                                                            type="button"
                                                            className="rounded-lg py-3 px-5 bg-black text-white flex-[1_1_50%]"
                                                            onClick={() =>
                                                                sendService()
                                                            }
                                                            title="Применить добавление услуг"
                                                        >
                                                            Применить
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setAddServices(
                                                                    false
                                                                );
                                                                setNewServices(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        report_type_id:
                                                                            services.map(
                                                                                (
                                                                                    item
                                                                                ) =>
                                                                                    item.id
                                                                            ),
                                                                    })
                                                                );
                                                            }}
                                                            className="border rounded-lg py-3 px-5 flex-[1_1_50%]"
                                                            title="Отменить добавление услуг"
                                                        >
                                                            Отменить
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <ul className="grid gap-3 py-5 px-4">
                                                    <li className="grid items-center grid-cols-[1fr_40%] gap-3 mb-2 text-gray-400">
                                                        <span>Тип услуги</span>
                                                        <span className="flex items-center gap-2">
                                                            Стоимость
                                                            <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                                ?
                                                            </span>
                                                        </span>
                                                    </li>

                                                    {services.length > 0 &&
                                                        services.map(
                                                            (service) => (
                                                                <SaleServiceItem
                                                                    key={
                                                                        service.id
                                                                    }
                                                                    service={
                                                                        service
                                                                    }
                                                                    deleteService={
                                                                        deleteService
                                                                    }
                                                                    mode={mode}
                                                                />
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
                                                <li className="grid items-center grid-cols-[1fr_28%_25%] gap-3 mb-2 text-gray-400">
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

                                                {saleStages.stages?.length >
                                                    0 &&
                                                    services.length > 0 && (
                                                        <SaleFunnelStages
                                                            saleStages={
                                                                saleStages
                                                            }
                                                            handleNextStage={
                                                                handleNextStage
                                                            }
                                                            getStageDetails={
                                                                getStageDetails
                                                            }
                                                            activeStage={
                                                                activeStage
                                                            }
                                                            setActiveStage={
                                                                setActiveStage
                                                            }
                                                            handleActiveStageDate={
                                                                handleActiveStageDate
                                                            }
                                                            mode={mode}
                                                        />
                                                    )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2 flex-grow">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400">
                                                Детализация этапа продажи
                                            </span>
                                            {mode === "edit" && activeStage && (
                                                <button
                                                    type="button"
                                                    className="save-icon w-[20px] h-[20px]"
                                                    title="Сохранить детализацию этапа продажи"
                                                    onClick={() =>
                                                        handleSaveDetails()
                                                    }
                                                ></button>
                                            )}
                                        </div>

                                        <div className="border-2 border-gray-300 py-5 px-4 h-full">
                                            {activeStage &&
                                                services.length > 0 && (
                                                    <SaleStageDetails
                                                        stageMetrics={
                                                            stageMetrics
                                                        }
                                                        metrics={metrics}
                                                        setMetrics={setMetrics}
                                                        mode={mode}
                                                    />
                                                )}
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
