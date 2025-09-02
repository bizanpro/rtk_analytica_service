import { useState, useEffect } from "react";

import buildQueryParams from "../../../utils/buildQueryParams";
import getData from "../../../utils/getData";

const tabOptions = [
    { id: "general_summary", label: "Общий статус" },
    { id: "bank_summary", label: "Проблемы" },
    { id: "customer_summary", label: "Перспективы" },
    { id: "contractor_summary", label: "Команда" },
    { id: "team_summary", label: "Суды, претензии" },
    { id: "risk_summary", label: "Прочее" },
];

const ManagerReportsWindow = ({ selectedReportMonth }) => {
    const [reportsData, setReportsData] = useState({});
    const [currentTab, setCurrentTab] = useState("general_summary");

    const getManagementReportsDashboard = () => {
        const queryString = buildQueryParams(selectedReportMonth);

        getData(
            `${
                import.meta.env.VITE_API_URL
            }company/management-reports-dashboard?${queryString}`
        ).then((response) => {
            if (response?.status == 200) {
                setReportsData(response.data);
                console.log(response.data);
            }
        });
    };

    useEffect(() => {
        if (Object.keys(selectedReportMonth).length > 0) {
            getManagementReportsDashboard();
        }
    }, [selectedReportMonth]);

    return (
        <div className="border-2 border-gray-300 py-5 px-3 bg-white">
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
                        disabled
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

export default ManagerReportsWindow;
