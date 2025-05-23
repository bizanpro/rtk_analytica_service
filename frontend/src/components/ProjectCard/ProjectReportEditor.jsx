import { useState } from "react";
import RateBlock from "../RateBlock";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProjectReportEditor = ({
    reportData,
    reportEditorName,
    postData,
    reportId,
    setReportWindowsState,
    setReportEditorState,
    setReportId,
    getProject,
    projectId,
    mode,
}) => {
    const rateTitles = [
        { id: "general_assessment", label: "Общая" },
        { id: "bank_assessment", label: "Банк" },
        { id: "customer_assessment", label: "Заказчик" },
        { id: "contractor_assessment", label: "Подрядчик" },
        { id: "team_assessment", label: "Команда" },
    ];

    const [extendReportData, setExtendReportData] = useState(reportData || {});

    const [currentTab, setCurrentTab] = useState("general_summary");
    const tabOptions = [
        { id: "general_summary", label: "Резюме" },
        { id: "bank_summary", label: "Банк" },
        { id: "customer_summary", label: "Заказчик" },
        { id: "contractor_summary", label: "Подрядчик" },
        { id: "team_summary", label: "Команда" },
        { id: "risk_summary", label: "Риски" },
    ];

    let query;

    const handleTextArea = (e, name) => {
        setExtendReportData({ ...extendReportData, [name]: e.target.value });
    };

    const handleTRating = (name, value) => {
        setExtendReportData({ ...extendReportData, [name]: +value });
    };

    const sendReport = () => {
        query = toast.loading("Выполняется отправка", {
            containerId: "report",
            position: "top-center",
        });

        postData(
            "POST",
            `${import.meta.env.VITE_API_URL}reports`,
            extendReportData
        ).then((response) => {
            if (response?.ok) {
                toast.update(query, {
                    render: response.message,
                    type: "success",
                    containerId: "report",
                    isLoading: false,
                    autoClose: 1200,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                });
                getProject(projectId);
                setReportWindowsState(false);
                setReportEditorState(false);
            }
        });
    };

    const updateReport = () => {
        query = toast.loading("Обновление", {
            containerId: "report",
            position: "top-center",
        });

        postData(
            "PATCH",
            `${import.meta.env.VITE_API_URL}reports/${reportId}`,
            extendReportData
        ).then((response) => {
            if (response?.ok) {
                toast.update(query, {
                    render: response.message,
                    type: "success",
                    containerId: "report",
                    isLoading: false,
                    autoClose: 1200,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                });
                getProject(projectId);
                setReportWindowsState(false);
                setReportEditorState(false);
            }
        });
    };

    return (
        <div className="border-2 border-gray-300 py-5 px-3 bg-white">
            <ToastContainer containerId="report" />

            <div className="text-2xl w-full mb-3">{reportEditorName}</div>

            <div className="grid gap-3 grid-cols-2 mb-5 items-stretch">
                <div className="radio-field">
                    <input
                        type="radio"
                        name="create_report"
                        id="createReportYes"
                        disabled={mode === "read" ? true : false}
                    />
                    <label
                        className="flex items-center h-[100%]"
                        style={{ display: "flex" }}
                        htmlFor="createReportYes"
                    >
                        Создать заключение по отчёту
                    </label>
                </div>
                <div className="radio-field">
                    <input
                        type="radio"
                        name="create_report"
                        id="createReportNo"
                        disabled={mode === "read" ? true : false}
                    />
                    <label
                        className="flex items-center h-[100%]"
                        style={{ display: "flex" }}
                        htmlFor="createReportNo"
                    >
                        Запросить заключение по отчёту у руководителя
                    </label>
                </div>
            </div>

            <div className="mb-10">
                <span className="text-gray-400 block mb-3">Оценка</span>

                <div className="flex flex-col gap-2">
                    {rateTitles.map(({ id, label }) => (
                        <RateBlock
                            name={id}
                            title={label}
                            key={id}
                            value={extendReportData[id]}
                            handleTRating={handleTRating}
                            mode={mode}
                        />
                    ))}
                </div>
            </div>

            <div>
                <div className="flex items-center gap-2 text-gray-400 block mb-5">
                    Отчёт{" "}
                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] min-w-[20px] h-[20px] mr-3">
                        ?
                    </span>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-2 mb-3">
                            {tabOptions.map((tab) => (
                                <div key={tab.id} className="radio-field_tab">
                                    <input
                                        type="radio"
                                        name="report"
                                        id={tab.id}
                                        checked={currentTab === tab.id}
                                        onChange={() => setCurrentTab(tab.id)}
                                    />
                                    <label
                                        className="border rounded-md"
                                        htmlFor={tab.id}
                                    >
                                        {tab.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <textarea
                        className="w-full border-2 border-gray-300 p-5 min-h-[500px] max-h-[600px]"
                        placeholder="Опишите ситуацию"
                        type="text"
                        name={currentTab}
                        value={extendReportData[currentTab] || ""}
                        onChange={(e) => handleTextArea(e, currentTab)}
                        disabled={mode === "read" ? true : false}
                    ></textarea>
                </div>
            </div>

            <div className="mt-5 flex items-center gap-6 justify-between">
                {mode === "edit" ? (
                    <>
                        <button
                            type="button"
                            className="rounded-lg py-3 px-5 bg-black text-white flex-[1_1_50%]"
                            onClick={() =>
                                reportId ? updateReport() : sendReport()
                            }
                            title="Сохранить отчёт"
                        >
                            Сохранить
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setReportEditorState(false);
                                setReportId(null);
                            }}
                            className="border rounded-lg py-3 px-5 flex-[1_1_50%]"
                            title="Отменить сохранение отчёта"
                        >
                            Отменить
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={() => {
                            setReportEditorState(false);
                            setReportId(null);
                        }}
                        className="border rounded-lg py-3 px-5 flex-[1_1_50%]"
                        title="Закрыть отчёт"
                    >
                        Закрыть
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProjectReportEditor;
