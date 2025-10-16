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
import CardReportsList from "../CardReportsList/CardReportsList.js";
import CardManagementReportList from "../CardReportsList/CardManagementReportList";

import ContragentStatisticBlock from "./ContragentStatisticBlock";
import ContragentStatisticBlockMobile from "./ContragentStatisticBlockMobile";

import BottomSheet from "../BottomSheet/BottomSheet";
import BottomNavCard from "../BottomNav/BottomNavCard";
import AutoResizeTextarea from "../AutoResizeTextarea";
import ContragentResponsiblePersons from "./ContragentResponsiblePersons";

import "react-toastify/dist/ReactToastify.css";

const ContragentCard = () => {
    const URL = `${import.meta.env.VITE_API_URL}contragents`;
    const { contragentId } = useParams();
    const navigate = useNavigate();

    const [contragentData, setContragentData] = useState({});
    const [contragentDataCustom, setContragentDataCustom] = useState({});

    // const [mode, setMode] = useState("read");
    const [mode, setMode] = useState("edit");
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const [activeReportTab, setActiveReportTab] = useState("projectReports");
    const [activeWindow, setActiveWindow] = useState(""); // Активное окно на мобилке (Отчеты или ОСВ)

    const [reports, setReports] = useState([]); // Отчёты проектов
    const [selectedReports, setSelectedReports] = useState([]); // Очёты выбранного проекта
    const [managerReports, setManagerReports] = useState([]); // Отчёты руководителя проектов
    const [selectedManagerReports, setSelectedManagerReports] = useState([]); // Отчёты руководителя выбранного проекта
    const [projects, setProjects] = useState([]); // Проекты

    const [activeProject, setActiveProject] = useState(null); // Выбранный проект

    const [period, setPeriod] = useState("current_year");
    const [revenue, setRevenue] = useState({}); // ОСВ

    const [responsiblePersons, setResponsiblePersons] = useState([]); // Ключевые лица Заказчика
    const [selectedResponsiblePersons, setSelectedResponsiblePersons] =
        useState([]); // Ключевые лица Заказчика выбранного проекта
    const [reportWindowsState, setReportWindowsState] = useState(false); // Конструктор отчёта
    const [reportId, setReportId] = useState(null);
    const [contracts, setContracts] = useState([]);

    let query;

    // const handleInputChange = (e, name) => {
    //     setContragentDataCustom((prev) => ({
    //         ...prev,
    //         [name]: e.target.value,
    //     }));
    //     setContragentData((prev) => ({ ...prev, [name]: e.target.value }));
    // };

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

    // Получение ОСВ
    const getRevenue = (url) => {
        getData(url).then((response) => {
            if (response.status == 200) {
                setRevenue(response.data);
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
        })
            .then((response) => {
                if (response.status == 200) {
                    setReports(response.data);
                    setSelectedReports(response.data);
                }
            })
            .finally(() => setIsDataLoaded(true));
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
            containerId: "toastContainer",
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        postData("PATCH", `${URL}/${contragentId}`, contragentDataCustom)
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
            .catch(() => {
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
            setSelectedResponsiblePersons(responsiblePersons);
        }
    );

    useBodyScrollLock(activeWindow || reportWindowsState); // Блокируем экран при открытии попапа или редактора отчета

    const width = useWindowWidth(); // Снимаем блокировку на десктопе

    useEffect(() => {
        if (width >= 1440) {
            setActiveWindow("");
        }
    }, [width]);

    return (
        <main className="page">
            <section className="card contragent-card">
                <div className="container card__container contragent-card__container">
                    <ToastContainer containerId="toastContainer" />

                    <div className="card__wrapper contragent-card__wrapper">
                        <section className="card__main-content contragent-card__main-content">
                            <div className="card__main-name">
                                <input
                                    type="text"
                                    name="program_name"
                                    value={contragentData?.program_name || ""}
                                    onChange={(e) =>
                                        setContragentDataCustom((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                    // onBlur={() => {
                                    //     if (
                                    //         projectData?.name !=
                                    //         projectDataCustom?.program_name
                                    //     ) {
                                    //         updateData(projectId, true, {
                                    //             name: projectDataCustom.program_name,
                                    //         });
                                    //     }
                                    // }}
                                    disabled={mode == "read"}
                                />

                                <span
                                    className={`status
                                    ${
                                        contragentData?.status === "active"
                                            ? "active"
                                            : contragentData?.status ===
                                              "completed"
                                    }
                                `}
                                >
                                    {handleStatus(contragentData?.status)}
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
                                            contragentData?.description_short ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            setContragentDataCustom((prev) => ({
                                                ...prev,
                                                description_short:
                                                    e.target.value,
                                            }))
                                        }
                                        // onBlur={() => {
                                        //     if (
                                        //         projectData?.description !=
                                        //         projectDataCustom?.description
                                        //     ) {
                                        //         updateProject(projectId, true, {
                                        //             description:
                                        //                 projectDataCustom.description,
                                        //         });
                                        //     }
                                        // }}
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
                                            contragentData?.head_office_address ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            setContragentDataCustom((prev) => ({
                                                ...prev,
                                                head_office_address:
                                                    e.target.value,
                                            }))
                                        }
                                        // onBlur={() => {
                                        //     if (
                                        //         projectData?.description !=
                                        //         projectDataCustom?.description
                                        //     ) {
                                        //         updateProject(projectId, true, {
                                        //             description:
                                        //                 projectDataCustom.description,
                                        //         });
                                        //     }
                                        // }}
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
                                            contragentData?.company_website ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            setContragentDataCustom((prev) => ({
                                                ...prev,
                                                company_website: e.target.value,
                                            }))
                                        }
                                        // onBlur={() => {
                                        //     if (
                                        //         projectData?.description !=
                                        //         projectDataCustom?.description
                                        //     ) {
                                        //         updateProject(projectId, true, {
                                        //             description:
                                        //                 projectDataCustom.description,
                                        //         });
                                        //     }
                                        // }}
                                        disabled={mode == "read"}
                                    />
                                </div>
                            </section>

                            <section className="project-card__project-team">
                                <h2 className="card__subtitle">
                                    Ключевые лица Заказчика
                                </h2>

                                <div className="project-card__team">
                                    <ContragentResponsiblePersons
                                        teamData={
                                            selectedResponsiblePersons.contacts
                                        }
                                    />
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
                                        getProjectContact={getProjectContact}
                                    />
                                </div>
                            </section>
                        </section>

                        <section className="card__aside-content project-card__aside-content contragent-card__aside-content">
                            <div className="flex flex-col">
                                <div ref={block3Ref}>
                                    <ContragentStatisticBlock
                                        revenue={revenue}
                                        getRevenue={getRevenue}
                                        contragentId={contragentId}
                                        activeProject={activeProject}
                                        period={period}
                                        setPeriod={setPeriod}
                                    />
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

                                        {activeReportTab ===
                                            "projectReports" && (
                                            <CardReportsList
                                                isDataLoaded={isDataLoaded}
                                                reports={selectedReports}
                                                openReportEditor={
                                                    openReportEditor
                                                }
                                                mode={"read"}
                                            />
                                        )}

                                        {/* {activeReportTab ===
                                            "managementReports" && (
                                            <ManagementReportsTab
                                                projectId={projectId}
                                                setManagementReports={
                                                    setManagementReports
                                                }
                                                activeWindow={activeWindow}
                                                setActiveWindow={
                                                    setActiveWindow
                                                }
                                                mode={"read"}
                                            />
                                        )} */}

                                        {activeReportTab ===
                                            "managementReports" && (
                                            <CardManagementReportList
                                                managerReports={
                                                    selectedManagerReports
                                                }
                                                mode={"read"}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </section>

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
                    <ContragentStatisticBlockMobile
                        revenue={revenue}
                        getRevenue={getRevenue}
                        contragentId={contragentId}
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
                    className={`${activeWindow === "reports" ? "active" : ""}`}
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
                                            activeReportTab == "projectReports"
                                        }
                                        name="active_reports"
                                        onChange={() =>
                                            setActiveReportTab("projectReports")
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

                            {/* {activeReportTab === "managementReports" && (
                            <ManagementReportsTabMobile
                                activeWindow={activeWindow}
                                setActiveWindow={setActiveWindow}
                                managementReports={managementReports}
                                mode={"read"}
                            />
                        )} */}
                        </div>
                    </div>
                </BottomSheet>
            </div>

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

export default ContragentCard;
