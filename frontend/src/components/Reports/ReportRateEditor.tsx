import { useState, useEffect } from "react";

import RateSwitch from "../RateSwitch/RateSwitch";

type Props = {
    closeEditor: () => void;
    updateReportDetails?: (report: object, action: string) => void;
    reportData: object;
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
}: Props) => {
    const [reportRateData, setReportRateData] = useState<object>(reportData);

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
        <div className="p-5 h-full flex flex-col border-2 border-gray-300">
            <div className="flex items-start gap-2 justify-between mb-3">
                <div className="flex items-start gap-5 flex-grow">
                    <div>
                        <div className="text-2xl mb-2">
                            {reportRateData.name}
                        </div>

                        <div className="text-base mb-2">
                            {reportRateData.physical_person?.name}
                        </div>

                        <ul className="flex items-center gap-2">
                            {reportRateData.misc?.length > 0 &&
                                reportRateData.misc?.map((item, index) => (
                                    <li
                                        className="border rounded-3xl border-gray-300 text-gray-300 py-1.5 px-4 w-fit text-sm"
                                        key={index}
                                    >
                                        {item}
                                    </li>
                                ))}
                        </ul>
                    </div>

                    <div className="mt-2 whitespace-nowrap">
                        {reportRateData.status}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={closeEditor}
                    className="border rounded-[50%] flex items-center justify-center w-[20px] h-[20px] leading-4 mt-2"
                    title="Закрыть отчёт"
                >
                    x
                </button>
            </div>

            <div className="flex-grow flex flex-col">
                <div className="flex items-center gap-2 mb-2 border-b border-gray-300 pb-2">
                    <span className="flex items-center gap-2 text-gray-400">
                        Оценка
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </span>
                </div>

                <div className="py-1">
                    <div className="py-2 flex items-center">
                        <div className="w-[90px] mr-5">Общая</div>

                        <RateSwitch
                            name={"general_assessment"}
                            rateHandler={rateHandler}
                            reportRateData={reportRateData}
                        />
                    </div>
                </div>

                <div className="border-t border-b border-gray-300 py-1 my-2">
                    {RATE_LABELS.map((item) => (
                        <div className="py-2 flex items-center">
                            <div className="w-[90px] mr-5">{item.label}</div>

                            <RateSwitch
                                name={item.key}
                                rateHandler={rateHandler}
                                reportRateData={reportRateData}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex-grow mt-2 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="flex items-center gap-2 text-gray-400">
                            Заключение
                            <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                ?
                            </span>
                        </span>
                    </div>

                    <textarea
                        className="w-full border-2 border-gray-300 p-5 flex-grow max-h-[300px]"
                        placeholder="Описание"
                        value={reportRateData.general_summary || ""}
                        onChange={(evt) =>
                            rateHandler("general_summary", evt.target.value)
                        }
                    ></textarea>
                </div>
            </div>

            <div className="mt-5 pb-5 grid grid-cols-2 items-center gap-6 shrink-0">
                <button
                    type="button"
                    className="border rounded-lg py-2 px-5 bg-black text-white"
                    onClick={() =>
                        updateReportDetails(reportRateData, "approve")
                    }
                    title="Сохранить и утвердить"
                >
                    Сохранить и утвердить
                </button>

                <button
                    type="button"
                    className="border rounded-lg py-2 px-5"
                    onClick={() => updateReportDetails(reportRateData, "save")}
                    title="Сохранить без утверждения"
                >
                    Сохранить без утверждения
                </button>
            </div>
        </div>
    );
};

export default ReportRateEditor;
