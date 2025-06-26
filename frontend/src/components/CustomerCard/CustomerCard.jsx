import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import getData from "../../utils/getData";
import postData from "../../utils/postData";
import handleStatus from "../../utils/handleStatus";

import { ToastContainer, toast } from "react-toastify";

import CustomerProjectItem from "./CustomerProjectItem";
import FilledExecutorBlock from "../ExecutorBlock/FilledExecutorBlock";
import ProjectReportEditor from "../ProjectCard/ProjectReportEditor";
import ProjectReportWindow from "../ProjectCard/ProjectReportWindow";
import CardReportsListItem from "../CardReportsListItem";
import CustomerStatisticBlock from "./CustomerStatisticBlock";

import "react-toastify/dist/ReactToastify.css";

const CustomerCard = () => {
    const URL = `${import.meta.env.VITE_API_URL}contragents`;
    const { contragentId } = useParams();
    const navigate = useNavigate();

    const [customerData, setEmployeeData] = useState({});
    const [formFields, setFormFields] = useState({});
    const [mode, setMode] = useState("read");
    const [activeReportTab, setActiveReportTab] = useState("projectReports");

    const [reports, setReports] = useState([]); // История проекта
    const [projects, setProjects] = useState([]); // Проекты

    const [projectData, setProjectData] = useState({
        id: "",
        name: "",
        industry: "",
    }); // Данные проекта для отображения в колонке отчетов
    const [responsiblePersons, setResponsiblePersons] = useState([]); // Ключевые лица Заказчика
    const [reportWindowsState, setReportWindowsState] = useState(false); // Конструктор отчёта
    const [reportEditorState, setReportEditorState] = useState(false); // Конструктор заключения по отчёту
    const [reportEditorName, setReportEditorName] = useState(""); // Имя отчета в заключении
    const [reportId, setReportId] = useState(null);
    const [contracts, setContracts] = useState([]);
    const [reportData, setReportData] = useState({});

    let query;

    const handleInputChange = (e, name) => {
        setFormFields((prev) => ({ ...prev, [name]: e.target.value }));
        setEmployeeData((prev) => ({ ...prev, [name]: e.target.value }));
    };

    // Получаем данные заказчика и его проекты
    const fetchData = () => {
        getData(`${URL}/${contragentId}`, {
            Accept: "application/json",
        })
            .then((response) => {
                if (response.status == 200) {
                    setEmployeeData(response.data);
                    setProjects(response.data.projects);
                }
            })
            .catch((error) => {
                if (error && error.status === 404) {
                    navigate("/not-found", {
                        state: {
                            message: "Заказчик не найден",
                            errorCode: 404,
                            additionalInfo: "",
                        },
                    });
                }
            });
    };

    // Получаем ключевые лица
    const getResponsiblePesons = () => {
        getData(`${URL}/${contragentId}/responsible-persons`, {
            Accept: "application/json",
        }).then((response) => {
            if (response.status == 200) {
                setResponsiblePersons(response.data);
            }
        });
    };

    // Получаем отчеты по выбранному проекту
    const getReports = (id) => {
        setReportWindowsState(false);
        setReportEditorState(false);
        setReportEditorName("");

        const targetProject = projects.find((project) => project.id === id);

        if (targetProject && targetProject.reports?.length > 0) {
            setReports(targetProject.reports);
        }
    };

    // Получение договоров
    const getContracts = () => {
        getData(
            `${
                import.meta.env.VITE_API_URL
            }contragents/${contragentId}/contracts`
        ).then((response) => {
            if (response?.status == 200) {
                setContracts(response.data);
            }
        });
    };

    // Обновление контрагента
    const updateData = (showMessage = true) => {
        query = toast.loading("Обновление", {
            containerId: "customer",
            position: "top-center",
        });

        postData("PATCH", `${URL}/${contragentId}`, formFields)
            .then((response) => {
                if (response?.ok && showMessage) {
                    toast.update(query, {
                        render: "Данные обновлены",
                        type: "success",
                        containerId: "customer",
                        isLoading: false,
                        autoClose: 1200,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position: "top-center",
                    });
                } else {
                    toast.dismiss(query);
                    toast.error("Ошибка обновления данных", {
                        containerId: "customer",
                        isLoading: false,
                        autoClose: 1500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position: "top-center",
                    });
                }
            })
            .catch(() => {
                toast.dismiss(query);
                toast.error("Ошибка обновления данных", {
                    containerId: "customer",
                    isLoading: false,
                    autoClose: 1500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                });
            });
    };

    // Открытие окна отчёта
    const openReportEditor = (id) => {
        setReportId(id);
        if (id) {
            setReportWindowsState(true);
        }
    };

    // Обновляем отчет для открытия заключения
    const openReportConclusion = (data) => {
        data.project_id = projectData.id;

        setReportData(data);

        if (Object.keys(data).length > 0) {
            setReportWindowsState(false);
            setReportEditorState(true);
        }
    };

    // Принудительное открытие окна редактирования заключения по отчёту
    const openSubReportEditor = (id) => {
        setReportWindowsState(false);
        getData(`${import.meta.env.VITE_API_URL}reports/${id}`).then(
            (response) => {
                if (response?.status == 200) {
                    setReportData(response.data);
                    setReportId(id);
                    if (id) {
                        setReportEditorState(true);
                    }
                }
            }
        );
    };

    useEffect(() => {
        if (contragentId) {
            fetchData();
            getResponsiblePesons();
            getContracts();
        }
    }, []);

    return (
        <main className="page">
            <div className="pt-8 pb-15">
                <div
                    className="container flex flex-col min-h-full"
                    style={{ minHeight: "calc(100vh - 215px)" }}
                >
                    <ToastContainer containerId="customer" />

                    <div className="flex justify-between items-center gap-10">
                        <div className="flex items-center gap-3 justify-between flex-grow">
                            <div className="flex items-center gap-10">
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl font-medium w-full">
                                        {customerData?.program_name}
                                    </div>

                                    <span
                                        className={`
                                            whitespace-nowrap 
                                                ${
                                                    customerData?.status ===
                                                    "active"
                                                        ? "text-green-500"
                                                        : customerData?.status ===
                                                          "completed"
                                                        ? "text-black"
                                                        : "text-gray-300"
                                                }
                                        `}
                                    >
                                        {handleStatus(customerData?.status)}
                                    </span>
                                </div>
                            </div>

                            {mode === "edit" && (
                                <button
                                    type="button"
                                    className="update-icon"
                                    title="Обновить данные сотрудника"
                                    onClick={() => {
                                        updateData();
                                    }}
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

                    <div className="grid grid-cols-3 mt-15 gap-10 flex-grow">
                        <div className="flex flex-col">
                            <div className="grid gap-5 mb-5">
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray-400">
                                        Адрес центрального офиса
                                    </span>
                                    <textarea
                                        className="border-2 border-gray-300 p-5 h-[100px]"
                                        style={{ resize: "none" }}
                                        placeholder="Заполните адрес центрального офиса"
                                        type="text"
                                        onChange={(e) =>
                                            handleInputChange(
                                                e,
                                                "head_office_address"
                                            )
                                        }
                                        value={
                                            customerData?.head_office_address ||
                                            ""
                                        }
                                        disabled={mode == "read"}
                                    ></textarea>
                                </div>

                                <div className="flex flex-col gap-2 justify-between">
                                    <span className="text-gray-400">
                                        Сайт компании
                                    </span>
                                    <div className="border-2 border-gray-300 py-1 px-5 min-h-[32px]">
                                        <input
                                            className="w-full"
                                            type="text"
                                            placeholder="Введите адрес сайта компании"
                                            value={
                                                customerData?.company_website
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    e,
                                                    "company_website"
                                                )
                                            }
                                            disabled={
                                                mode == "read" ? true : false
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 flex-grow">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">
                                        Ключевые лица Заказчика
                                    </span>
                                </div>

                                <div className="border-2 border-gray-300 py-5 px-3 min-h-full flex-grow max-h-[300px] overflow-x-hidden overflow-y-auto">
                                    <ul className="grid gap-5">
                                        {responsiblePersons.length > 0 &&
                                            responsiblePersons.map((person) => (
                                                <FilledExecutorBlock
                                                    key={person.id}
                                                    contanct={person}
                                                />
                                            ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex flex-col gap-2 mb-5">
                                <span className="text-gray-400">
                                    Краткое описание
                                </span>
                                <textarea
                                    className="border-2 border-gray-300 p-5 min-h-[170px] max-h-[170px]"
                                    style={{ resize: "none" }}
                                    placeholder="Заполните описание"
                                    type="text"
                                    disabled={mode == "read"}
                                    value={
                                        customerData?.description_short || ""
                                    }
                                    onChange={(e) =>
                                        handleInputChange(
                                            e,
                                            "description_short"
                                        )
                                    }
                                />
                            </div>

                            <div className="flex flex-col gap-2 flex-grow">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">
                                        Проекты ({projects.length})
                                    </span>
                                </div>
                                <div className="border-2 border-gray-300 py-5 px-2 min-h-full flex-grow max-h-[300px] overflow-x-hidden overflow-y-auto">
                                    <ul className="grid gap-5">
                                        <li className="grid items-center grid-cols-[1fr_20%_1fr] gap-3 text-gray-400 px-2">
                                            <span>Проект</span>
                                            <span>Бюджет</span>
                                            <span>Период реализации</span>
                                        </li>

                                        {projects.length > 0 &&
                                            projects.map((project) => (
                                                <CustomerProjectItem
                                                    key={project.id}
                                                    {...project}
                                                    setProjectData={
                                                        setProjectData
                                                    }
                                                    projectData={projectData}
                                                    getReports={getReports}
                                                />
                                            ))}
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
                                    projectId={projectData.id}
                                    setReportId={setReportId}
                                    mode={"read"}
                                />
                            ) : (
                                <>
                                    <CustomerStatisticBlock
                                        contragentId={contragentId}
                                    />

                                    <div className="flex flex-col gap-2 flex-grow">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400">
                                                История проекта
                                            </span>
                                        </div>

                                        <div className="border-2 border-gray-300 py-5 px-4 min-h-full flex-grow max-h-[300px] overflow-x-hidden overflow-y-auto">
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
                                                    <li className="grid items-center grid-cols-[1fr_1fr_18%_34%] gap-3 mb-2 text-gray-400">
                                                        <span>Проект</span>
                                                        <span>Отчет</span>
                                                        <span className="block text-center">
                                                            Статус
                                                        </span>
                                                        <span>
                                                            Период выполнения
                                                        </span>
                                                    </li>

                                                    {reports.length > 0 &&
                                                        reports.map(
                                                            (report, index) => (
                                                                <CardReportsListItem
                                                                    key={
                                                                        report.id ||
                                                                        index
                                                                    }
                                                                    {...report}
                                                                    projectData={
                                                                        projectData
                                                                    }
                                                                    setReportEditorState={
                                                                        setReportEditorState
                                                                    }
                                                                    setReportEditorName={
                                                                        setReportEditorName
                                                                    }
                                                                    openReportEditor={
                                                                        openReportEditor
                                                                    }
                                                                    openSubReportEditor={
                                                                        openSubReportEditor
                                                                    }
                                                                    mode={
                                                                        "read"
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                </ul>
                                            ) : (
                                                <ProjectReportWindow
                                                    reportWindowsState={
                                                        setReportWindowsState
                                                    }
                                                    contracts={contracts}
                                                    updateReport={
                                                        openReportConclusion
                                                    }
                                                    reportId={reportId}
                                                    setReportId={setReportId}
                                                    mode={"read"}
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

export default CustomerCard;
