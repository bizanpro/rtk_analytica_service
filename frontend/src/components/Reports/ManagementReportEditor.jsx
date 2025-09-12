import { useState } from "react";

import handleStatusString from "../../utils/handleStatusString";

const ManagementReportEditor = ({
    managementReportData,
    setManagementReportData,
    closeManagementReportEditor,
    mode,
    updateReport,
}) => {
    const [currentTab, setCurrentTab] = useState("status_summary");
    const tabOptions = [
        { id: "status_summary", label: "Общий статус" },
        { id: "problems", label: "Проблемы" },
        { id: "prospects", label: "Перспективы" },
        { id: "team", label: "Команда" },
        { id: "legal_issues", label: "Суды, претензии" },
        { id: "misc", label: "Прочее" },
    ];

    const handleTextArea = (e, name) => {
        setManagementReportData((prev) => ({
            ...prev,
            [name]: e.target.value,
        }));
    };

    return (
        <div className="border-2 border-gray-300 py-5 px-3 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-5 flex-grow">
                    <div className="text-2xl">
                        {managementReportData.name} /{" "}
                        {managementReportData.report_month}
                    </div>

                    <div
                        className={handleStatusString(
                            managementReportData.status
                        )}
                    >
                        {managementReportData.status}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        closeManagementReportEditor();
                    }}
                    className="border rounded-[50%] flex items-center justify-center w-[20px] h-[20px] leading-4"
                    title="Закрыть отчёт"
                >
                    x
                </button>
            </div>

            <div className="flex-grow">
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-2 mb-3 overflow-x-auto overflow-y-hidden pb-2">
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
                    className="w-full border-2 border-gray-300 p-5 h-full max-h-[85%] resize-none"
                    placeholder="Добавьте описание"
                    type="text"
                    name={currentTab}
                    value={managementReportData[currentTab] || ""}
                    onChange={(e) => handleTextArea(e, currentTab)}
                    disabled={mode === "read" ? true : false}
                ></textarea>
            </div>

            {mode == "edit" && (
                <div className="mt-5 grid grid-cols-2 items-center gap-6 shrink-0">
                    <button
                        type="button"
                        className="border rounded-lg py-2 px-5 bg-black text-white"
                        onClick={() =>
                            updateReport(managementReportData, "approve")
                        }
                        title="Сохранить и утвердить"
                    >
                        Сохранить и утвердить
                    </button>

                    <button
                        type="button"
                        className="border rounded-lg py-2 px-5"
                        onClick={() =>
                            updateReport(managementReportData, "save")
                        }
                        title="Сохранить без утверждения"
                    >
                        Сохранить без утверждения
                    </button>
                </div>
            )}
        </div>
    );
};

export default ManagementReportEditor;
