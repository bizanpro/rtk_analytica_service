import { useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManagerReportsEditor = ({
    reportData,
    reportEditorName,
    reportId,
    setReportEditorState,
    setReportId,
    mode,
}) => {
    const [extendReportData, setExtendReportData] = useState(reportData || {});

    const [currentTab, setCurrentTab] = useState("general_summary");
    const tabOptions = [
        { id: "general_summary", label: "Общий статус" },
        { id: "bank_summary", label: "Проблемы" },
        { id: "customer_summary", label: "Перспективы" },
        { id: "contractor_summary", label: "Команда" },
        { id: "team_summary", label: "Суды, претензии" },
        { id: "risk_summary", label: "Прочее" },
    ];

    let query;

    const handleTextArea = (e, name) => {
        setExtendReportData({ ...extendReportData, [name]: e.target.value });
    };

    return (
        <div className="border-2 border-gray-300 py-5 px-3 bg-white">
            <ToastContainer containerId="report" />

            <div className="flex items-center gap-2 w-full mb-3">
                <div className="text-2xl"> Отчёты менеджмента / Март 2025</div>

                <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] min-w-[20px] h-[20px] mr-3">
                    ?
                </span>
            </div>

            <div className="grid gap-3 grid-cols-2 mb-5 items-stretch">
                <div className="radio-field">
                    <input
                        type="radio"
                        name="create_report"
                        id="createReportYes"
                        disabled={mode === "read" ? true : false}
                    />
                    <label
                        htmlFor="createReportYes"
                        style={{ fontSize: "16px" }}
                    >
                        Исполнительный директор
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
                        htmlFor="createReportNo"
                        style={{ fontSize: "16px" }}
                        className="text-gray-400"
                    >
                        Операционный директор
                    </label>
                </div>
            </div>

            <div>
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-2 mb-3 overflow-x-auto overflow-y-hidden pb-1">
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
                        placeholder="Описание"
                        type="text"
                        name={currentTab}
                        // value={extendReportData[currentTab] || ""}
                        // onChange={(e) => handleTextArea(e, currentTab)}
                        disabled={mode === "read" ? true : false}
                    ></textarea>
                </div>
            </div>

            {/* <div className="mt-5 flex items-center gap-6 justify-between">
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
            </div> */}
        </div>
    );
};

export default ManagerReportsEditor;
