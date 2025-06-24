import { useState, useCallback, useEffect, useRef } from "react";
import {
    useParams,
    useLocation,
    useSearchParams,
    useNavigate,
} from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";
import handleStatus from "../../utils/handleStatus";

import ExecutorBlock from "../ExecutorBlock/ExecutorBlock";
import EmptyExecutorBlock from "../ExecutorBlock/EmptyExecutorBlock";
import ProjectReportWindow from "./ProjectReportWindow";
import ProjectReportItem from "./ProjectReportItem";
// import ProjectReportEditor from "./ProjectReportEditor";
import ProjectStatisticsBlock from "./ProjectStatisticsBlock";
import ProjectTeam from "./ProjectTeam";
import ReportServices from "./ReportServices";
import ProjectImplementationPeriod from "./ProjectImplementationPeriod";
import ProjectBudget from "./ProjectBudget";
import Loader from "../Loader";

import "./ProjectCard.scss";
import "react-datepicker/dist/react-datepicker.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProjectCard = () => {
    const URL = `${import.meta.env.VITE_API_URL}projects`;
    const location = useLocation();
    const { projectId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [projectData, setProjectData] = useState({});
    const [formFields, setFormFields] = useState({});

    const [mode, setMode] = useState(location.state?.mode || "read");
    const [activeReportTab, setActiveReportTab] = useState("projectReports");

    const [industries, setIndustries] = useState([]);
    const [contragents, setContragents] = useState([]);
    const [banks, setBanks] = useState([]);
    const [contracts, setContracts] = useState([]);

    const [lenders, setLenders] = useState([]);
    const [filteredLenders, setFilteredLenders] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [addLender, setAddLender] = useState(false);
    const [addCustomer, setAddCustomer] = useState(false);

    const [newLender, setNewLender] = useState({
        full_name: "",
        phone: "",
        position: "",
        email: "",
        creditor_id: 1,
    });

    const [newCustomer, setNewCustomer] = useState({
        full_name: "",
        phone: "",
        position: "",
        email: "",
    });

    const [reports, setReports] = useState([]);
    const [reportWindowsState, setReportWindowsState] = useState(false); // Конструктор отчёта
    // const [reportEditorState, setReportEditorState] = useState(false); // Конструктор заключения по отчёту
    // const [reportEditorName, setReportEditorName] = useState("");
    // const [reportData, setReportData] = useState({});

    const [teamData, setTeamData] = useState([]);
    const [services, setServices] = useState([]);
    const [reportId, setReportId] = useState(null);

    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [firstInit, setFirstInit] = useState(true);

    let query;

    const statRef = useRef(null);

    // Обновляем блок ОСВ
    const handleUpdate = () => {
        statRef.current?.refreshRevenue();
    };

    const matchedBanks = banks.filter((bank) =>
        projectData.creditors?.some(
            (selectedBank) => selectedBank.id === bank.id
        )
    );

    // Фильтр кредиторов
    const handleFilterLenders = (evt) => {
        evt.target.value === ""
            ? setFilteredLenders(lenders)
            : setFilteredLenders(
                  lenders.filter(
                      (lender) => +lender.creditor_id === +evt.target.value
                  )
              );
    };

    // Форматирование даты
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("ru-RU");
    };

    // Обработка ввода данных проекта
    const handleInputChange = useCallback((e, name) => {
        setFormFields((prev) => ({ ...prev, [name]: e.target.value }));
        setProjectData((prev) => ({ ...prev, [name]: e.target.value }));
    }, []);

    // Обработка состояния добавочного блока при изменении
    const handleChange = useCallback((id, field, value, data, method) => {
        method(
            data.map((block) =>
                block.id === id
                    ? {
                          ...block,
                          borderClass: "border-gray-300",
                          [field]: value,
                      }
                    : block
            )
        );
    }, []);

    // Обработчик ввода данных блока заказчика и кредитора
    const handleNewExecutor = (type, e, name) => {
        if (type === "lender") {
            setNewLender({
                ...newLender,
                [name]: name === "phone" ? e : e.target.value,
            });
        } else if (type === "customer") {
            setNewCustomer({
                ...newCustomer,
                [name]: name === "phone" ? e : e.target.value,
            });
        }
    };

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

    // Получение договоров
    const fetchContracts = () => {
        if (projectData.contragent_id) {
            getData(
                `${import.meta.env.VITE_API_URL}contragents/${
                    projectData.contragent_id
                }/contracts`
            ).then((response) => {
                if (response?.status == 200) {
                    setContracts(response.data);
                }
            });
        } else {
            alert("Необходимо назначить заказчика");
        }
    };

    // Получение отчётов
    const getReports = () => {
        getData(
            `${import.meta.env.VITE_API_URL}projects/${projectId}/reports`
        ).then((response) => {
            if (response?.status == 200) {
                setReports(response.data);
            }
        });
    };

    // Получение команды проекта
    const getTeam = () => {
        getData(
            `${import.meta.env.VITE_API_URL}projects/${projectId}/team`
        ).then((response) => {
            if (response.status == 200) {
                setTeamData(response.data.team);
            }
        });
    };

    // Получение услуг проекта
    const getServices = () => {
        getData(
            `${import.meta.env.VITE_API_URL}reports/${projectId}/services`
        ).then((response) => {
            if (response?.status == 200) {
                setServices(response.data);
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

            // Получаем кредиторов
            setLenders(
                response.data?.creditor_responsible_persons?.flatMap(
                    (item) => item
                ) || []
            );

            setFilteredLenders(
                response.data?.creditor_responsible_persons?.flatMap(
                    (item) => item
                ) || []
            );

            // Получаем ответственные лица заказчика
            setCustomers(response.data?.contragent_responsible_persons || []);

            const tasks = [
                fetchIndustries(),
                fetchContragents(),
                fetchBanks(),
                getReports(),
                getTeam(),
                getServices(),
            ];

            if (!firstInit) {
                tasks.push(handleUpdate());
            }

            await Promise.all(tasks);

            setIsDataLoaded(true);
            setFirstInit(false);
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

    // Отправляем кредитора и заказчика
    const sendExecutor = (type) => {
        query = toast.loading("Выполняется отправка", {
            containerId: "projectCard",
            position: "top-center",
        });

        if (type === "lender") {
            setNewLender((prev) => {
                const updatedLender = {
                    ...prev,
                    project_id: projectId,
                };
                postData(
                    "POST",
                    `${
                        import.meta.env.VITE_API_URL
                    }responsible-persons/creditor`,
                    updatedLender
                ).then((response) => {
                    if (response?.ok) {
                        getProject(projectId);

                        setNewLender({
                            full_name: "",
                            phone: "",
                            position: "",
                            email: "",
                            creditor_id: 1,
                        });

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
                    }
                });
                return updatedLender;
            });
        } else if (type === "customer") {
            if (projectData?.contragent_id) {
                setNewCustomer((prev) => {
                    const updatedCustomer = {
                        ...prev,
                        project_id: projectId,
                        contragent_id: projectData?.contragent_id,
                    };

                    postData(
                        "POST",
                        `${
                            import.meta.env.VITE_API_URL
                        }responsible-persons/contragent`,
                        updatedCustomer
                    ).then((response) => {
                        if (response?.ok) {
                            if (response?.responsible_person) {
                                setCustomers((prevCustomer) => [
                                    ...prevCustomer,
                                    response.responsible_person,
                                ]);
                            }

                            setNewCustomer({
                                full_name: "",
                                phone: "",
                                position: "",
                                email: "",
                            });

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
                        }
                    });
                    return updatedCustomer;
                });
            } else {
                alert("Необходимо назначить заказчика");
            }
        }
    };

    // Удаление кредитора
    const deleteLender = (id) => {
        postData(
            "DELETE",
            `${import.meta.env.VITE_API_URL}responsible-persons/creditor/${id}`,
            {}
        ).then((response) => {
            if (response?.ok) {
                getProject(projectId);
            }
        });
    };

    // Удаление ответственного лица заказчика
    const deleteCustomer = (id) => {
        postData(
            "DELETE",
            `${
                import.meta.env.VITE_API_URL
            }responsible-persons/contragent/${id}`,
            {}
        ).then((response) => {
            if (response?.ok) {
                setCustomers(customers.filter((item) => item.id !== id));
            }
        });
    };

    // Обновление проекта
    const updateProject = async (id, showMessage = true) => {
        if (projectData?.contragent_id && projectData?.industry_id) {
            query = toast.loading("Обновление", {
                containerId: "projectCard",
                position: "top-center",
            });

            try {
                const response = await postData(
                    "PATCH",
                    `${URL}/${id}`,
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
                return response;
            } catch (error) {
                console.error("Ошибка при обновлении проекта:", error);
                throw error;
            }
        } else {
            toast.error("Необходимо назначить заказчика и отрасль", {
                containerId: "projectCard",
                isLoading: false,
                autoClose: 1500,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                position: "top-center",
            });
        }
    };

    // Открытие окна редактирования отчёта
    const openReportEditor = (id) => {
        setReportId(id);
        if (id) {
            setReportWindowsState(true);
        }
    };

    // Принудительное открытие окна редактирования заключения по отчёту
    // const openSubReportEditor = (id) => {
    //     setReportWindowsState(false);
    //     getData(`${import.meta.env.VITE_API_URL}reports/${id}`).then(
    //         (response) => {
    //             if (response?.status == 200) {
    //                 setReportData(response.data);
    //                 setReportId(id);
    //                 if (id) {
    //                     setReportEditorState(true);
    //                 }
    //             }
    //         }
    //     );
    // };

    // Удаление отчёта
    const deleteReport = (id) => {
        postData(
            "DELETE",
            `${import.meta.env.VITE_API_URL}reports/${id}`,
            {}
        ).then((response) => {
            if (response?.ok) {
                getProject(projectId);
            }
        });
    };

    // Отправка отчёта
    const sendReport = (data) => {
        if (data.budget_in_billions) {
            data.budget_in_billions = data.budget_in_billions.replace(",", ".");
        }

        data.report_period = `${formatDate(
            data.report_period.start
        )} - ${formatDate(data.report_period.end)}`;
        data.implementation_period = `${formatDate(
            data.implementation_period.start
        )} - ${formatDate(data.implementation_period.end)}`;
        data.execution_start_date = formatDate(data.execution_period.start);
        data.execution_end_date = formatDate(data.execution_period.end);
        data.approval_date = formatDate(data.approval_date);

        data.project_id = projectId;

        // setReportData(data);

        // if (!addReport) {
        query = toast.loading("Выполняется отправка", {
            containerId: "projectCard",
            position: "top-center",
        });

        postData("POST", `${import.meta.env.VITE_API_URL}reports`, data)
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
                    setReports((prevReports) => [
                        ...prevReports,
                        response.data,
                    ]);
                    setReportWindowsState(false);
                    getProject(projectId);
                } else {
                    toast.dismiss(query);
                    toast.error("Ошибка при отправке отчёта", {
                        isLoading: false,
                        autoClose: 1500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position: "top-center",
                        containerId: "projectCard",
                    });
                    setReportWindowsState(false);
                }
            })
            .catch((error) => {
                toast.dismiss(query);
                toast.error(error.message || "Ошибка при отправке отчёта", {
                    containerId: "projectCard",
                    isLoading: false,
                    autoClose: 5000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                });
            });
        // } else {
        //     if (Object.keys(data).length > 0) {
        //         setReportWindowsState(false);
        //         // setReportEditorState(true);
        //     }
        // }
    };

    // Обновление отчёта
    const updateReport = (data, reportId) => {
        if (data.budget_in_billions) {
            data.budget_in_billions = data.budget_in_billions.replace(",", ".");
        }

        data.report_period = `${formatDate(
            data.report_period.start
        )} - ${formatDate(data.report_period.end)}`;
        data.implementation_period = `${formatDate(
            data.implementation_period.start
        )} - ${formatDate(data.implementation_period.end)}`;
        data.execution_start_date = formatDate(data.execution_period.start);
        data.execution_end_date = formatDate(data.execution_period.end);
        data.approval_date = formatDate(data.approval_date);

        data.project_id = projectId;

        // setReportData(data);

        // if (!addReport) {
        if (mode === "read") return;

        query = toast.loading("Обновление", {
            containerId: "projectCard",
            position: "top-center",
        });

        postData(
            "PATCH",
            `${import.meta.env.VITE_API_URL}reports/${reportId}`,
            data
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
                    setReportWindowsState(false);
                    getProject(projectId);
                } else {
                    setReportWindowsState(false);
                }
            })
            .catch((error) => {
                toast.dismiss(query);
                toast.error(error.message || "Ошибка обновления отчета", {
                    containerId: "projectCard",
                    isLoading: false,
                    autoClose: 5000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                });
            });
        // } else {
        //     if (Object.keys(data).length > 0) {
        //         setReportWindowsState(false);
        //         setReportEditorState(true);
        //     }
        // }
    };

    useEffect(() => {
        if (projectId) {
            getProject(projectId);
        }
    }, []);

    useEffect(() => {
        if (projectData.creditors) {
            setFormFields((prev) => ({
                ...prev,
                creditors: projectData.creditors.map((bank) => bank.id),
            }));
        }
    }, [projectData.creditors]);

    useEffect(() => {
        if (projectData.contragent_id) {
            fetchContracts();
        } else {
            setReportWindowsState(false);
        }
    }, [projectData.contragent_id]);

    useEffect(() => {
        setAddLender(false);
        setAddCustomer(false);
        setReportWindowsState(false);
        // setReportEditorState(false);
        setReportId(null);
    }, [mode]);

    useEffect(() => {
        const report = searchParams.get("report");
        // const withConclusion = searchParams.get("with_conclusion");

        if (report !== null && report !== "undefined") {
            // if (withConclusion === "true") {
            //     openSubReportEditor(report);
            // } else {
            openReportEditor(report);
            // }
        }
    }, [searchParams]);

    return (
        <main className="page">
            <div className="new-project pt-8 pb-15">
                <div className="container">
                    <ToastContainer containerId="projectCard" />

                    <div className="flex justify-between items-center gap-10">
                        <div className="flex items-center gap-3 flex-grow">
                            <div className="flex flex-col gap-3 w-full">
                                <input
                                    type="text"
                                    className="text-3xl font-medium"
                                    name="name"
                                    value={projectData?.name}
                                    onChange={(e) =>
                                        handleInputChange(e, "name")
                                    }
                                    disabled={mode == "read"}
                                />

                                <span
                                    className={`
                                            whitespace-nowrap 
                                                ${
                                                    projectData?.status ===
                                                    "active"
                                                        ? "text-green-500"
                                                        : projectData?.status ===
                                                          "completed"
                                                        ? "text-black"
                                                        : "text-gray-300"
                                                }
                                        `}
                                >
                                    {handleStatus(projectData?.status)}
                                </span>
                            </div>

                            {mode === "edit" &&
                                projectData?.name?.length > 2 && (
                                    <button
                                        type="button"
                                        className="update-icon"
                                        title="Обновить данные проекта"
                                        onClick={() => updateProject(projectId)}
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
                                    checked={mode === "read" ? true : false}
                                />
                                <label htmlFor="read_mode">Чтение</label>
                            </div>

                            <div>
                                <input
                                    type="radio"
                                    name="mode"
                                    id="edit_mode"
                                    onChange={() => setMode("edit")}
                                    checked={mode === "edit" ? true : false}
                                />
                                <label htmlFor="edit_mode">
                                    Редактирование
                                </label>
                            </div>
                        </nav>
                    </div>

                    <div className="new-project__wrapper mt-15">
                        <div>
                            <div className="grid gap-[20px] grid-cols-2">
                                <div className="flex flex-col">
                                    <div className="flex items-start justify-between gap-6 mb-10">
                                        <div className="flex flex-col gap-3 min-w-[130px]">
                                            <span className="text-gray-400">
                                                Бюджет проекта
                                            </span>

                                            <ProjectBudget
                                                projectData={projectData}
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2 flex-shrink-0 flex-grow min-w-[200px] max-w-[200px] 2xl:min-w-[300px] 2xl:max-w-[300px]">
                                            <span className="flex items-center gap-2 text-gray-400">
                                                Заказчик{" "}
                                                <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                    ?
                                                </span>
                                            </span>
                                            <div className="border-2 border-gray-300 p-5">
                                                <select
                                                    className="w-full h-[21px]"
                                                    value={
                                                        projectData?.contragent_id ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            e,
                                                            "contragent_id"
                                                        )
                                                    }
                                                    disabled={
                                                        mode == "read"
                                                            ? true
                                                            : false
                                                    }
                                                >
                                                    <option value="">
                                                        Выбрать заказчика
                                                    </option>
                                                    {contragents.length > 0 &&
                                                        contragents.map(
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
                                                                        item.program_name
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start justify-between gap-6 mb-10">
                                        <div className="flex flex-col gap-3 min-w-[130px] ">
                                            <span className="text-gray-400">
                                                Срок реализации
                                            </span>

                                            <ProjectImplementationPeriod
                                                projectData={projectData}
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2 flex-shrink-0 flex-grow min-w-[200px] max-w-[200px] 2xl:min-w-[300px] 2xl:max-w-[300px]">
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
                                                        setFormFields({
                                                            ...formFields,
                                                            industry_id:
                                                                e.target.value,
                                                        });
                                                        setProjectData({
                                                            ...projectData,
                                                            industry_id:
                                                                e.target.value,
                                                        });
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
                                                    {industries.length > 0 &&
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
                                                                    {item.name}
                                                                </option>
                                                            )
                                                        )}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span className="flex items-center gap-2 text-gray-400">
                                        Услуги{" "}
                                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                            ?
                                        </span>
                                    </span>

                                    <ReportServices services={services} />
                                </div>
                            </div>

                            <div className="grid gap-[20px] grid-cols-2 mb-5">
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray-400">
                                        Местоположение
                                    </span>
                                    <input
                                        className="border-2 border-gray-300 py-1 px-5"
                                        type="text"
                                        disabled={mode == "read"}
                                        value={projectData?.location || ""}
                                        onChange={(e) =>
                                            handleInputChange(e, "location")
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid gap-[20px] grid-cols-2 mb-5">
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray-400">ТЭП</span>
                                    <input
                                        className="border-2 border-gray-300 py-1 px-5"
                                        type="text"
                                        disabled={mode == "read"}
                                        value={projectData?.tep || ""}
                                        onChange={(e) =>
                                            handleInputChange(e, "tep")
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid gap-[20px] grid-cols-2 mb-5">
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray-400">
                                        Краткое описание
                                    </span>
                                    <textarea
                                        className="border-2 border-gray-300 p-5 min-h-[300px] max-h-[400px]"
                                        placeholder="Заполните описание проекта"
                                        type="text"
                                        name="description"
                                        disabled={mode == "read"}
                                        value={projectData?.description || ""}
                                        onChange={(e) =>
                                            handleInputChange(e, "description")
                                        }
                                    />
                                </div>

                                <ProjectTeam teamData={teamData} />
                            </div>

                            <div className="grid gap-[20px] grid-cols-2 items-start">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">
                                            Ключевые лица Заказчика
                                        </span>
                                        {mode == "edit" && (
                                            <button
                                                type="button"
                                                className="add-button"
                                                onClick={() => {
                                                    if (
                                                        projectData?.contragent_id
                                                    ) {
                                                        if (!addCustomer) {
                                                            setAddCustomer(
                                                                true
                                                            );
                                                        }
                                                    } else {
                                                        alert(
                                                            "Необходимо назначить заказчика"
                                                        );
                                                    }
                                                }}
                                                title="Добавить ключевое лицо Заказчика"
                                            >
                                                <span></span>
                                            </button>
                                        )}
                                    </div>

                                    <ul className="mt-[55px] flex flex-col gap-4 items-start overflow-y-auto h-[205px]">
                                        {addCustomer && (
                                            <EmptyExecutorBlock
                                                borderClass={"border-gray-300"}
                                                type={"customer"}
                                                data={newCustomer}
                                                removeBlock={() =>
                                                    setAddCustomer(false)
                                                }
                                                handleNewExecutor={
                                                    handleNewExecutor
                                                }
                                                sendExecutor={sendExecutor}
                                            />
                                        )}

                                        {customers.length > 0 ? (
                                            customers.map((customer) => (
                                                <ExecutorBlock
                                                    key={customer.id}
                                                    contanct={customer}
                                                    mode={mode}
                                                    type={"customer"}
                                                    deleteBlock={deleteCustomer}
                                                    handleChange={handleChange}
                                                />
                                            ))
                                        ) : (
                                            <li>
                                                <p>Нет данных</p>
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">
                                            Кредиторы
                                        </span>
                                        {mode == "edit" && (
                                            <button
                                                type="button"
                                                className="add-button"
                                                onClick={() => {
                                                    if (!addLender) {
                                                        setAddLender(true);
                                                    }
                                                }}
                                                title="Добавить Кредитора"
                                            >
                                                <span></span>
                                            </button>
                                        )}
                                    </div>

                                    <ul className="flex gap-3 flex-wrap mb-2">
                                        {matchedBanks.length > 0 && (
                                            <>
                                                <li className="radio-field_tab">
                                                    <input
                                                        type="radio"
                                                        name="active_bank"
                                                        id="bank_all"
                                                        value=""
                                                        defaultChecked
                                                        onChange={(evt) => {
                                                            handleFilterLenders(
                                                                evt
                                                            );
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor="bank_all"
                                                        className="text-gray-700 py-1 px-2 text-center rounded-md"
                                                    >
                                                        Все банки
                                                    </label>
                                                </li>
                                                {matchedBanks.map((bank) => (
                                                    <li
                                                        key={bank.id}
                                                        className="radio-field_tab"
                                                    >
                                                        <input
                                                            id={`bank_${bank.id}`}
                                                            type="radio"
                                                            name="active_bank"
                                                            value={bank.id}
                                                            onChange={(evt) => {
                                                                handleFilterLenders(
                                                                    evt
                                                                );
                                                            }}
                                                        />
                                                        <label
                                                            htmlFor={`bank_${bank.id}`}
                                                            className="text-gray-700 py-1 px-2 text-center rounded-md"
                                                        >
                                                            {bank.name}
                                                        </label>
                                                    </li>
                                                ))}{" "}
                                            </>
                                        )}
                                    </ul>

                                    <ul className="mt-[10px] flex flex-col gap-4 items-start overflow-y-auto h-[270px]">
                                        {addLender && (
                                            <EmptyExecutorBlock
                                                borderClass={"border-gray-300"}
                                                banks={banks}
                                                data={newLender}
                                                type={"lender"}
                                                removeBlock={() =>
                                                    setAddLender(false)
                                                }
                                                handleNewExecutor={
                                                    handleNewExecutor
                                                }
                                                sendExecutor={sendExecutor}
                                            />
                                        )}

                                        {filteredLenders.length > 0 &&
                                        banks.length > 0 ? (
                                            filteredLenders.map((lender) => (
                                                <ExecutorBlock
                                                    key={lender.id}
                                                    contanct={lender}
                                                    mode={mode}
                                                    banks={banks}
                                                    type={"lender"}
                                                    deleteBlock={deleteLender}
                                                    handleChange={handleChange}
                                                />
                                            ))
                                        ) : (
                                            <li>
                                                <p>Нет данных</p>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            {/* {reportEditorState ? (
                                <ProjectReportEditor
                                    reportData={reportData}
                                    postData={postData}
                                    setReports={setReports}
                                    reportEditorName={reportEditorName}
                                    setReportWindowsState={
                                        setReportWindowsState
                                    }
                                    setReportEditorState={setReportEditorState}
                                    reportId={reportId}
                                    projectId={projectId}
                                    setReportId={setReportId}
                                    getProject={getProject}
                                    mode={mode}
                                />
                            ) : ( */}

                            <ProjectStatisticsBlock
                                ref={statRef}
                                projectId={projectId}
                            />

                            <div className="flex flex-col gap-2 flex-grow">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">
                                        История проекта
                                    </span>

                                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                        ?
                                    </span>
                                    {mode == "edit" && (
                                        <button
                                            type="button"
                                            className="add-button"
                                            onClick={() =>
                                                setReportWindowsState(true)
                                            }
                                            disabled={
                                                projectData.contragent_id
                                                    ? false
                                                    : true
                                            }
                                            title={
                                                projectData.contragent_id
                                                    ? "Открыть конструктор отчёта"
                                                    : "Необходимо назначить заказчика"
                                            }
                                        >
                                            <span></span>
                                        </button>
                                    )}
                                </div>

                                <div className="relative border-2 border-gray-300 py-3 px-4 min-h-full flex-grow max-h-[300px] overflow-x-hidden overflow-y-auto">
                                    <nav className="flex items-center gap-10 border-b border-gray-300 text-base mb-5">
                                        <button
                                            type="button"
                                            className={`py-2 transition-all border-b-2 ${
                                                activeReportTab ==
                                                "projectReports"
                                                    ? "border-gray-500"
                                                    : "border-transparent"
                                            }`}
                                            onClick={() =>
                                                setActiveReportTab(
                                                    "projectReports"
                                                )
                                            }
                                            title="Перейти на вкладку Отчёты проекта"
                                        >
                                            Отчёты проекта
                                        </button>
                                        <button
                                            type="button"
                                            className={`py-2 transition-all border-b-2 ${
                                                activeReportTab ==
                                                "managementReports"
                                                    ? "border-gray-500"
                                                    : "border-transparent"
                                            }`}
                                            onClick={() =>
                                                setActiveReportTab(
                                                    "managementReports"
                                                )
                                            }
                                            title="Перейти на вкладку Отчёты руководителя проекта"
                                        >
                                            Отчёты руководителя проекта
                                        </button>
                                    </nav>

                                    {!reportWindowsState ? (
                                        <ul className="grid gap-3">
                                            {!isDataLoaded && <Loader />}

                                            <li className="grid items-center grid-cols-[33%_20%_33%_1fr] gap-3 mb-2 text-gray-400">
                                                <span>Отчет</span>
                                                <span>Статус</span>
                                                <span>Период выполнения</span>
                                            </li>

                                            {reports.length > 0 &&
                                                reports.map((report, index) => (
                                                    <ProjectReportItem
                                                        key={report.id || index}
                                                        {...report}
                                                        // setReportEditorState={
                                                        //     setReportEditorState
                                                        // }
                                                        // setReportEditorName={
                                                        //     setReportEditorName
                                                        // }
                                                        deleteReport={
                                                            deleteReport
                                                        }
                                                        openReportEditor={
                                                            openReportEditor
                                                        }
                                                        // openSubReportEditor={
                                                        //     openSubReportEditor
                                                        // }
                                                        mode={mode}
                                                    />
                                                ))}
                                        </ul>
                                    ) : (
                                        <ProjectReportWindow
                                            reportWindowsState={
                                                setReportWindowsState
                                            }
                                            sendReport={sendReport}
                                            contracts={contracts}
                                            updateReport={updateReport}
                                            reportId={reportId}
                                            setReportId={setReportId}
                                            mode={mode}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
export default ProjectCard;
