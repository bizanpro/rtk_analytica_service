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

import SupplierStatisticBlock from "./SupplierStatisticBlock";
import SupplierStatisticBlockMobile from "./SupplierStatisticBlockMobile";
import ExecutorBlock from "../ExecutorBlock/ExecutorBlock";

import CardReportsList from "../CardReportsList/CardReportsList";
import CardManagementReportList from "../CardReportsList/CardManagementReportList";

import SupplierEmptyExecutorBlock from "./SupplierEmptyExecutorBlock";
import EmptyExecutorBlock from "../ExecutorBlock/EmptyExecutorBlock.jsx";
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

    const [period, setPeriod] = useState("current_year");
    const [revenue, setRevenue] = useState({}); // ОСВ

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
        })
            .then((response) => {
                if (response.status == 200) {
                    setReports(response.data);
                    setSelectedReports(response.data);
                }
            })
            .finally(() => setIsDataLoaded(true));
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

    // Получение ОСВ
    const getRevenue = (url) => {
        getData(url).then((response) => {
            if (response.status == 200) {
                setRevenue(response.data);
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
    const block4Ref = useRef(null);
    const block5Ref = useRef(null);
    const block6Ref = useRef(null);
    const block7Ref = useRef(null);

    useOutsideClick(
        [
            block1Ref,
            block2Ref,
            block3Ref,
            block4Ref,
            block5Ref,
            block6Ref,
            block7Ref,
        ],
        () => {
            setActiveProject(null);
            setSelectedReports(reports);
            setSelectedManagerReports(managerReports);
        }
    );

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

                            <section className="project-card__project-executors">
                                <h2 className="card__subtitle">
                                    Ключевые лица подрядчика
                                </h2>

                                <ul className="project-card__executors-list">
                                    {responsiblePersons.length > 0 ? (
                                        responsiblePersons.map((person) => (
                                            <ExecutorBlock
                                                key={person.id}
                                                contanct={person}
                                                mode={mode}
                                                type={"customer"}
                                                deleteBlock={deleteRespPerson}
                                            />
                                        ))
                                    ) : (
                                        <li className="project-card__executors-list-nodata">
                                            Нет данных
                                        </li>
                                    )}
                                </ul>

                                {mode == "edit" && (
                                    <button
                                        type="button"
                                        className="button-add"
                                        onClick={() => {
                                            if (!addRespPerson) {
                                                setAddRespPerson(true);
                                            }
                                        }}
                                        title="Добавить ключевое лицо подрядчика"
                                    >
                                        Добавить
                                        <span>
                                            <svg
                                                width="10"
                                                height="9"
                                                viewBox="0 0 10 9"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M5.75 3.75H9.5v1.5H5.75V9h-1.5V5.25H.5v-1.5h3.75V0h1.5v3.75z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </span>
                                    </button>
                                )}

                                {addRespPerson && (
                                    <SupplierEmptyExecutorBlock
                                        supplierId={supplierId}
                                        removeBlock={() =>
                                            setAddRespPerson(false)
                                        }
                                        sendExecutor={sendExecutor}
                                    />
                                )}
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

                        <section className="card__aside-content project-card__aside-content supplier-card__aside-content">
                            <div className="flex flex-col">
                                <div ref={block3Ref}>
                                    <SupplierStatisticBlock
                                        revenue={revenue}
                                        getRevenue={getRevenue}
                                        supplierId={supplierId}
                                        activeProject={activeProject}
                                        period={period}
                                        setPeriod={setPeriod}
                                    />
                                </div>
                            </div>

                            <div className="reports" ref={block2Ref}>
                                <div className="reports__body">
                                    <nav className="card__tabs reports__tabs">
                                        <div
                                            className="card__tabs-item radio-field_tab"
                                            onClick={() =>
                                                setActiveReportTab(
                                                    "projectReports"
                                                )
                                            }
                                            aria-label="Открыть вкладку Отчёты проекта"
                                        >
                                            <input
                                                id="projectReports"
                                                type="radio"
                                                checked={
                                                    activeReportTab ==
                                                    "projectReports"
                                                }
                                                name="active_reports_1"
                                                onChange={() =>
                                                    setActiveReportTab(
                                                        "projectReports"
                                                    )
                                                }
                                            />
                                            <label htmlFor="projectReports">
                                                Отчёты проекта
                                            </label>
                                        </div>
                                        <div
                                            className="card__tabs-item radio-field_tab"
                                            onClick={() =>
                                                setActiveReportTab(
                                                    "projectReports"
                                                )
                                            }
                                            aria-label="Открыть вкладку Отчёты руководителя проекта"
                                        >
                                            <input
                                                id="managementReports"
                                                type="radio"
                                                checked={
                                                    activeReportTab ==
                                                    "managementReports"
                                                }
                                                name="active_reports_1"
                                                onChange={() =>
                                                    setActiveReportTab(
                                                        "managementReports"
                                                    )
                                                }
                                            />
                                            <label htmlFor="managementReports">
                                                Отчёты руководителя проекта
                                            </label>
                                        </div>
                                    </nav>

                                    {activeReportTab === "projectReports" && (
                                        <CardReportsList
                                            isDataLoaded={isDataLoaded}
                                            reports={selectedReports}
                                            openReportEditor={openReportEditor}
                                            mode={"read"}
                                        />
                                    )}

                                    {activeReportTab ===
                                        "managementReports" && (
                                        <CardManagementReportList
                                            managerReports={
                                                selectedManagerReports
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Редактор отчёта */}
                <div ref={block4Ref}>
                    <ReportWindow
                        reportWindowsState={reportWindowsState}
                        setReportWindowsState={setReportWindowsState}
                        contracts={contracts}
                        reportId={reportId}
                        setReportId={setReportId}
                        mode={"read"}
                    />
                </div>

                {/* Мобильный ОСВ */}
                <div ref={block5Ref}>
                    <BottomSheet
                        onClick={() => setActiveWindow("")}
                        className={`${
                            activeWindow === "statistic" ? "active" : ""
                        }`}
                    >
                        <SupplierStatisticBlockMobile
                            revenue={revenue}
                            getRevenue={getRevenue}
                            supplierId={supplierId}
                            activeProject={activeProject}
                            period={period}
                            setPeriod={setPeriod}
                        />
                    </BottomSheet>
                </div>

                {/* Мобильные отчёты */}
                <div ref={block6Ref}>
                    <BottomSheet
                        onClick={() => setActiveWindow("")}
                        className={`${
                            activeWindow === "reports" ? "active" : ""
                        }`}
                    >
                        <div className="reports">
                            <div className="reports__body">
                                <nav className="card__tabs reports__tabs">
                                    <div
                                        className="card__tabs-item radio-field_tab"
                                        onClick={() =>
                                            setActiveReportTab("projectReports")
                                        }
                                        aria-label="Открыть вкладку Отчёты проекта"
                                    >
                                        <input
                                            id="projectReports"
                                            type="radio"
                                            checked={
                                                activeReportTab ==
                                                "projectReports"
                                            }
                                            name="active_reports"
                                            onChange={() =>
                                                setActiveReportTab(
                                                    "projectReports"
                                                )
                                            }
                                        />
                                        <label htmlFor="projectReports">
                                            Отчёты проекта
                                        </label>
                                    </div>
                                    <div
                                        className="card__tabs-item radio-field_tab"
                                        onClick={() =>
                                            setActiveReportTab("projectReports")
                                        }
                                        aria-label="Открыть вкладку Отчёты руководителя проекта"
                                    >
                                        <input
                                            id="managementReports"
                                            type="radio"
                                            checked={
                                                activeReportTab ==
                                                "managementReports"
                                            }
                                            name="active_reports"
                                            onChange={() =>
                                                setActiveReportTab(
                                                    "managementReports"
                                                )
                                            }
                                        />
                                        <label htmlFor="managementReports">
                                            Отчёты руководителя проекта
                                        </label>
                                    </div>
                                </nav>

                                {activeReportTab === "projectReports" && (
                                    <CardReportsList
                                        isDataLoaded={isDataLoaded}
                                        reports={selectedReports}
                                        openReportEditor={openReportEditor}
                                        mode={"read"}
                                    />
                                )}

                                {activeReportTab === "managementReports" && (
                                    <CardManagementReportList
                                        managerReports={selectedManagerReports}
                                    />
                                )}
                            </div>
                        </div>
                    </BottomSheet>
                </div>
            </section>

            <div className="card__bottom-actions" ref={block7Ref}>
                <button
                    type="button"
                    title="Открыть отчёты"
                    onClick={() => {
                        setReportWindowsState(false);
                        setActiveWindow("reports");
                    }}
                >
                    <svg
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M8.83116 9.62235H21.1633M8.83116 14.6909H21.1633M8.83116 19.4801H17.4517M6.06055 26.2405H24.0007C24.553 26.2405 25.0007 25.7928 25.0007 25.2405V4.75928C25.0007 4.20699 24.553 3.75928 24.0007 3.75928H6.06055C5.50826 3.75928 5.06055 4.20699 5.06055 4.75928V25.2405C5.06055 25.7928 5.50826 26.2405 6.06055 26.2405Z"
                            stroke="#F38B00"
                            strokeWidth="2"
                        />
                    </svg>
                </button>

                <button
                    type="button"
                    title="Открыть ОСВ"
                    onClick={() => {
                        setReportWindowsState(false);
                        setActiveWindow("statistic");
                    }}
                >
                    <svg
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M10 21.25H6.25V18.75H10V16.25H6.25V13.75H10V3.75H18.75C20.4076 3.75 21.9973 4.40848 23.1694 5.58058C24.3415 6.75269 25 8.3424 25 10C25 11.6576 24.3415 13.2473 23.1694 14.4194C21.9973 15.5915 20.4076 16.25 18.75 16.25H12.5V18.75H21.25V21.25H12.5V26.25H10V21.25ZM18.75 13.75C19.7446 13.75 20.6984 13.3549 21.4016 12.6517C22.1049 11.9484 22.5 10.9946 22.5 10C22.5 9.00544 22.1049 8.05161 21.4017 7.34835C20.6984 6.64509 19.7446 6.25 18.75 6.25L12.5 6.25V13.75H18.75Z"
                            fill="#F38B00"
                        />
                    </svg>
                </button>
            </div>

            <BottomNavCard update={() => updateData()}></BottomNavCard>
        </main>
    );
};

export default SupplierCard;
