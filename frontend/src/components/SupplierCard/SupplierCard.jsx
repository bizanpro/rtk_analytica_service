import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getData from "../../utils/getData";
import postData from "../../utils/postData";
import handleStatus from "../../utils/handleStatus";

import { ToastContainer, toast } from "react-toastify";

import CustomerProjectItem from "../CustomerCard/CustomerProjectItem";
import FilledExecutorBlock from "../ExecutorBlock/FilledExecutorBlock";
import ProjectStatisticsBlock from "../ProjectCard/ProjectStatisticsBlock";
import ProjectReportEditor from "../ProjectCard/ProjectReportEditor";

import "react-toastify/dist/ReactToastify.css";

const SupplierCard = () => {
    const URL = `${import.meta.env.VITE_API_URL}suppliers`;
    const { supplierId } = useParams();
    const [supplierData, setSupplierData] = useState({});
    const [formFields, setFormFields] = useState({});
    const [mode, setMode] = useState("read");
    const [reports, setReports] = useState([]); // История проекта
    const [projects, setProjects] = useState([]); // Проекты
    const [responsiblePersons, setResponsiblePersons] = useState([]); // Ключевые лица Заказчика
    const [reportWindowsState, setReportWindowsState] = useState(false); // Конструктор отчёта
    const [reportEditorState, setReportEditorState] = useState(false); // Конструктор заключения по отчёту

    let query;

    const handleInputChange = (e, name) => {
        setFormFields((prev) => ({ ...prev, [name]: e.target.value }));
        setSupplierData((prev) => ({ ...prev, [name]: e.target.value }));
    };

    // const getResponsiblePesons = () => {
    //     getData(`${URL}/${supplierId}/responsible-persons`, {
    //         Accept: "application/json",
    //     }).then((response) => {
    //         setResponsiblePersons(response.data);
    //     });
    // };

    const fetchData = () => {
        getData(`${URL}/${supplierId}`, {
            Accept: "application/json",
        }).then((response) => {
            setSupplierData(response.data);
            setProjects(response.data.projects);
        });
    };

    const updateData = async (showMessage = true) => {
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

    useEffect(() => {
        if (supplierId) {
            fetchData();
            // getResponsiblePesons();
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

                    <div className="grid grid-cols-[35%_55%] justify-between mt-15 gap-10 flex-grow">
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
                                        disabled={mode == "read" ? true : false}
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
                                    projectId={projectId}
                                    setReportId={setReportId}
                                    getProject={getProject}
                                    mode={mode}
                                />
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="flex flex-col gap-2 mb-5">
                                            <span className="text-gray-400">
                                                Краткое описание
                                            </span>
                                            <textarea
                                                className="border-2 border-gray-300 p-5 min-h-[155px] max-h-[155px]"
                                                style={{ resize: "none" }}
                                                placeholder="Заполните описание"
                                                type="text"
                                                disabled={
                                                    mode == "read"
                                                        ? true
                                                        : false
                                                }
                                                value={
                                                    supplierData?.description_short ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e,
                                                        "description_short"
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2 mb-5">
                                            <span className="text-gray-400">
                                                Краткое описание
                                            </span>

                                            <div className="border-2 border-gray-300 p-5 mb-5">
                                                <div className="flex flex-col gap-2 justify-between">
                                                    <div className="switch gap-4 w-[70%] mb-5">
                                                        <div>
                                                            <input
                                                                type="radio"
                                                                name="time_sort"
                                                                id="this_year"
                                                                disabled
                                                                checked
                                                            />
                                                            <label
                                                                className="bg-gray-200 py-1 px-2 text-center rounded-md"
                                                                htmlFor="this_year"
                                                            >
                                                                Текущий год
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <input
                                                                type="radio"
                                                                name="time_sort"
                                                                id="all_time"
                                                                disabled
                                                            />
                                                            <label
                                                                className="bg-gray-200 py-1 px-2 text-center rounded-md"
                                                                htmlFor="all_time"
                                                            >
                                                                За всё время
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid items-stretch grid-cols-3 gap-3 mb-3">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2 text-gray-400">
                                                            Выполнено{" "}
                                                            <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                                ?
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center flex-grow gap-2">
                                                            <strong className="font-normal text-4xl">
                                                                10,0
                                                            </strong>
                                                            <small className="text-sm">
                                                                млн
                                                                <br />
                                                                руб.
                                                            </small>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <div className="text-gray-400">
                                                            Оплачено
                                                        </div>
                                                        <div className="flex items-center flex-grow gap-2">
                                                            <strong className="font-normal text-4xl">
                                                                8,0
                                                            </strong>
                                                            <small className="text-sm">
                                                                млн
                                                                <br />
                                                                руб.
                                                            </small>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2 text-gray-400">
                                                            КЗ{" "}
                                                            <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                                ?
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center flex-grow gap-2">
                                                            <strong className="font-normal text-4xl">
                                                                2,0
                                                            </strong>
                                                            <small className="text-sm">
                                                                млн
                                                                <br />
                                                                руб.
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 flex-grow">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400">
                                                История проектов
                                            </span>
                                        </div>

                                        <div className="border-2 border-gray-300 py-5 px-4 min-h-full flex-grow max-h-[300px] overflow-x-hidden overflow-y-auto">
                                            {!reportWindowsState ? (
                                                <ul className="grid gap-3">
                                                    <li className="grid items-center grid-cols-5 gap-3 mb-2 text-gray-400">
                                                        <span>Проект</span>
                                                        <span>Отчет</span>
                                                        <span>Роль</span>
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
                                                                    openSubReportEditor={
                                                                        openSubReportEditor
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
                                                    mode={mode}
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

export default SupplierCard;
