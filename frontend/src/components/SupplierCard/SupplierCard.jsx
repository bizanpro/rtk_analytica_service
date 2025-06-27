import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import getData from "../../utils/getData";
import postData from "../../utils/postData";
import handleStatus from "../../utils/handleStatus";

import { ToastContainer, toast } from "react-toastify";

import CustomerProjectItem from "../CustomerCard/CustomerProjectItem";
import ProjectReportWindow from "../ProjectCard/ProjectReportWindow";
import CardReportsListItem from "../CardReportsListItem";
import SupplierStatisticBlock from "./SupplierStatisticBlock";
import ExecutorBlock from "../ExecutorBlock/ExecutorBlock";
import EmptyExecutorBlock from "../ExecutorBlock/EmptyExecutorBlock";

import "react-toastify/dist/ReactToastify.css";

const SupplierCard = () => {
    const URL = `${import.meta.env.VITE_API_URL}suppliers`;
    const { supplierId } = useParams();
    const navigate = useNavigate();

    const [supplierData, setSupplierData] = useState({});
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

    const [reportWindowsState, setReportWindowsState] = useState(false); // Конструктор отчёта
    const [reportId, setReportId] = useState(null);
    const [contracts, setContracts] = useState([]);
    const [responsiblePersons, setResponsiblePersons] = useState([]);
    const [addRespPerson, setAddRespPerson] = useState(false);
    const [newRespPerson, setNewRespPerson] = useState({
        full_name: "",
        phone: "",
        position: "",
        email: "",
    });

    let query;

    const handleInputChange = (e, name) => {
        setFormFields((prev) => ({ ...prev, [name]: e.target.value }));
        setSupplierData((prev) => ({ ...prev, [name]: e.target.value }));
    };

    // Получаем отчеты по выбранному проекту
    const getReports = (id) => {
        setReportWindowsState(false);

        const targetProject = projects.find((project) => project.id === id);

        if (targetProject && targetProject.reports?.length > 0) {
            setReports(targetProject.reports);
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

    // Получаем подрядчика и его проекты
    const fetchData = () => {
        getData(`${URL}/${supplierId}`, {
            Accept: "application/json",
        })
            .then((response) => {
                setSupplierData(response.data);
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

    const updateData = (showMessage = true) => {
        query = toast.loading("Обновление", {
            containerId: "supplier",
            position: "top-center",
        });

        postData("PATCH", `${URL}/${supplierId}`, formFields)
            .then((response) => {
                if (response?.ok && showMessage) {
                    toast.update(query, {
                        render: "Данные обновлены",
                        type: "success",
                        containerId: "supplier",
                        isLoading: false,
                        autoClose: 1200,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position: "top-center",
                    });
                } else {
                    toast.dismiss(query);
                    toast.error("Ошибка обновления данных", {
                        containerId: "supplier",
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
                    containerId: "supplier",
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

    // Обработчик ввода данных блока нового ключевого лица
    const handleNewExecutor = (type, e, name) => {
        setNewRespPerson({
            ...newRespPerson,
            [name]: name === "phone" ? e : e.target.value,
        });
    };

    // Добавление ключевого лица
    const sendExecutor = () => {
        query = toast.loading("Выполняется отправка", {
            containerId: "supplier",
            position: "top-center",
        });

        postData("POST", `${URL}/${supplierId}/contacts`, newRespPerson).then(
            (response) => {
                if (response?.ok) {
                    setResponsiblePersons((prevPerson) => [
                        ...prevPerson,
                        response,
                    ]);

                    setNewRespPerson({
                        full_name: "",
                        phone: "",
                        position: "",
                        email: "",
                    });

                    toast.update(query, {
                        render: response.message,
                        type: "success",
                        containerId: "supplier",
                        isLoading: false,
                        autoClose: 1200,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position: "top-center",
                    });
                }
            }
        );
    };

    // Удаление ключевого лица
    const deleteRespPerson = (id) => {
        postData("DELETE", `${URL}/${supplierId}/contacts/${id}`, {}).then(
            (response) => {
                if (response?.ok) {
                    setResponsiblePersons(
                        responsiblePersons.filter((item) => item.id !== id)
                    );
                }
            }
        );
    };

    useEffect(() => {
        if (supplierId) {
            fetchData();
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
                    <ToastContainer containerId="supplier" />

                    <div className="flex justify-between items-center gap-10">
                        <div className="flex items-center gap-3 justify-between flex-grow">
                            <div className="flex items-center gap-10">
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl font-medium w-full">
                                        {supplierData?.program_name}
                                    </div>

                                    <span
                                        className={`
                                            whitespace-nowrap 
                                                ${
                                                    supplierData?.status ===
                                                    "active"
                                                        ? "text-green-500"
                                                        : supplierData?.status ===
                                                          "completed"
                                                        ? "text-black"
                                                        : "text-gray-300"
                                                }
                                        `}
                                    >
                                        {handleStatus(supplierData?.status)}
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

                    <div className="grid grid-cols-3 justify-between mt-15 gap-10 flex-grow">
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
                                            supplierData?.head_office_address ||
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
                                                supplierData?.company_website
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

                                <div className="flex flex-col gap-2 flex-grow">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">
                                            Ключевые лица Подрядчика
                                        </span>

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
                                    </div>

                                    <div className="border-2 border-gray-300 py-5 px-3 min-h-full flex-grow max-h-[300px] overflow-x-hidden overflow-y-auto">
                                        <ul className="grid gap-5">
                                            {addRespPerson && (
                                                <EmptyExecutorBlock
                                                    borderClass={
                                                        "border-gray-300"
                                                    }
                                                    type={"customer"}
                                                    data={newRespPerson}
                                                    removeBlock={() =>
                                                        setAddRespPerson(false)
                                                    }
                                                    handleNewExecutor={
                                                        handleNewExecutor
                                                    }
                                                    sendExecutor={sendExecutor}
                                                />
                                            )}

                                            {responsiblePersons.length > 0 &&
                                                responsiblePersons.map(
                                                    (person) => (
                                                        <ExecutorBlock
                                                            key={person.id}
                                                            contanct={person}
                                                            mode={mode}
                                                            type={"customer"}
                                                            deleteBlock={
                                                                deleteRespPerson
                                                            }
                                                            // handleChange={
                                                            //     handleChange
                                                            // }
                                                        />
                                                    )
                                                )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex flex-col gap-2 mb-10">
                                <span className="text-gray-400">
                                    Краткое описание
                                </span>
                                <textarea
                                    className="border-2 border-gray-300 p-5 min-h-[155px] max-h-[155px]"
                                    style={{ resize: "none" }}
                                    placeholder="Заполните описание"
                                    type="text"
                                    disabled={mode == "read" ? true : false}
                                    value={
                                        supplierData?.description_short || ""
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
                                <div className="border-2 border-gray-300 py-5 px-4 min-h-full flex-grow max-h-[300px] overflow-x-hidden overflow-y-auto">
                                    <ul className="grid gap-3">
                                        <li className="grid items-center grid-cols-[1fr_20%_1fr] gap-3 mb-2 text-gray-400">
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
                            <div className="flex flex-col gap-2 mb-5">
                                <span className="text-gray-400">
                                    Взаиморасчёты
                                </span>

                                <SupplierStatisticBlock
                                    supplierId={supplierId}
                                />
                            </div>

                            <div className="flex flex-col gap-2 flex-grow">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">
                                        История проектов
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
                                            <li className="grid items-center grid-cols-[1fr_1fr_23%_34%] gap-4 mb-2 text-gray-400">
                                                <span>Проект</span>
                                                <span>Отчёт</span>
                                                <span className="text-center">
                                                    Статус / Роль
                                                </span>
                                                <span>Период выполнения</span>
                                            </li>

                                            {reports.length > 0 &&
                                                reports.map((report, index) => (
                                                    <CardReportsListItem
                                                        key={report.id || index}
                                                        {...report}
                                                        projectData={
                                                            projectData
                                                        }
                                                        openReportEditor={
                                                            openReportEditor
                                                        }
                                                        openSubReportEditor={
                                                            openSubReportEditor
                                                        }
                                                        mode={"read"}
                                                    />
                                                ))}
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

export default SupplierCard;
