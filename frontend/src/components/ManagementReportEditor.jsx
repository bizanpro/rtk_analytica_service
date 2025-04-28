import { useState } from "react";

import postData from "../utils/postData"

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManagementReportEditor = ({ managementReportData, setManagementEditorState }) => {
    const [extendReportData, setExtendReportData] = useState(managementReportData || {});

    const [currentTab, setCurrentTab] = useState("status_summary");
    const tabOptions = [
        { id: "status_summary", label: "Общий статус" },
        { id: "problems", label: "Проблемы" },
        { id: "prospects", label: "Перспективы" },
        { id: "team", label: "Команда" },
        { id: "legal_issues", label: "Суды, претензии" },
        { id: "misc", label: "Прочее" },
    ];

    let query;

    const handleTextArea = (e, name) => {
        setExtendReportData({ ...extendReportData, [name]: e.target.value });
    };

    const sendReport = () => {
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
                    render: response.message,
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

    return (
        <div className="border-2 border-gray-300 py-5 px-3">
            <ToastContainer containerId="report" />

            <div className="text-2xl w-full mb-3">{managementReportData.report_month}</div>

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
                    className="w-full border-2 border-gray-300 p-5 min-h-[400px] max-h-[500px]"
                    placeholder="Добавьте описание"
                    type="text"
                    name={currentTab}
                    value={extendReportData[currentTab] || ""}
                    onChange={(e) => handleTextArea(e, currentTab)}
                    disabled={mode === "read" ? true : false}
                ></textarea>
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
                                setManagementEditorState(false);
                                // setReportId(null);
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
                            setManagementEditorState(false);
                            // setReportId(null);
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

export default ManagementReportEditor;
