import { useState, useEffect } from "react";

import RateSwitch from "../RateSwitch/RateSwitch";

import "./ReportRateEditor.scss";

type Props = {
    closeEditor: () => void;
    updateReportDetails?: (report: object, action: string) => void;
    reportData: object;
    mode: string;
};

const RATE_LABELS = [
    { key: "bank_assessment", label: "Банк" },
    { key: "customer_assessment", label: "Заказчик" },
    { key: "team_assessment", label: "Команда" },
    { key: "contractor_assessment", label: "Подрядчики" },
];

const ReportRateEditor = ({
    closeEditor,
    updateReportDetails,
    reportData,
    mode,
}: Props) => {
    const [reportRateData, setReportRateData] = useState<object>(reportData);

    console.log(mode);
    

    const rateHandler = (name: string, value: string | number) => {
        setReportRateData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (reportData) {
            setReportRateData({ ...reportData });
        }
    }, [reportData]);

    return (
        <div className="bottom-sheet bottom-sheet_desk active">
            <div
                className="bottom-sheet__wrapper"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bottom-sheet__icon"></div>

                <div className="bottom-sheet__body">
                    <div className="report-window report-rate-editor">
                        <div className="report-window__wrapper">
                            <div className="report-window__header">
                                <div>
                                    <div className="report-window__name">
                                        {reportRateData.name}
                                    </div>

                                    {reportRateData.misc?.length > 0 && (
                                        <ul className="misc-list">
                                            {reportRateData.misc?.map(
                                                (item, index) => (
                                                    <li
                                                        className="misc-list__item"
                                                        key={index}
                                                    >
                                                        {item}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={closeEditor}
                                    className="report-window__close-btn"
                                    title="Закрыть отчёт"
                                ></button>
                            </div>

                            <div className="report-window__body">
                                <div className="report-window__field">
                                    <label className="form-label">
                                        Ответственный
                                    </label>

                                    <div className="form-field form-field__text">
                                        {reportRateData.physical_person?.name}
                                    </div>
                                </div>

                                <div className="report-window__field">
                                    <label className="form-label">Статус</label>

                                    {reportRateData.status && (
                                        <div
                                            className={`form-field form-field__status ${
                                                reportRateData.status.toLowerCase() ===
                                                    "утверждён" ||
                                                reportRateData.status.toLowerCase() ===
                                                    "в процессе"
                                                    ? "form-field__status_green"
                                                    : ""
                                            }`}
                                        >
                                            <span></span>
                                            {reportRateData.status}
                                        </div>
                                    )}
                                </div>

                                <div className="report-window__block">
                                    <b className="report-window__subtitle">
                                        Оценка
                                    </b>

                                    <div className="report-rate-editor__rate-block">
                                        <div className="report-window__field border-b border-[#E4E7EC] pb-[10px]">
                                            <div className="form-field form-field_static">
                                                Общая
                                                <RateSwitch
                                                    name={"general_assessment"}
                                                    rateHandler={rateHandler}
                                                    reportRateData={
                                                        reportRateData
                                                    }
                                                    mode={mode}
                                                />
                                            </div>
                                        </div>

                                        {RATE_LABELS.map((item) => (
                                            <div className="form-field form-field_static">
                                                {item.label}

                                                <RateSwitch
                                                    name={item.key}
                                                    rateHandler={rateHandler}
                                                    reportRateData={
                                                        reportRateData
                                                    }
                                                    mode={mode}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="report-window__block">
                                    <b className="report-window__subtitle">
                                        Заключение
                                    </b>

                                    <textarea
                                        className="form-textarea h-[150px]"
                                        placeholder="Описание"
                                        style={{ resize: "none" }}
                                        value={
                                            reportRateData.general_summary || ""
                                        }
                                        onChange={(evt) =>
                                            rateHandler(
                                                "general_summary",
                                                evt.target.value
                                            )
                                        }
                                        disabled={mode === "read"}
                                    ></textarea>
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
                                                    updateReportDetails(
                                                        reportRateData,
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
                                                    updateReportDetails(
                                                        reportRateData,
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

export default ReportRateEditor;
