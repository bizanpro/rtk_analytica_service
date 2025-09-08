import { useState, useEffect } from "react";

import buildQueryParams from "../../../utils/buildQueryParams";
import getData from "../../../utils/getData";
import formatDateYM from "../../../utils/formatDateYM";

const tabOptions = [
    { id: "status_summary", label: "Общий статус" },
    { id: "problems", label: "Проблемы" },
    { id: "prospects", label: "Перспективы" },
    { id: "team", label: "Команда" },
    { id: "legal_issues", label: "Суды, претензии" },
    { id: "misc", label: "Прочее" },
];

const ManagerReportsWindow = ({ selectedReportMonth }) => {
    const [reportsData, setReportsData] = useState({});
    const [currentTab, setCurrentTab] = useState("status_summary");
    const [currentReport, setCurrentReport] = useState({});
    const [selectedId, setSelectedId] = useState(null);

    const getManagementReportsDashboard = () => {
        const queryString = buildQueryParams(selectedReportMonth);

        getData(
            `${
                import.meta.env.VITE_API_URL
            }company/management-reports-dashboard?${queryString}`
        ).then((response) => {
            if (response?.status == 200) {
                setReportsData(response.data);
            }
        });
    };

    const getCurrentReport = (id) => {
        setCurrentReport(
            reportsData.reports?.find((report) => report.id === id)
        );
    };

    useEffect(() => {
        if (reportsData?.reports_by_type?.length > 0) {
            const firstId = reportsData.reports_by_type[0].reports[0].id;
            setSelectedId(firstId);
            getCurrentReport(firstId);
        }
    }, [reportsData]);

    useEffect(() => {
        if (Object.keys(selectedReportMonth).length > 0) {
            getManagementReportsDashboard();
        }
    }, [selectedReportMonth]);

    return (
        <div className="border-1 border-gray-300 p-4">
            <div className="flex items-center gap-2 w-full mb-3">
                <h2 className="mb-4 text-3xl font-semibold tracking-tight text-balance">
                    Отчёты менеджмента /{" "}
                    {reportsData.period?.report_month &&
                        formatDateYM(reportsData.period?.report_month)}
                </h2>
            </div>

            <div className="flex gap-5 mb-5 items-stretch overflow-x-auto overflow-y-hidden pb-1">
                {reportsData.reports_by_type?.map((item) => {
                    const id = item.reports[0].id;
                    return (
                        <div className="radio-field" key={id}>
                            <input
                                type="radio"
                                name="management_tab"
                                id={id}
                                onChange={() => {
                                    setSelectedId(id);
                                    getCurrentReport(id);
                                }}
                                checked={selectedId === id}
                            />
                            <label
                                htmlFor={id}
                                style={{
                                    fontSize: "16px",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {item.type_name}
                            </label>
                        </div>
                    );
                })}
            </div>

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
                    className="w-full border-2 border-gray-300 p-5 h-[350px] resize-none"
                    placeholder="Описание"
                    type="text"
                    name={currentTab}
                    value={currentReport[currentTab] || ""}
                    disabled
                ></textarea>
            </div>
        </div>
    );
};

export default ManagerReportsWindow;
