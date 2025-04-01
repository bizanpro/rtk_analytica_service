import { useState, useCallback, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";

import ExecutorBlock from "../ExecutorBlock/ExecutorBlock";
import EmptyExecutorBlock from "../ExecutorBlock/EmptyExecutorBlock";
import ProjectReportWindow from "./ProjectReportWindow";
import ProjectReportItem from "./ProjectReportItem";
import ProjectReportEditor from "./ProjectReportEditor";
import ProjectStatisticsBlock from "./ProjectStatisticsBlock";
import ProjectLastReport from "./ProjectLastReport";
import ReportServices from "./ReportServices";
import ProjectImplementationPeriod from "./ProjectImplementationPeriod";
import ProjectBudget from "./ProjectBudget";

import "./ProjectCard.scss";
import "react-datepicker/dist/react-datepicker.css";

const ProjectCard = () => {
    const URL = `${import.meta.env.VITE_API_URL}projects`;
    const location = useLocation();
    const { projectId } = useParams();

    const [projectData, setProjectData] = useState({});
    const [formFields, setFormFields] = useState({});

    const [mode, setMode] = useState(location.state?.mode);

    const [industries, setIndustries] = useState([]);
    const [contragents, setContragents] = useState([]);
    const [banks, setBanks] = useState([]);
    const [contracts, setContracts] = useState([]);

    const [lenders, setLenders] = useState([]);
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

    const [reportWindowsState, setReportWindowsState] = useState(false);
    const [reportEditorState, setReportEditorState] = useState(false);
    const [reportEditorName, setReportEditorName] = useState("");
    const [reportData, setReportData] = useState({});
    const [reportId, setReportId] = useState(null);
    const [lastReport, setLastReport] = useState({});

    // Форматирование даты
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("ru-RU");
    };

    // Обработка ввода данных проекта
    const handleInputChange = useCallback((e, name) => {
        setFormFields((prev) => ({ ...prev, [name]: e.target.value }));
        setProjectData((prev) => ({ ...prev, [name]: e.target.value }));
    }, []);

    // Обработка привязки банков к проекту
    const handleBankChange = (e, index) => {
        const selectedId = e.target.value ? +e.target.value : null;

        setFormFields((prev) => {
            const updatedBanks = prev.creditors ? [...prev.creditors] : [];

            if (selectedId === null) {
                updatedBanks.splice(index, 1);
            } else {
                updatedBanks[index] = selectedId;
            }

            return { ...prev, creditors: updatedBanks.filter((id) => id) };
        });

        setProjectData((prev) => {
            let updatedCreditors = [...prev.creditors];

            if (selectedId === null) {
                updatedCreditors.splice(index, 1);
            } else {
                const selectedBank = banks.find(
                    (bank) => bank.id === selectedId
                );
                if (selectedBank) {
                    updatedCreditors[index] = {
                        id: selectedBank.id,
                        name: selectedBank.name,
                    };
                }
            }

            return {
                ...prev,
                creditors: updatedCreditors.filter((bank) => bank?.id),
            };
        });
    };

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
    const fetchIndustries = async () => {
        const response = await getData(
            `${import.meta.env.VITE_API_URL}industries`,
            {
                Accept: "application/json",
            }
        );
        setIndustries(response.data.data);
    };

    // Получение заказчика
    const fetchContragents = async () => {
        const response = await getData(
            `${import.meta.env.VITE_API_URL}contragents`,
            {
                Accept: "application/json",
            }
        );
        setContragents(response.data);
    };

    // Получение банков
    const fetchBanks = async () => {
        const response = await getData(`${import.meta.env.VITE_API_URL}banks`);
        setBanks(response.data.data);
    };

    // Получение договоров
    const fetchContracts = async () => {
        if (projectData.contragent_id) {
            const response = await getData(
                `${import.meta.env.VITE_API_URL}contragents/${
                    projectData.contragent_id
                }/contracts`
            );
            setContracts(response.data);
        } else {
            alert("Необходимо назначить заказчика");
        }
    };

    // Получение отчётов
    const getReports = async () => {
        const response = await getData(
            `${import.meta.env.VITE_API_URL}projects/${projectId}/reports`
        );
        setReports(response.data);
    };

    // Получение проекта
    const getProject = async (id) => {
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

            // Получаем ответственные лица заказчика
            setCustomers(response.data?.contragent_responsible_persons || []);

            await Promise.all([
                fetchIndustries(),
                fetchContragents(),
                fetchBanks(),
                getReports(),
            ]);
        } catch (error) {
            console.error("Ошибка при загрузке проекта:", error);
        }
    };

    // Отправляем кредитора и заказчика
    const sendExecutor = (type) => {
        updateProject(projectId, false).then(() => {
            if (type === "lender") {
                if (projectData.creditors?.length > 0) {
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
                                if (response?.responsible_person) {
                                    setLenders((prevLenders) => [
                                        ...prevLenders,
                                        response.responsible_person,
                                    ]);
                                }

                                setNewLender({
                                    full_name: "",
                                    phone: "",
                                    position: "",
                                    email: "",
                                    creditor_id: 1,
                                });

                                alert(response.message);
                            }
                        });
                        return updatedLender;
                    });
                } else {
                    alert("Необходимо назначить банк");
                }
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

                                alert(response.message);
                            }
                        });
                        return updatedCustomer;
                    });
                } else {
                    alert("Необходимо назначить заказчика");
                }
            }
        });
    };

    // Удаление кредитора
    const deleteLender = (id) => {
        postData(
            "DELETE",
            `${import.meta.env.VITE_API_URL}responsible-persons/creditor/${id}`,
            {}
        ).then((response) => {
            if (response?.ok) {
                setLenders(lenders.filter((item) => item.id !== id));
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
        try {
            const response = await postData(
                "PATCH",
                `${URL}/${id}`,
                formFields
            );
            if (response?.ok && showMessage) {
                alert("Проект успешно обновлен");
            }
            return response;
        } catch (error) {
            console.error("Ошибка при обновлении проекта:", error);
            throw error;
        }
    };

    // Открытие окна редактирования отчёта
    const openReportEditor = (id) => {
        setReportId(id);
        if (id) {
            setReportWindowsState(true);
        }
    };

    // Удаление отчёта
    const deleteReport = (id) => {
        postData(
            "DELETE",
            `${import.meta.env.VITE_API_URL}reports/${id}`,
            {}
        ).then((response) => {
            if (response?.ok) {
                // setReports(reports.filter((report) => report.id !== id));
                getProject(projectId);
            }
        });
    };

    // Отправка отчёта
    const sendReport = (data, addReport) => {
        data.report_period = `${formatDate(
            data.report_period.start
        )} - ${formatDate(data.report_period.end)}`;
        data.implementation_period = `${formatDate(
            data.implementation_period.start
        )} - ${formatDate(data.implementation_period.end)}`;
        data.execution_period = data.execution_period.end
            ? `${formatDate(data.execution_period.start)} - ${formatDate(
                  data.execution_period.end
              )}`
            : formatDate(data.execution_period.start);

        data.project_id = projectId;

        setReportData(data);

        if (!addReport) {
            postData(
                "POST",
                `${import.meta.env.VITE_API_URL}reports`,
                data
            ).then((response) => {
                if (response?.ok) {
                    alert(response.message);
                    setReports((prevReports) => [
                        ...prevReports,
                        response.data,
                    ]);
                    setReportWindowsState(false);
                    getProject(projectId);
                } else {
                    alert("Ошибка при отправке отчёта");
                }
            });
        } else {
            if (Object.keys(data).length > 0) {
                setReportWindowsState(false);
                setReportEditorState(true);
            }
        }
    };

    // Обновление отчёта
    const updateReport = (data, reportId, addReport) => {
        data.report_period = `${formatDate(
            data.report_period.start
        )} - ${formatDate(data.report_period.end)}`;
        data.implementation_period = `${formatDate(
            data.implementation_period.start
        )} - ${formatDate(data.implementation_period.end)}`;
        data.execution_period = `${formatDate(
            data.execution_period.start
        )} - ${formatDate(data.execution_period.end)}`;

        data.project_id = projectId;

        setReportData(data);

        if (!addReport) {
            postData(
                "PATCH",
                `${import.meta.env.VITE_API_URL}reports/${reportId}`,
                data
            ).then((response) => {
                if (response?.ok) {
                    alert(response.message);
                    // getReports();
                    setReportWindowsState(false);
                    getProject(projectId);
                }
            });
        } else {
            if (Object.keys(data).length > 0) {
                setReportWindowsState(false);
                setReportEditorState(true);
            }
        }
    };

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
        if (reports && reports.length > 0) {
            const filteredReports = reports.filter(
                (report) =>
                    report.status === "Завершен" || report.status === "В работе"
            );

            const last = filteredReports.pop();
            setLastReport(last || {});
        }
    }, [reports]);

    useEffect(() => {
        if (!reportWindowsState) {
            setReportId(null);
        }
    }, [reportWindowsState]);

    useEffect(() => {
        if (projectId) {
            getProject(projectId);
        }
    }, []);

    return (
        <main className="page">
            <div className="new-project pt-8 pb-15">
                <div className="container">
                    <div className="flex justify-between items-center gap-10">
                        <div className="flex items-center gap-3 flex-grow">
                            <input
                                type="text"
                                className="text-3xl font-medium w-full"
                                name="name"
                                value={projectData?.name}
                                onChange={(e) => handleInputChange(e, "name")}
                                disabled={mode == "read" ? true : false}
                            />

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
                                        setAddLender(false);
                                        setAddCustomer(false);
                                        setReportWindowsState(false);
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
                            <div className="grid gap-6 grid-cols-[60%_40%]">
                                <div className="flex flex-col">
                                    <div className="flex items-center justify-between gap-6 mb-10">
                                        <div className="flex flex-col gap-3 min-w-[150px] flex-shrink-0">
                                            <span className="text-gray-400">
                                                Бюджет проекта
                                            </span>

                                            <ProjectBudget
                                                projectData={projectData}
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2 flex-grow max-w-[495px]">
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
                                                        projectId
                                                            ? projectData?.contragent_id
                                                            : ""
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

                                    <div className="flex items-center justify-between gap-6 mb-10">
                                        <div className="flex flex-col gap-3 min-w-[150px] flex-shrink-0">
                                            <span className="text-gray-400">
                                                Срок реализации
                                            </span>

                                            <ProjectImplementationPeriod
                                                projectData={projectData}
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2 flex-grow max-w-[495px]">
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
                                                        projectId
                                                            ? projectData?.industry_id
                                                            : ""
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

                                    {reports.length > 0 && (
                                        <ReportServices reports={reports} />
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-6 grid-cols-[60%_40%] mb-5">
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray-400">
                                        Краткое описание
                                    </span>
                                    <textarea
                                        className="border-2 border-gray-300 p-5 min-h-[300px] max-h-[400px]"
                                        placeholder="Заполните описание проекта"
                                        type="text"
                                        name="description"
                                        disabled={mode == "read" ? true : false}
                                        value={
                                            projectId && projectData
                                                ? projectData?.description
                                                : ""
                                        }
                                        onChange={(e) =>
                                            handleInputChange(e, "description")
                                        }
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span className="text-gray-400">
                                        Команда проекта
                                    </span>
                                    {lastReport &&
                                    Object.keys(lastReport).length > 0 ? (
                                        <ProjectLastReport
                                            lastReport={lastReport}
                                        />
                                    ) : (
                                        <div className="grid grid-col-3 gap-3">
                                            <div className="border rounded border-gray-300 border-dashed p-2 w-[33%]"></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-6 grid-cols-[50%_50%]">
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

                                    <ul className="mt-12 grid gap-4">
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
                                            <p>Нет данных</p>
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
                                                    if (
                                                        projectData.creditors
                                                            ?.length > 0
                                                    ) {
                                                        if (!addLender) {
                                                            setAddLender(true);
                                                        }
                                                    } else {
                                                        alert(
                                                            "Необходимо назначить банк"
                                                        );
                                                    }
                                                }}
                                                title="Добавить Кредитора"
                                            >
                                                <span></span>
                                            </button>
                                        )}
                                    </div>

                                    <ul className="flex gap-3 flex-wrap">
                                        {projectData.creditors?.map(
                                            (item, index) => {
                                                const availableBanks =
                                                    banks.filter(
                                                        (bank) =>
                                                            !projectData.creditors?.some(
                                                                (
                                                                    selectedBank,
                                                                    idx
                                                                ) =>
                                                                    selectedBank.id ===
                                                                        bank.id &&
                                                                    idx !==
                                                                        index
                                                            )
                                                    );

                                                return (
                                                    <div
                                                        key={index}
                                                        className="mb-2"
                                                    >
                                                        <select
                                                            className="flex-[0_0_30%] bg-gray-200 py-1 px-2 text-center rounded-md"
                                                            value={
                                                                item.id || ""
                                                            }
                                                            onChange={(e) =>
                                                                handleBankChange(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                            disabled={
                                                                mode === "read"
                                                            }
                                                        >
                                                            <option value="">
                                                                Банк
                                                            </option>
                                                            {availableBanks.map(
                                                                (bank) => (
                                                                    <option
                                                                        value={
                                                                            bank.id
                                                                        }
                                                                        key={
                                                                            bank.id
                                                                        }
                                                                    >
                                                                        {
                                                                            bank.name
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </div>
                                                );
                                            }
                                        )}

                                        {projectData.creditors?.length <
                                            banks.length &&
                                            projectData.creditors[
                                                projectData.creditors?.length -
                                                    1
                                            ]?.id !== "" && (
                                                <div className="mb-2">
                                                    <select
                                                        className={`flex-[0_0_30%] py-1 px-2 text-center rounded-md ${
                                                            mode === "read"
                                                                ? "border border-gray-300 border-dashed"
                                                                : "bg-gray-200"
                                                        }`}
                                                        onChange={(e) =>
                                                            handleBankChange(
                                                                e,
                                                                projectData
                                                                    .creditors
                                                                    .length
                                                            )
                                                        }
                                                        disabled={
                                                            mode === "read"
                                                        }
                                                    >
                                                        <option value="">
                                                            Банк
                                                        </option>
                                                        {banks
                                                            .filter(
                                                                (bank) =>
                                                                    !projectData.creditors.some(
                                                                        (
                                                                            selectedBank
                                                                        ) =>
                                                                            selectedBank.id ===
                                                                            bank.id
                                                                    )
                                                            )
                                                            .map((bank) => (
                                                                <option
                                                                    value={
                                                                        bank.id
                                                                    }
                                                                    key={
                                                                        bank.id
                                                                    }
                                                                >
                                                                    {bank.name}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                            )}
                                    </ul>

                                    <ul className="mt-3.5 grid gap-4">
                                        {addLender && (
                                            <EmptyExecutorBlock
                                                borderClass={"border-gray-300"}
                                                banks={projectData.creditors}
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

                                        {lenders.length > 0 &&
                                        banks.length > 0 ? (
                                            lenders.map((lender) => (
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
                                            <p>Нет данных</p>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            {reportEditorState ? (
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
                                    setReportId={setReportId}
                                />
                            ) : (
                                <>
                                    <ProjectStatisticsBlock />

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
                                                        setReportWindowsState(
                                                            true
                                                        )
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

                                        <div className="border-2 border-gray-300 py-5 px-4 min-h-full flex-grow max-h-[300px] overflow-x-hidden overflow-y-auto">
                                            {!reportWindowsState ? (
                                                <ul className="grid gap-3">
                                                    <li className="grid items-center grid-cols-[24%_24%_49%] gap-3 mb-2 text-gray-400">
                                                        <span>Отчет</span>
                                                        <span>Статус</span>
                                                        <span>
                                                            Период выполнения
                                                        </span>
                                                    </li>

                                                    {reports.length > 0 &&
                                                        reports.map(
                                                            (report, index) => (
                                                                <ProjectReportItem
                                                                    key={
                                                                        report.id ||
                                                                        index
                                                                    }
                                                                    {...report}
                                                                    setReportEditorState={
                                                                        setReportEditorState
                                                                    }
                                                                    setReportEditorName={
                                                                        setReportEditorName
                                                                    }
                                                                    deleteReport={
                                                                        deleteReport
                                                                    }
                                                                    openReportEditor={
                                                                        openReportEditor
                                                                    }
                                                                    mode={mode}
                                                                />
                                                            )
                                                        )}
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
                                                />
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
export default ProjectCard;
