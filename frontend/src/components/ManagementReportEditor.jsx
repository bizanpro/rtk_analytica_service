import { useState } from "react";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

const ManagementReportEditor = ({
    managementReportData,
    setManagementReportData,
    setManagementEditorState,
    mode,
    sendNewReport,
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

    const capitalizeFirstLetter = (string) => {
        if (!string) return "";
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const formatted = format(
        parseISO(managementReportData?.report_month),
        "LLLL yyyy",
        { locale: ru }
    );

    return (
        <div className="border-2 border-gray-300 py-5 px-3">
            <div className="flex items-center justify-between">
                <div className="text-2xl w-full mb-3">
                    {capitalizeFirstLetter(formatted)}
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setManagementEditorState(false);
                    }}
                    className="border rounded-[50%] flex items-center justify-center w-[20px] h-[20px] leading-4"
                    title="Закрыть отчёт"
                >
                    x
                </button>
            </div>

            <div>
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
                    className="w-full border-2 border-gray-300 p-5 min-h-[250px] max-h-[500px]"
                    placeholder="Добавьте описание"
                    type="text"
                    name={currentTab}
                    value={managementReportData[currentTab] || ""}
                    onChange={(e) => handleTextArea(e, currentTab)}
                    disabled={mode === "read" ? true : false}
                ></textarea>
            </div>

            <div className="mt-5 grid grid-cols-2 items-center gap-6">
                {/* {mode === "edit" && ( */}
                {/* <> */}
                <button
                    type="button"
                    className="border rounded-lg py-2 px-5 bg-black text-white"
                    onClick={() =>
                        managementReportData.id
                            ? updateReport(managementReportData)
                            : sendNewReport(managementReportData)
                    }
                    title="Сохранить и утвердить"
                >
                    Сохранить и утвердить
                </button>

                <button
                    type="button"
                    className="border rounded-lg py-2 px-5"
                    onClick={() =>
                        managementReportData.id
                            ? updateReport(managementReportData)
                            : sendNewReport(managementReportData)
                    }
                    title="Сохранить без утверждения"
                >
                    Сохранить без утверждения
                </button>
                {/* </>
                )} */}
            </div>
        </div>
    );
};

export default ManagementReportEditor;
