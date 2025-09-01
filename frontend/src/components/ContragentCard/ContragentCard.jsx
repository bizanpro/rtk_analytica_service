import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";
import handleStatus from "../../utils/handleStatus";
import { useOutsideClick } from "../../hooks/useOutsideClick";

import { ToastContainer, toast } from "react-toastify";

import ContragentProjectItem from "./ContragentProjectItem";
import FilledExecutorBlock from "../ExecutorBlock/FilledExecutorBlock";
import ProjectReportWindow from "../ProjectCard/ProjectReportWindow";
import CardReportsListItem from "../CardReportsListItem";
import ContragentStatisticBlock from "./ContragentStatisticBlock";
import ContragentManagementReportsTab from "./ContragentManagementReportsTab";

import "react-toastify/dist/ReactToastify.css";

const ContragentCard = () => {
    const URL = `${import.meta.env.VITE_API_URL}contragents`;
    const { contragentId } = useParams();
    const navigate = useNavigate();

    const [contagentData, setContragentData] = useState({});
    const [contragentDataCustom, setContragentDataCustom] = useState({});
    const [mode, setMode] = useState("read");
    const [activeReportTab, setActiveReportTab] = useState("projectReports");

    const [reports, setReports] = useState([]); // Отчёты проектов
    const [selectedReports, setSelectedReports] = useState([]); // Очёты выбранного проекта
    const [managerReports, setManagerReports] = useState([]); // Отчёты руководителя проектов
    const [selectedManagerReports, setSelectedManagerReports] = useState([]); // Отчёты руководителя выбранного проекта
    const [projects, setProjects] = useState([]); // Проекты

    const [activeProject, setActiveProject] = useState(null); // Выбранный проект

    const [responsiblePersons, setResponsiblePersons] = useState([]); // Ключевые лица Заказчика
    const [selectedResponsiblePersons, setSelectedResponsiblePersons] =
        useState([]); // Ключевые лица Заказчика выбранного проекта
    const [reportWindowsState, setReportWindowsState] = useState(false); // Конструктор отчёта
    const [reportId, setReportId] = useState(null);
    const [contracts, setContracts] = useState([]);

    let query;

    const handleInputChange = (e, name) => {
        setContragentDataCustom((prev) => ({ ...prev, [name]: e.target.value }));
        setContragentData((prev) => ({ ...prev, [name]: e.target.value }));
    };

    // Получение данных заказчика и его проекты
    const fetchData = () => {
        getData(`${URL}/${contragentId}`, {
            Accept: "application/json",
        })
            .then((response) => {
                if (response.status == 200) {
                    setContragentData(response.data);
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

    // Получение ключевых лиц
    const getResponsiblePesons = () => {
        getData(`${URL}/${contragentId}/contacts`, {
            Accept: "application/json",
        }).then((response) => {
            if (response.status == 200) {
                setResponsiblePersons(response.data.data);
                setSelectedResponsiblePersons(response.data.data);
            }
        });
    };

    // Получение списка отчетов
    const getContragentReports = () => {
        getData(`${URL}/${contragentId}/reports`, {
            Accept: "application/json",
        }).then((response) => {
            if (response.status == 200) {
                setReports(response.data);
                setSelectedReports(response.data);
            }
        });
    };

    // Получение списка отчетов руководителя
    const getProjectsManagerReports = () => {
        getData(`${URL}/${contragentId}/manager-reports`, {
            Accept: "application/json",
        }).then((response) => {
            if (response.status == 200) {
                setManagerReports(response.data);
                setSelectedManagerReports(response.data);
            }
        });
    };

    // Получение отчетов по выбранному проекту
    const getProjectReports = (id) => {
        setReportWindowsState(false);

        const targetReports = reports.filter(
            (report) => report.project_id === id
        );

        const targetManagerReport = managerReports?.filter(
            (report) => report.project_id === id
        );

        if (targetReports?.length > 0) {
            setSelectedReports(targetReports);
        } else {
            setSelectedReports([]);
        }

        if (targetManagerReport?.length > 0) {
            setSelectedManagerReports(targetManagerReport);
        } else {
            setSelectedManagerReports([]);
        }
    };

    // Получение ключевых лиц выбранного проекта
    const getProjectContact = (id) => {
        setSelectedResponsiblePersons(
            responsiblePersons.projects?.find((item) => item.id === id)
        );
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

        postData("PATCH", `${URL}/${contragentId}`, contragentDataCustom)
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

    // Принудительное открытие окна редактирования заключения по отчёту
    const openSubReportEditor = (id) => {
        setReportWindowsState(false);
        getData(`${import.meta.env.VITE_API_URL}reports/${id}`).then(
            (response) => {
                if (response?.status == 200) {
                    setReportId(id);
                }
            }
        );
    };

    useEffect(() => {
        if (contragentId) {
            fetchData();
            getResponsiblePesons();
            getContracts();
            getContragentReports();
            getProjectsManagerReports();
        }
    }, []);

    const block1Ref = useRef(null);
    const block2Ref = useRef(null);
    const block3Ref = useRef(null);

    useOutsideClick([block1Ref, block2Ref, block3Ref], () => {
        setActiveProject(null);
        setSelectedReports(reports);
        setSelectedManagerReports(managerReports);
        setSelectedResponsiblePersons(responsiblePersons);
    });

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
                                        {contagentData?.program_name}
                                    </div>

                                    <span
                                        className={`
                                            whitespace-nowrap 
                                                ${
                                                    contagentData?.status ===
                                                    "active"
                                                        ? "text-green-500"
                                                        : contagentData?.status ===
                                                          "completed"
                                                        ? "text-black"
                                                        : "text-gray-300"
                                                }
                                        `}
                                    >
                                        {handleStatus(contagentData?.status)}
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
                                            contagentData?.head_office_address ||
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
                                                contagentData?.company_website
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
                                        {selectedResponsiblePersons?.contacts
                                            ?.length > 0 &&
                                            selectedResponsiblePersons?.contacts?.map(
                                                (person) => (
                                                    <FilledExecutorBlock
                                                        key={person.id}
                                                        contanct={person}
                                                    />
                                                )
                                            )}
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
                                        contagentData?.description_short || ""
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
                                    <ul className="grid gap-5" ref={block1Ref}>
                                        <li className="grid items-center grid-cols-[30%_26%_1fr] gap-3 text-gray-400 px-2">
                                            <span>Проект</span>
                                            <span>Бюджет</span>
                                            <span>Период реализации</span>
                                        </li>

                                        {projects.length > 0 &&
                                            projects.map((project) => (
                                                <ContragentProjectItem
                                                    key={project.id}
                                                    {...project}
                                                    setActiveProject={
                                                        setActiveProject
                                                    }
                                                    activeProject={
                                                        activeProject
                                                    }
                                                    getProjectReports={
                                                        getProjectReports
                                                    }
                                                    getProjectContact={
                                                        getProjectContact
                                                    }
                                                />
                                            ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div ref={block3Ref}>
                                <ContragentStatisticBlock
                                    contragentId={contragentId}
                                    activeProject={activeProject}
                                />
                            </div>

                            <div className="flex flex-col gap-2 flex-grow">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">
                                        История проекта
                                    </span>
                                </div>

                                <div
                                    className="border-2 border-gray-300 py-5 px-4 min-h-full flex-grow max-h-[300px] overflow-x-hidden overflow-y-auto"
                                    ref={block2Ref}
                                >
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

                                    {activeReportTab === "projectReports" &&
                                        (!reportWindowsState ? (
                                            <ul className="grid gap-3">
                                                <li className="grid items-center grid-cols-[21%_25%_25%_26%] gap-3 mb-2 text-gray-400">
                                                    <span>Проект</span>
                                                    <span>Отчет</span>
                                                    <span className="block text-center">
                                                        Статус
                                                    </span>
                                                    <span>
                                                        Период выполнения
                                                    </span>
                                                </li>

                                                {selectedReports.length > 0 &&
                                                    selectedReports.map(
                                                        (report, index) => (
                                                            <CardReportsListItem
                                                                key={
                                                                    report.id ||
                                                                    index
                                                                }
                                                                {...report}
                                                                openReportEditor={
                                                                    openReportEditor
                                                                }
                                                                openSubReportEditor={
                                                                    openSubReportEditor
                                                                }
                                                                mode={"read"}
                                                                type={
                                                                    "contragent"
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
                                                reportId={reportId}
                                                setReportId={setReportId}
                                                mode={"read"}
                                            />
                                        ))}

                                    {activeReportTab ===
                                        "managementReports" && (
                                        <ContragentManagementReportsTab
                                            managerReports={
                                                selectedManagerReports
                                            }
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

export default ContragentCard;
