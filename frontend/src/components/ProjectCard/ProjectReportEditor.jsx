import { useState, useEffect } from "react";
import RateBlock from "../RateBlock";

const ProjectReportEditor = ({ reportEditorName }) => {
    const rateTitles = ["Общая", "Банк", "Заказчик", "Команда"];
    const [reportData, setReportData] = useState({ resume: "Text" });
    const [currentTab, setCurrentTab] = useState("resume");
    const tabOptions = [
        { id: "resume", label: "Резюме" },
        { id: "bank", label: "Банк" },
        { id: "customer", label: "Заказчик" },
        { id: "team", label: "Команда" },
        { id: "risks", label: "Риски" },
    ];

    const handleTextArea = (e, name) => {
        setReportData({ ...reportData, [name]: e.target.value });
    };

    useEffect(() => {
        console.log(reportData);
    }, [reportData]);

    return (
        <div className="border border-gray-400 py-5 px-3">
            <div className="text-2xl w-full mb-3">{reportEditorName}</div>

            <div className="grid gap-3 grid-cols-2 mb-5">
                <div className="radio-field">
                    <input
                        type="radio"
                        name="create_report"
                        id="createReportYes"
                    />
                    <label htmlFor="createReportYes">Создать отчёт</label>
                </div>
                <div className="radio-field">
                    <input
                        type="radio"
                        name="create_report"
                        id="createReportNo"
                    />
                    <label htmlFor="createReportNo">
                        Запросить у руководителя
                    </label>
                </div>
            </div>

            <div className="mb-10">
                <span className="text-gray-400 block mb-3">Оценка</span>

                <div className="flex flex-col gap-2">
                    {rateTitles.map((title) => (
                        <RateBlock title={title} key={title} />
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
                        value={reportData[currentTab] || ""}
                        onChange={(e) => handleTextArea(e, currentTab)}
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

export default ProjectReportEditor;
