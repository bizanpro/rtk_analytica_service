import { useState } from "react";

import getData from "../../../utils/getData";

import CompletedReportItem from "./CompletedReportItem";
import ProjectReportWindow from "../../ProjectCard/ProjectReportWindow";

const CompletedReportsList = ({ completedReports }) => {
    const [reportWindowsState, setReportWindowsState] = useState(false);

    const [contracts, setContracts] = useState([]);
    const [reportId, setReportId] = useState(null);

    // Получение договоров для детального отчёта
    const getContracts = (contragentId) => {
        getData(
            `${
                import.meta.env.VITE_API_URL
            }contragents/${contragentId}/contracts`
        ).then((response) => {
            if (response?.status == 200) {
                setContracts(response.data);
            }
        });
    };

    // Открытие редактора отчёта
    const openReportEditor = (reportData) => {
        getContracts(reportData.contragent?.id);
        setReportId(reportData.id);

        if (reportData.id) {
            setReportWindowsState(true);
        }
    };

    return (
        <div className="flex flex-col gap-3 border border-gray-300 p-4">
            <h2 className="mb-4 text-3xl font-semibold tracking-tight text-balance">
                Завершённые отчёты ({completedReports.items?.length || 0})
            </h2>

            <ul className="max-h-[280px] overflow-x-hidden overflow-y-auto p-4 flex flex-col gap-3">
                <li className="grid items-center grid-cols-[30%_34%_34%] justify-between gap-3 mb-2 text-gray-400">
                    <span>Проект</span>
                    <span>Отчёт</span>
                    <span>Период. выполн.</span>
                </li>

                {completedReports.items?.length > 0 &&
                    completedReports.items.map((report) => (
                        <CompletedReportItem
                            key={report.id}
                            {...report}
                            openReportEditor={openReportEditor}
                        />
                    ))}
            </ul>

            {reportWindowsState && (
                <div
                    className="w-full max-w-[500px] bg-white border-2 border-gray-300 overflow-x-hidden overflow-y-auto fixed top-[5%] bottom-[5%] right-[2%] w-[35%] p-3"
                    style={{ minHeight: "calc(100vh - 10%)" }}
                >
                    <ProjectReportWindow
                        reportWindowsState={setReportWindowsState}
                        contracts={contracts}
                        reportId={reportId}
                        setReportId={setReportId}
                        mode={"read"}
                    />
                </div>
            )}
        </div>
    );
};

export default CompletedReportsList;
