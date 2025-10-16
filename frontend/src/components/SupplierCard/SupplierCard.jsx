import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";
import handleStatus from "../../utils/handleStatus";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock.js";
import { useWindowWidth } from "../../hooks/useWindowWidth.js";

import { ToastContainer, toast } from "react-toastify";

import CardProjects from "../CardProjects/CardProjects";
import ReportWindow from "../ReportWindow/ReportWindow";
import CardReportsList from "../CardReportsList/CardReportsList";
import SupplierStatisticBlock from "./SupplierStatisticBlock";
import ExecutorBlock from "../ExecutorBlock/ExecutorBlock";

import SupplierEmptyExecutorBlock from "./SupplierEmptyExecutorBlock";
import SupplierManagementReportsTab from "./SupplierManagementReportsTab";

import BottomSheet from "../BottomSheet/BottomSheet";
import BottomNavCard from "../BottomNav/BottomNavCard";
import AutoResizeTextarea from "../AutoResizeTextarea";
// import ContragentResponsiblePersons from "./ContragentResponsiblePersons";

import "react-toastify/dist/ReactToastify.css";

const SupplierCard = () => {
    const URL = `${import.meta.env.VITE_API_URL}suppliers`;
    const { supplierId } = useParams();
    const navigate = useNavigate();

    const [mode, setMode] = useState("edit");
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const [cardData, setCardData] = useState({});
    const [cardDataCustom, setCardDataCustom] = useState({});

    const [activeReportTab, setActiveReportTab] = useState("projectReports");
    const [activeWindow, setActiveWindow] = useState("");
    const [activeProject, setActiveProject] = useState(null); // Выбранный проект

    const [reports, setReports] = useState([]); // Отчёты проектов
    const [selectedReports, setSelectedReports] = useState([]); // Очёты выбранного проекта
    const [managerReports, setManagerReports] = useState([]); // Отчёты руководителя проектов
    const [selectedManagerReports, setSelectedManagerReports] = useState([]); // Отчёты руководителя выбранного проекта
    const [projects, setProjects] = useState([]); // Проекты

    const [reportWindowsState, setReportWindowsState] = useState(false); // Конструктор отчёта
    const [reportId, setReportId] = useState(null);
    const [contracts, setContracts] = useState([]);
    const [responsiblePersons, setResponsiblePersons] = useState([]);
    const [addRespPerson, setAddRespPerson] = useState(false);

    let query;

    // Получаем отчеты по выбранному проекту
    const getProjectReports = (id) => {
        setReportWindowsState(false);

        const targetReports = reports.filter(
            (report) => report.project_id === id
        );

        const targetManagerReport = cardData.manager_reports?.filter(
            (report) => report.project_id === id
        );

        if (targetReports?.length > 0) {
            setSelectedReports(targetReports);
        } else {
            setSelectedReports([]);
        }

        if (targetManagerReport.length > 0) {
            setSelectedManagerReports(targetManagerReport);
        } else {
            setSelectedManagerReports([]);
        }
    };

    // Получение договоров
    const getContracts = () => {
        getData(
            `${import.meta.env.VITE_API_URL}contragents/${supplierId}/contracts`
        ).then((response) => {
            if (response?.status == 200) {
                setContracts(response.data);
            }
        });
    };

    // Получаем список отчетов
    const getProjectsReports = () => {
        getData(`${URL}/${supplierId}/reports`, {
            Accept: "application/json",
        }).then((response) => {
            if (response.status == 200) {
                setReports(response.data);
                setSelectedReports(response.data);
            }
        });
    };

    // Получаем список отчетов руководителя
    const getProjectsManagerReports = () => {
        getData(`${URL}/${supplierId}/manager-reports`, {
            Accept: "application/json",
        }).then((response) => {
            if (response.status == 200) {
                setManagerReports(response.data);
                setSelectedManagerReports(response.data);
            }
        });
    };

    // Получаем подрядчика и его проекты
    const fetchData = () => {
        getData(`${URL}/${supplierId}`, {
            Accept: "application/json",
        })
            .then((response) => {
                setCardData(response.data);
                setCardDataCustom(response.data);
                setProjects(response.data.projects);
                setResponsiblePersons(response.data.contacts);
            })
            .catch((error) => {
                if (error && error.status === 404) {
                    navigate("/not-found", {
                        state: {
                            message: "Подрядчик не найден",
                            errorCode: 404,
                            additionalInfo: "",
                        },
                    });
                }
            });
    };

    // Обновление данных карточки
    const updateData = (showMessage = true) => {
        query = toast.loading("Обновление", {
            containerId: "toastContainer",
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        postData("PATCH", `${URL}/${supplierId}`, cardDataCustom)
            .then((response) => {
                if (response?.ok && showMessage) {
                    toast.update(query, {
                        render: "Данные обновлены",
                        type: "success",
                        containerId: "toastContainer",
                        isLoading: false,
                        autoClose: 1200,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    });
                } else {
                    toast.dismiss(query);
                    toast.error("Ошибка обновления данных", {
                        containerId: "toastContainer",
                        isLoading: false,
                        autoClose: 1500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    });
                }
            })
            .catch((error) => {
                toast.dismiss(query);
                toast.error(error.message || "Ошибка обновления данных", {
                    containerId: "toastContainer",
                    isLoading: false,
                    autoClose: 1500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                });
            });
    };

    // Открытие редактора отчёта
    const openReportEditor = (id) => {
        setReportId(id);
        if (id) {
            setActiveWindow("");
            setReportWindowsState(true);
        }
    };

    // Добавление ключевого лица
    const sendExecutor = (data) => {
        query = toast.loading("Выполняется отправка", {
            containerId: "toastContainer",
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        postData("POST", `${URL}/${supplierId}/contacts`, data)
            .then((response) => {
                if (response?.ok) {
                    setResponsiblePersons((prevPerson) => [
                        ...prevPerson,
                        response,
                    ]);

                    setAddRespPerson(false);

                    toast.update(query, {
                        render: response.message || "Ключевое лицо добавлено",
                        type: "success",
                        containerId: "toastContainer",
                        isLoading: false,
                        autoClose: 1200,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    });
                }
            })
            .catch((error) => {
                toast.dismiss(query);
                toast.error(error.message || "Ошибка добавления исполнителя", {
                    containerId: "toastContainer",
                    isLoading: false,
                    autoClose: 1500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                });
            });
    };

    // Удаление ключевого лица
    const deleteRespPerson = (id) => {
        postData(
            "DELETE",
            `${
                import.meta.env.VITE_API_URL
            }responsible-persons/supplier/contact/${id}`,
            {}
        ).then((response) => {
            if (response?.ok) {
                setResponsiblePersons(
                    responsiblePersons.filter((item) => item.id !== id)
                );

                toast.success("Ключевое лицо удалено", {
                    containerId: "toastContainer",
                    isLoading: false,
                    autoClose: 1500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                });
            }
        });
    };

    useEffect(() => {
        if (supplierId) {
            fetchData();
            getProjectsReports();
            getProjectsManagerReports();
            getContracts();
        }
    }, []);

    const block1Ref = useRef(null);
    const block2Ref = useRef(null);
    const block3Ref = useRef(null);

    useOutsideClick([block1Ref, block2Ref, block3Ref], () => {
        setActiveProject(null);
        setSelectedReports(reports);
        setSelectedManagerReports(managerReports);
    });

    useBodyScrollLock(activeWindow || reportWindowsState); // Блокируем экран при открытии попапа или редактора отчета

    const width = useWindowWidth(); // Снимаем блокировку на десктопе

    useEffect(() => {
        if (width >= 1440) {
            setActiveWindow("");
        }
    }, [width]);

    useEffect(() => {
        if (mode === "read") {
            setAddRespPerson(false);
        }
    }, [mode]);

    return (
        <main className="page">
            <section className="card supplier-card">
                <div className="container card__container supplier-card__container">
                    <ToastContainer containerId="toastContainer" />

                    <div className="card__wrapper supplier-card__wrapper">
                        <section className="card__main-content supplier-card__main-content">
                            <div className="card__main-name">
                                <input
                                    type="text"
                                    name="program_name"
                                    value={cardDataCustom?.program_name || ""}
                                    onChange={(e) =>
                                        setCardDataCustom((prev) => ({
                                            ...prev,
                                            program_name: e.target.value,
                                        }))
                                    }
                                    onBlur={() => {
                                        if (
                                            cardData?.program_name !=
                                            cardDataCustom?.program_name
                                        ) {
                                            updateData(true, {
                                                program_name:
                                                    cardDataCustom.program_name,
                                            });
                                        }
                                    }}
                                    disabled={mode == "read"}
                                />

                                <span
                                    className={`status
                                    ${
                                        cardData?.status === "active"
                                            ? "active"
                                            : cardData?.status === "completed"
                                    }
                                `}
                                >
                                    {handleStatus(cardData?.status)}
                                </span>
                            </div>

                            <section className="card__general-info">
                                <div>
                                    <div className="form-label">
                                        Краткое описание компании
                                    </div>

                                    <AutoResizeTextarea
                                        className="form-textarea"
                                        placeholder="Заполните описание"
                                        type="text"
                                        name="description_short"
                                        value={
                                            cardDataCustom?.description_short ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            setCardDataCustom((prev) => ({
                                                ...prev,
                                                description_short:
                                                    e.target.value,
                                            }))
                                        }
                                        onBlur={() => {
                                            if (
                                                cardData?.description_short !=
                                                cardDataCustom?.description_short
                                            ) {
                                                updateData(true, {
                                                    description_short:
                                                        cardDataCustom.description_short,
                                                });
                                            }
                                        }}
                                        disabled={mode == "read"}
                                    />
                                </div>

                                <div>
                                    <div className="form-label">
                                        Адрес центрального офиса
                                    </div>

                                    <AutoResizeTextarea
                                        className="form-textarea"
                                        placeholder="Заполните адрес центрального офиса"
                                        type="text"
                                        name="head_office_address"
                                        value={
                                            cardDataCustom?.head_office_address ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            setCardDataCustom((prev) => ({
                                                ...prev,
                                                head_office_address:
                                                    e.target.value,
                                            }))
                                        }
                                        onBlur={() => {
                                            if (
                                                cardData?.head_office_address !=
                                                cardDataCustom?.head_office_address
                                            ) {
                                                updateData(true, {
                                                    head_office_address:
                                                        cardDataCustom.head_office_address,
                                                });
                                            }
                                        }}
                                        disabled={mode == "read"}
                                    />
                                </div>

                                <div>
                                    <div className="form-label">
                                        Сайт компании
                                    </div>

                                    <input
                                        type="text"
                                        className="form-field"
                                        placeholder="Введите адрес сайта компании"
                                        name="company_website"
                                        value={
                                            cardDataCustom?.company_website ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            setCardDataCustom((prev) => ({
                                                ...prev,
                                                company_website: e.target.value,
                                            }))
                                        }
                                        onBlur={() => {
                                            if (
                                                cardData?.company_website !=
                                                cardDataCustom?.company_website
                                            ) {
                                                updateData(true, {
                                                    company_website:
                                                        cardDataCustom.company_website,
                                                });
                                            }
                                        }}
                                        disabled={mode == "read"}
                                    />
                                </div>
                            </section>

                            <section className="project-card__project-team">
                                <h2 className="card__subtitle">
                                    Ключевые лица подрядчика
                                </h2>

                                {mode == "edit" && (
                                    <button
                                        type="button"
                                        className="add-button"
                                        onClick={() => {
                                            if (!addRespPerson) {
                                                setAddRespPerson(true);
                                            }
                                        }}
                                        title="Добавить ключевое лицо Подрядчика"
                                    >
                                        <span></span>
                                    </button>
                                )}

                                <div className="project-card__team">
                                    {/* <ContragentResponsiblePersons
                                        teamData={
                                            selectedResponsiblePersons?.contacts
                                        }
                                    /> */}

                                    {addRespPerson && (
                                        <SupplierEmptyExecutorBlock
                                            supplierId={supplierId}
                                            removeBlock={() =>
                                                setAddRespPerson(false)
                                            }
                                            sendExecutor={sendExecutor}
                                        />
                                    )}

                                    {responsiblePersons.length > 0 &&
                                        responsiblePersons.map((person) => (
                                            <ExecutorBlock
                                                key={person.id}
                                                contanct={person}
                                                mode={mode}
                                                type={"customer"}
                                                deleteBlock={deleteRespPerson}
                                            />
                                        ))}
                                </div>
                            </section>

                            <section className="project-card__projects">
                                <h2 className="card__subtitle">
                                    Проекты
                                    <span>{projects.length}</span>
                                </h2>

                                <div ref={block1Ref}>
                                    <CardProjects
                                        projects={projects}
                                        setActiveProject={setActiveProject}
                                        activeProject={activeProject}
                                        getProjectReports={getProjectReports}
                                    />
                                </div>
                            </section>
                        </section>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-3 justify-between mt-15 gap-10 flex-grow">
                <div className="flex flex-col">
                    <div className="flex flex-col gap-2 flex-grow">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400">
                                Проекты ({projects.length})
                            </span>
                        </div>
                        <div className="border-2 border-gray-300 py-5 px-4 min-h-full flex-grow max-h-[310px] overflow-x-hidden overflow-y-auto">
                            <ul className="grid gap-3" ref={block1Ref}>
                                <li className="grid items-center grid-cols-[30%_26%_1fr] gap-3 mb-2 text-gray-400">
                                    <span>Проект</span>
                                    <span>Бюджет</span>
                                    <span>Период реализации</span>
                                </li>

                                <CardProjects
                                    projects={projects}
                                    setActiveProject={setActiveProject}
                                    activeProject={activeProject}
                                    getProjectReports={getProjectReports}
                                />
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex flex-col gap-2 mb-5">
                        <span className="text-gray-400">Взаиморасчёты</span>

                        <div ref={block3Ref}>
                            <SupplierStatisticBlock
                                supplierId={supplierId}
                                activeProject={activeProject}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 flex-grow">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400">
                                История проектов
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
                                        activeReportTab == "projectReports"
                                            ? "border-gray-500"
                                            : "border-transparent"
                                    }`}
                                    onClick={() =>
                                        setActiveReportTab("projectReports")
                                    }
                                    title="Перейти на вкладку Отчёты проекта"
                                >
                                    Отчёты проекта
                                </button>
                                <button
                                    type="button"
                                    className={`py-2 transition-all border-b-2 ${
                                        activeReportTab == "managementReports"
                                            ? "border-gray-500"
                                            : "border-transparent"
                                    }`}
                                    onClick={() =>
                                        setActiveReportTab("managementReports")
                                    }
                                    title="Перейти на вкладку Отчёты руководителя проекта"
                                >
                                    Отчёты руководителя проекта
                                </button>
                            </nav>

                            {activeReportTab === "projectReports" &&
                                (!reportWindowsState ? (
                                    <CardReportsList
                                        reports={selectedReports}
                                        openReportEditor={openReportEditor}
                                        mode={"read"}
                                    />
                                ) : (
                                    <ReportWindow
                                        reportWindowsState={
                                            setReportWindowsState
                                        }
                                        contracts={contracts}
                                        reportId={reportId}
                                        setReportId={setReportId}
                                        mode={"read"}
                                    />
                                ))}

                            {activeReportTab === "managementReports" && (
                                <SupplierManagementReportsTab
                                    managerReports={selectedManagerReports}
                                    mode={"read"}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SupplierCard;
