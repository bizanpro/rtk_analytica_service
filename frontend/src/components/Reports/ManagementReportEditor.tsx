import { useState } from "react";

import handleStatusString from "../../utils/handleStatusString";
import AutoResizeTextarea from "../AutoResizeTextarea";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import Popup from "../Popup/Popup";

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
    const [saveBeforeClose, setSaveBeforeClose] = useState(false);
    const [isChanged, setIsChanged] = useState(false);

    const handleTextArea = (e, name) => {
        setManagementReportData((prev) => ({
            ...prev,
            [name]: e.target.value,
        }));

        if (!isChanged) {
            setIsChanged(true);
        }
    };

    const resetState = () => {
        setSaveBeforeClose(false);
        setIsChanged(false);
        closeEditor();
    };

    return !saveBeforeClose ? (
        <div
            className={`bottom-sheet bottom-sheet_desk ${
                editorState ? "active" : ""
            }`}
            onClick={() => resetState()}
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
                                    onClick={() => {
                                        if (isChanged) {
                                            setSaveBeforeClose(true);
                                        } else {
                                            resetState();
                                        }
                                    }}
                                    className="report-window__close-btn"
                                    title="Закрыть отчёт"
                                ></button>
                            </div>

                            <div className="report-window__body">
                                <div className="overflow-hidden">
                                    <div
                                        className="card__tabs-wrapper"
                                        style={{ position: "relative" }}
                                    >
                                        <Swiper
                                            modules={[Navigation]}
                                            slidesPerView="auto"
                                            spaceBetween={12}
                                            navigation={true}
                                            className="card__tabs-swiper"
                                        >
                                            {TAB_OPTIONS.map((tab) => (
                                                <SwiperSlide
                                                    key={tab.id}
                                                    style={{ width: "auto" }}
                                                >
                                                    <li className="card__tabs-item radio-field_tab">
                                                        <input
                                                            type="radio"
                                                            id={tab.id}
                                                            checked={
                                                                currentTab ===
                                                                tab.id
                                                            }
                                                            onChange={() =>
                                                                setCurrentTab(
                                                                    tab.id
                                                                )
                                                            }
                                                        />
                                                        <label htmlFor={tab.id}>
                                                            {tab.label}
                                                        </label>
                                                    </li>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                </div>

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

                            <div
                                className={`bottom-nav ${
                                    isChanged ? "" : "bottom-nav_disabled"
                                }`}
                            >
                                <div className="container">
                                    {mode === "edit" && (
                                        <>
                                            <button
                                                type="button"
                                                className="cancel-button"
                                                onClick={() => {
                                                    updateReport(
                                                        managementReportData,
                                                        "save"
                                                    );
                                                    resetState();
                                                }}
                                                title="Сохранить без утверждения"
                                            >
                                                Сохранить без утверждения
                                            </button>

                                            <button
                                                type="button"
                                                className="action-button"
                                                onClick={() => {
                                                    updateReport(
                                                        managementReportData,
                                                        "approve"
                                                    );
                                                    resetState();
                                                }}
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
    ) : (
        <Popup
            className="report-window-popup"
            onClick={() => resetState()}
            title={"Вы покидаете страницу"}
        >
            <div className="action-form__body">
                <p>
                    Если не сохранить изменения, новые данные будут безвозвратно
                    утеряны.
                </p>
            </div>

            <div className="action-form__footer">
                <div
                    className="report-window-alert__actions"
                    style={{ maxWidth: "100%" }}
                >
                    <button
                        type="button"
                        onClick={() => {
                            resetState();
                        }}
                        className="cancel-button"
                        title="Не сохранять"
                    >
                        Не сохранять
                    </button>

                    <button
                        type="button"
                        className="action-button"
                        onClick={() => {
                            updateReport(managementReportData, "approve");
                            resetState();
                        }}
                        title="Сохранить изменения"
                    >
                        Сохранить изменения
                    </button>
                </div>
            </div>
        </Popup>
    );
};

export default ManagementReportEditor;
