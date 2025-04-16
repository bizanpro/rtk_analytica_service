import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getData from "../../utils/getData";
import postData from "../../utils/postData";

import { ToastContainer, toast } from "react-toastify";

import FilledExecutorBlock from "../ExecutorBlock/FilledExecutorBlock";
import ProjectStatisticsBlock from "../ProjectCard/ProjectStatisticsBlock";
import ProjectReportEditor from "../ProjectCard/ProjectReportEditor";

import "react-toastify/dist/ReactToastify.css";

const CustomerCard = () => {
    const URL = `${import.meta.env.VITE_API_URL}contragents`;
    const { contragentId } = useParams();
    const [customerData, setEmployeeData] = useState({});
    const [mode, setMode] = useState("read");
    const [reports, setReports] = useState([]);
    const [reportWindowsState, setReportWindowsState] = useState(false); // Конструктор отчёта
    const [reportEditorState, setReportEditorState] = useState(false); // Конструктор заключения по отчёту

    let query;

    const handleInputChange = (e, name) => {
        const value =
            name === "phone_number"
                ? e
                : name === "is_staff" || name === "is_active"
                ? JSON.parse(e.target.value)
                : e.target.value;

        setEmployeeData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const getCustomer = async (id) => {
        try {
            const response = await getData(`${URL}/${id}`, {
                Accept: "application/json",
            });
            setEmployeeData(response.data);

            // // Получаем кредиторов
            // setLenders(
            //     response.data?.creditor_responsible_persons?.flatMap(
            //         (item) => item
            //     ) || []
            // );

            // setFilteredLenders(
            //     response.data?.creditor_responsible_persons?.flatMap(
            //         (item) => item
            //     ) || []
            // );

            // Получаем ответственные лица заказчика
            // setCustomers(response.data?.contragent_responsible_persons || []);

            await Promise.all([
                // fetchIndustries(),
                // fetchContragents(),
                // fetchBanks(),
                // getReports(),
                // getTeam(),
                // getServices(),
            ]);
        } catch (error) {
            console.error("Ошибка при загрузке проекта:", error);
        }
    };

    useEffect(() => {
        if (contragentId) {
            getCustomer(contragentId);
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
                                        {customerData.name}ООО "СГРК"
                                    </div>

                                    <span className="text-green-500">
                                        активный
                                    </span>
                                </div>
                            </div>

                            {mode === "edit" && (
                                <button
                                    type="button"
                                    className="update-icon"
                                    title="Обновить данные сотрудника"
                                    onClick={() => {}}
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
                                        name="qualification"
                                        onChange={(e) =>
                                            handleInputChange(
                                                e,
                                                "qualification"
                                            )
                                        }
                                        value={customerData.qualification}
                                        disabled={mode == "read" ? true : false}
                                    ></textarea>
                                </div>

                                <div className="flex flex-col gap-2 justify-between">
                                    <span className="text-gray-400">
                                        Сайт компании
                                    </span>
                                    <div className="border-2 border-gray-300 p-1 px-5 h-[32px]">
                                        <input
                                            className="w-full"
                                            type="text"
                                            placeholder=""
                                            value={customerData.email}
                                            onChange={(e) =>
                                                handleInputChange(e, "email")
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
                                        <FilledExecutorBlock
                                        // key={customer.id}
                                        // contanct={customer}
                                        />
                                        <FilledExecutorBlock
                                        // key={customer.id}
                                        // contanct={customer}
                                        />
                                        <FilledExecutorBlock
                                        // key={customer.id}
                                        // contanct={customer}
                                        />
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
                                    name="description"
                                    disabled={mode == "read" ? true : false}
                                    // value={projectData?.description || ""}
                                    // onChange={(e) =>
                                    //     handleInputChange(e, "description")
                                    // }
                                />
                            </div>

                            <div className="flex flex-col gap-2 flex-grow">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">
                                        Проекты ()
                                    </span>
                                </div>
                                <div className="border-2 border-gray-300 py-5 px-4 min-h-full flex-grow max-h-[300px] overflow-x-hidden overflow-y-auto">
                                    <ul className="grid gap-3">
                                        <li className="grid items-center grid-cols-[1fr_20%_1fr] gap-3 mb-2 text-gray-400">
                                            <span>Проект</span>
                                            <span>Бюджет</span>
                                            <span>Период реализации</span>
                                        </li>
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
                                    <ProjectStatisticsBlock />

                                    <div className="flex flex-col gap-2 flex-grow">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400">
                                                История проекта
                                            </span>
                                        </div>

                                        <div className="border-2 border-gray-300 py-5 px-4 min-h-full flex-grow max-h-[300px] overflow-x-hidden overflow-y-auto">
                                            {!reportWindowsState ? (
                                                <ul className="grid gap-3">
                                                    <li className="grid items-center grid-cols-[25%_18%_25%_18%] gap-3 mb-2 text-gray-400">
                                                        <span>Отчет</span>
                                                        <span>Статус</span>
                                                        <span>
                                                            Период выполнения
                                                        </span>
                                                        <span>
                                                            Общая оценка
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

export default CustomerCard;
