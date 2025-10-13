import { useState } from "react";

import handleStatusString from "../../utils/handleStatusString";

import AutoResizeTextarea from "../AutoResizeTextarea";

const TAB_OPTIONS = [
    { id: "status_summary", label: "Общий статус" },
    { id: "problems", label: "Проблемы" },
    { id: "prospects", label: "Перспективы" },
    { id: "team", label: "Команда" },
    { id: "legal_issues", label: "Суды, претензии" },
    { id: "misc", label: "Прочее" },
];

const ManagementReportEditor = ({
    editorState,
    managementReportData,
    setManagementReportData,
    closeEditor,
    updateReport,
    mode,
}: {
    editorState: boolean;
    managementReportData: object[];
    setManagementReportData: React.Dispatch<React.SetStateAction<boolean>>;
    closeEditor: () => void;
    updateReport: () => void;
    mode: string;
}) => {
    const [currentTab, setCurrentTab] = useState("status_summary");

    const handleTextArea = (e, name) => {
        setManagementReportData((prev) => ({
            ...prev,
            [name]: e.target.value,
        }));
    };

    return (
        <div
            className={`bottom-sheet bottom-sheet_desk ${
                editorState ? "active" : ""
            }`}
            onClick={() => closeEditor()}
        >
            <div
                className="bottom-sheet__wrapper"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bottom-sheet__icon"></div>

                <div className="bottom-sheet__body">
                    <div
                        className={`report-window report-rate-editor ${
                            mode === "read" && "report-rate-editor_read-mode"
                        }`}
                    >
                        <div className="report-window__wrapper">
                            <div className="report-window__header">
                                <div className="report-window__name">
                                    {managementReportData.name} /{" "}
                                    {managementReportData.report_month}
                                </div>

                                <button
                                    type="button"
                                    onClick={closeEditor}
                                    className="report-window__close-btn"
                                    title="Закрыть отчёт"
                                ></button>
                            </div>

                            <div className="report-window__body">
                                <ul className="card__tabs">
                                    {TAB_OPTIONS.map((tab) => (
                                        <li
                                            key={tab.id}
                                            className="card__tabs-item radio-field_tab"
                                        >
                                            <input
                                                type="radio"
                                                id={tab.id}
                                                checked={currentTab === tab.id}
                                                onChange={() =>
                                                    setCurrentTab(tab.id)
                                                }
                                            />
                                            <label htmlFor={tab.id}>
                                                {tab.label}
                                            </label>
                                        </li>
                                    ))}
                                </ul>

                                <div className="report-window__field">
                                    <label className="form-label">Статус</label>

                                    {managementReportData.status && (
                                        <div
                                            className={`form-field form-field__status ${handleStatusString(
                                                managementReportData.status
                                            )}`}
                                        >
                                            <span></span>
                                            {managementReportData.status}
                                        </div>
                                    )}
                                </div>

                                <div className="project-card__description">
                                    <div className="form-label">Описание</div>

                                    <AutoResizeTextarea
                                        className="form-textarea"
                                        placeholder="Добавьте описание"
                                        type="text"
                                        name="description"
                                        value={
                                            managementReportData[currentTab] ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleTextArea(e, currentTab)
                                        }
                                        disabled={mode == "read"}
                                    />
                                </div>
                            </div>

                            <div className="bottom-nav">
                                <div className="container">
                                    {mode === "edit" && (
                                        <>
                                            <button
                                                type="button"
                                                className="cancel-button"
                                                onClick={() =>
                                                    updateReport(
                                                        managementReportData,
                                                        "save"
                                                    )
                                                }
                                                title="Сохранить без утверждения"
                                            >
                                                Сохранить без утверждения
                                            </button>

                                            <button
                                                type="button"
                                                className="action-button"
                                                onClick={() =>
                                                    updateReport(
                                                        managementReportData,
                                                        "approve"
                                                    )
                                                }
                                                title="Сохранить и утвердить"
                                            >
                                                Сохранить и утвердить
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagementReportEditor;
