import { useState, useEffect } from "react";
import getData from "../../utils/getData";
import postData from "../../utils/postData";

import ReportItem from "./ReportItem";
import ManagementItem from "./ManagementItem";

import ProjectReportEditor from "../ProjectCard/ProjectReportEditor";
import ProjectReportWindow from "../ProjectCard/ProjectReportWindow";
import ManagementReportEditor from "../ManagementReportEditor";

import Popup from "../Popup/Popup";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Reports = () => {
    const REPORTS_URL = `${import.meta.env.VITE_API_URL}reports`;
    const MANAGEMENT_URL = `${import.meta.env.VITE_API_URL}management-reports`;

    const COLUMNS = [
        [
            { label: "Отчёт", key: "name" },
            { label: "Проект", key: "project" },
            { label: "Заказкчик", key: "contragent" },
            { label: "Банк", key: "creditors" },
            { label: "Бюджет", key: "project_budget" },
            { label: "Срок", key: "implementation_period" },
            { label: "Руководитель проекта", key: "project_managers" },
            { label: "Статус", key: "status" },
            { label: "Период выполнения", key: "days" },
        ],
        [
            { label: "Отчёт", key: "name" },
            { label: "Отчётный месяц", key: "report_month" },
            { label: "Отвественный", key: "physical_person" },
            { label: "Дата создания", key: "created_at" },
            { label: "Дата изменения", key: "updated_at" },
        ],
    ];

    let query;

    const [activeTab, setActiveTab] = useState("projects");
    const [isLoading, setIsLoading] = useState(true);

    const [reportsList, setReportsList] = useState([]);
    const [managementList, setManagementList] = useState([]);

    const [managementEditorState, setManagementEditorState] = useState(false); // Конструктор отчёта
    const [reportWindowsState, setReportWindowsState] = useState(false); // Конструктор отчёта
    const [reportEditorState, setReportEditorState] = useState(false); // Конструктор заключения по отчёту
    const [reportEditorName, setReportEditorName] = useState(""); // Имя отчета в заключении
    const [reportId, setReportId] = useState(null);
    const [contracts, setContracts] = useState([]);
    const [reportData, setReportData] = useState({});
    const [periods, setPeriods] = useState({});
    const [mode, setMode] = useState("read");

    const [popupState, setPopupState] = useState(false);

    const [managementReportData, setManagementReportData] = useState({
        physical_person_id: 1,
        report_month: "",
        status_summary: "",
        problems: "",
        prospects: "",
        team: "",
        legal_issues: "",
        misc: "",
    });

    const getReports = () => {
        getData(REPORTS_URL, { Accept: "application/json" })
            .then((response) => {
                if (response.status === 200) {
                    setReportsList(response.data.reports);
                }
            })
            .finally(() => setIsLoading(false));
    };

    const getManagementReports = () => {
        getData(MANAGEMENT_URL, { Accept: "application/json" })
            .then((response) => {
                if (response.status === 200) {
                    setManagementList(response.data);
                }
            })
            .finally(() => setIsLoading(false));
    };

    // Получение договоров для детального отчёта
    const getContracts = (contragentId) => {
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

    const getPeriods = () => {
        getData(
            `${
                import.meta.env.VITE_API_URL
            }management-reports/available-periods`
        ).then((response) => {
            if (response?.status == 200) {
                setPeriods(response.data);

                const firstYear = Object.keys(response.data)[0];
                const firstMonth = response.data[firstYear][0].value;

                setManagementReportData((prev) => ({
                    ...prev,
                    report_month: `${firstYear}-${String(firstMonth).padStart(
                        2,
                        "0"
                    )}-01`,
                }));
            }
        });
    };

    // Открытие окна отчёта
    const openReportEditor = (reportData) => {
        getContracts(reportData.contragent?.id);
        setReportId(reportData.id);

        setReportEditorName(`${reportData.project?.name} / ${reportData.name}`);

        if (reportData.id) {
            setReportWindowsState(true);
        }
    };

    // Обновляем отчет для открытия заключения
    const openReportConclusion = (data) => {
        data.project_id = data.project?.id;

        setReportData(data);

        if (Object.keys(data).length > 0) {
            setReportWindowsState(false);
            setReportEditorState(true);
        }
    };

    // Принудительное открытие окна заключения по отчёту
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

    const openManagementReportEditor = (props, mode = "read") => {
        setPopupState(false);
        setManagementReportData(props);
        setMode(mode);
        setManagementEditorState(true);
    };

    const openPopup = () => {
        setPopupState(true);
    };

    const closePopup = (evt) => {
        if (evt.currentTarget.classList.contains("popup")) setPopupState(false);
    };

    const capitalizeFirstLetter = (string) => {
        if (!string) return "";
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const sendNewReport = (extendReportData) => {
        query = toast.loading("Выполняется отправка", {
            containerId: "report",
            position: "top-center",
        });

        postData(
            "POST",
            `${import.meta.env.VITE_API_URL}management-reports`,
            extendReportData
        ).then((response) => {
            if (response?.ok) {
                toast.update(query, {
                    render: "Данные сохранены",
                    type: "success",
                    containerId: "report",
                    isLoading: false,
                    autoClose: 1200,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                });
            } else {
                toast.dismiss(query);
                toast.error("Ошибка сохранения данных", {
                    containerId: "report",
                    isLoading: false,
                    autoClose: 1500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                });
            }
        });
    };

    // const updateReport = () => {
    //     query = toast.loading("Обновление", {
    //         containerId: "report",
    //         position: "top-center",
    //     });

    //     postData(
    //         "PATCH",
    //         `${import.meta.env.VITE_API_URL}reports/${reportId}`,
    //         extendReportData
    //     ).then((response) => {
    //         if (response?.ok) {
    //             toast.update(query, {
    //                 render: response.message,
    //                 type: "success",
    //                 containerId: "report",
    //                 isLoading: false,
    //                 autoClose: 1200,
    //                 pauseOnFocusLoss: false,
    //                 pauseOnHover: false,
    //                 position: "top-center",
    //             });
    //             getProject(projectId);
    //             setReportWindowsState(false);
    //             setReportEditorState(false);
    //         } else {
    //             toast.dismiss(query);
    //             toast.error("Ошибка обновления данных", {
    //                 containerId: "report",
    //                 isLoading: false,
    //                 autoClose: 1500,
    //                 pauseOnFocusLoss: false,
    //                 pauseOnHover: false,
    //                 position: "top-center",
    //             });
    //         }
    //     });
    // };

    useEffect(() => {
        setManagementEditorState(false);
        setReportWindowsState(false);
        setReportEditorState(false);
        setReportEditorName("");
        setReportId(null);
        setReportData({});
    }, [activeTab]);

    useEffect(() => {
        getReports();
        getManagementReports();
        getPeriods();
    }, []);

    return (
        <main className="page">
            <ToastContainer containerId="report" />

            <div className="container pt-8 min-h-screen flex flex-col">
                <div className="flex flex-col justify-between gap-6 mb-8">
                    <h1 className="text-3xl font-medium">Реестр отчётов</h1>

                    <nav className="flex items-center gap-10 border-b border-gray-300 text-lg">
                        <button
                            type="button"
                            className={`py-2 transition-all border-b-2 ${
                                activeTab == "projects"
                                    ? "border-gray-500"
                                    : "border-transparent"
                            }`}
                            onClick={() => setActiveTab("projects")}
                            title="Перейти на вкладку Проекты"
                        >
                            Проекты ({reportsList.length})
                        </button>
                        <button
                            type="button"
                            className={`py-2 transition-all border-b-2 ${
                                activeTab == "management"
                                    ? "border-gray-500"
                                    : "border-transparent"
                            }`}
                            onClick={() => setActiveTab("management")}
                            title="Перейти на вкладку Менеджмент"
                        >
                            Менеджмент ({managementList.length})
                        </button>
                    </nav>

                    <div className="flex items-center justify-between gap-6">
                        {activeTab === "projects" && (
                            <>
                                <div className="flex items-center gap-5">
                                    <select
                                        className={
                                            "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                        }
                                    >
                                        <option value="">Заказчик</option>
                                    </select>
                                    <select
                                        className={
                                            "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                        }
                                    >
                                        <option value="">Отрасль</option>
                                    </select>
                                    <select
                                        className={
                                            "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                        }
                                    >
                                        <option value="">Банк</option>
                                    </select>
                                    <select
                                        className={
                                            "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                        }
                                    >
                                        <option value="">
                                            Руководитель проекта
                                        </option>
                                    </select>
                                    <select
                                        className={
                                            "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                        }
                                    >
                                        <option value="">Тип отчёта</option>
                                    </select>
                                    <select
                                        className={
                                            "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                        }
                                    >
                                        <option value="">Статус</option>
                                    </select>
                                </div>

                                <button
                                    type="button"
                                    className="border rounded-lg py-1 px-5"
                                >
                                    Очистить
                                </button>
                            </>
                        )}
                        {activeTab === "management" && (
                            <>
                                <div className="flex items-center gap-5">
                                    <select
                                        className={
                                            "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                        }
                                    >
                                        <option value="">Отчёт</option>
                                    </select>
                                    <select
                                        className={
                                            "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                        }
                                    >
                                        <option value="">Отчётный месяц</option>
                                    </select>

                                    <button
                                        type="button"
                                        className="border rounded-lg py-1 px-5"
                                    >
                                        Очистить
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    className="py-1 px-5"
                                    onClick={() => openPopup()}
                                >
                                    Создать отчёт
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="w-full pb-5 relative min-h-full flex-grow overflow-y-auto">
                    <table className="table-auto w-full border-collapse border-gray-300 text-sm">
                        <thead className="text-gray-400 text-left">
                            <tr className="border-b border-gray-300">
                                {COLUMNS[activeTab === "projects" ? 0 : 1].map(
                                    ({ label, key }) => (
                                        <th
                                            className="text-base px-4 py-2 min-w-[180px] max-w-[200px]"
                                            rowSpan="2"
                                            key={key}
                                        >
                                            {label}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td className="text-base px-4 py-2">
                                        Загрузка...
                                    </td>
                                </tr>
                            ) : activeTab === "projects" ? (
                                reportsList.length > 0 &&
                                reportsList.map((item) => (
                                    <ReportItem
                                        key={item.id}
                                        columns={COLUMNS[0]}
                                        props={item}
                                        openReportEditor={openReportEditor}
                                        openSubReportEditor={
                                            openSubReportEditor
                                        }
                                    />
                                ))
                            ) : (
                                managementList.length > 0 &&
                                managementList.map((item) => (
                                    <ManagementItem
                                        key={item.id}
                                        columns={COLUMNS[1]}
                                        props={item}
                                        openManagementReportEditor={
                                            openManagementReportEditor
                                        }
                                    />
                                ))
                            )}
                        </tbody>
                    </table>

                    {activeTab === "projects" && (
                        <>
                            {reportWindowsState && (
                                <div className="bg-white border-2 border-gray-300 py-5 px-4 min-h-[min-content] max-h-[max-content] overflow-y-auto absolute bottom-0 top-0 right-0 w-[38%]">
                                    <ProjectReportWindow
                                        reportWindowsState={
                                            setReportWindowsState
                                        }
                                        contracts={contracts}
                                        updateReport={openReportConclusion}
                                        reportId={reportId}
                                        setReportId={setReportId}
                                        reportTitle={reportEditorName}
                                        mode={"read"}
                                    />
                                </div>
                            )}

                            {reportEditorState && (
                                <div className="bg-white min-h-[min-content] max-h-[max-content] overflow-y-auto absolute bottom-0 top-0 right-0 w-[38%]">
                                    <ProjectReportEditor
                                        reportData={reportData}
                                        reportEditorName={reportEditorName}
                                        setReportWindowsState={
                                            setReportWindowsState
                                        }
                                        setReportEditorState={
                                            setReportEditorState
                                        }
                                        reportId={reportId}
                                        setReportId={setReportId}
                                        mode={"read"}
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === "management" && managementEditorState && (
                        <div className="bg-white min-h-[min-content] max-h-[max-content] overflow-y-auto absolute bottom-0 top-0 right-0 w-[40%]">
                            <ManagementReportEditor
                                managementReportData={managementReportData}
                                setManagementEditorState={
                                    setManagementEditorState
                                }
                                sendNewReport={sendNewReport}
                                mode={mode}
                            />
                        </div>
                    )}
                </div>

                {popupState && (
                    <Popup onClick={closePopup} title="Создание отчёта">
                        <div className="min-w-[280px]">
                            <div className="action-form__body">
                                <div className="flex flex-col mb-5">
                                    <label
                                        htmlFor="project_name"
                                        className="block mb-3"
                                    >
                                        Введите наименование отчёта
                                    </label>
                                    <input
                                        type="text"
                                        name="project_name"
                                        id="project_name"
                                        className="border-2 border-gray-300 p-3 w-full"
                                        // value={newProjectName}
                                        // onChange={(e) =>
                                        //     handleProjectsNameChange(e)
                                        // }
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label
                                        htmlFor="report_month"
                                        className="block mb-3"
                                    >
                                        Выберите отчётный месяц
                                    </label>
                                    <select
                                        type="text"
                                        id="report_month"
                                        className="border-2 border-gray-300 p-3 w-full"
                                        defaultValue={
                                            managementReportData.report_month
                                        }
                                        onChange={(e) => {
                                            setManagementReportData({
                                                ...managementReportData,
                                                report_month: e.target.value,
                                            });
                                        }}
                                    >
                                        {Object.entries(periods).map(
                                            ([year, months]) =>
                                                months.map((month) => (
                                                    <option
                                                        key={`${year}-${month.value}`}
                                                        value={`${year}-${String(
                                                            month.value
                                                        ).padStart(2, "0")}-01`}
                                                    >
                                                        {`${capitalizeFirstLetter(
                                                            month.name
                                                        )} ${year}`}
                                                    </option>
                                                ))
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className="action-form__footer mt-5 flex items-center gap-6 justify-between">
                                <button
                                    type="button"
                                    className="rounded-lg py-2 px-5 bg-black text-white flex-[1_1_50%]"
                                    onClick={() => {
                                        openManagementReportEditor(
                                            managementReportData,
                                            "edit"
                                        );
                                    }}
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

export default Reports;
