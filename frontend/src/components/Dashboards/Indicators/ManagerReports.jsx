import { useState, useEffect } from "react";

import buildQueryParams from "../../../utils/buildQueryParams";
import getData from "../../../utils/getData";
import handleStatusString from "../../../utils/handleStatusString";

import ManagementReportEditor from "../../Reports/ManagementReportEditor";

const ManagerReports = ({ selectedReportMonth }) => {
    const [reportsList, setReportsList] = useState({});
    const [managementEditorState, setManagementEditorState] = useState(false); // Редактор отчёта менеджмента
    const [managementReportData, setManagementReportData] = useState({
        name: "",
        physical_person_id: 1,
        report_month: "",
        status_summary: "",
        problems: "",
        prospects: "",
        team: "",
        legal_issues: "",
        misc: "",
    });
    const getManagementReportsDashboard = () => {
        const queryString = buildQueryParams(selectedReportMonth);

        getData(
            `${
                import.meta.env.VITE_API_URL
            }company/management-reports-dashboard?${queryString}`
        ).then((response) => {
            if (response?.status == 200) {
                setReportsList(response.data.reports);
            }
        });
    };

    // Открытие окна редактора отчета менеджмента
    const openManagementReportEditor = (props) => {
        setManagementReportData(props);
        setManagementEditorState(true);
    };

    // Закрытие окно редактора отчета менеджмента
    const closeManagementReportEditor = () => {
        setManagementReportData({});
        setManagementEditorState(false);
    };

    useEffect(() => {
        if (Object.keys(selectedReportMonth).length > 0) {
            getManagementReportsDashboard();
        }
    }, [selectedReportMonth]);

    return (
        <div className="flex flex-col gap-3 border border-gray-300 p-4">
            <h2 className="mb-2 text-2xl font-semibold tracking-tight text-balance">
                Отчёты менеджмента{" "}
                {reportsList.length > 0 && `(${reportsList.length})`}
            </h2>

            <ul className="max-h-[280px] overflow-x-hidden overflow-y-auto p-2 flex flex-col gap-3">
                <li className="grid items-center grid-cols-[1fr_110px_150px_100px] justify-between gap-3 pb-2 text-gray-400 border-b border-gray-300">
                    <span>Отчёт</span>
                    <span>Месяц</span>
                    <span>Ответственный</span>
                    <span>Статус</span>
                </li>

                {reportsList.length > 0 &&
                    reportsList.map((item) => (
                        <li
                            className="grid grid-cols-[1fr_120px_150px_100px] gap-2 items-start cursor-pointer"
                            key={item.id}
                            onClick={() => {
                                openManagementReportEditor(item);
                            }}
                        >
                            <div className="text-lg">{item.name}</div>

                            <div className="text-lg">{item.report_month}</div>

                            <div
                                className="text-lg overflow-hidden text-ellipsis"
                                style={{
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    display: "-webkit-box",
                                }}
                            >
                                {item.physical_person?.name}
                            </div>

                            <div
                                className={`text-lg ${handleStatusString(
                                    item.status
                                )}`}
                            >
                                {item.status}
                            </div>
                        </li>
                    ))}
            </ul>

            {managementEditorState && (
                <div
                    className="fixed w-[100vw] h-[100vh] inset-0 z-2"
                    onClick={() => closeManagementReportEditor()}
                >
                    <div
                        className="bg-white overflow-x-hidden overflow-y-auto fixed top-[5%] bottom-[5%] right-[2%] w-[35%]"
                        style={{ minHeight: "calc(100vh - 10%)" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ManagementReportEditor
                            managementReportData={managementReportData}
                            setManagementReportData={setManagementReportData}
                            closeManagementReportEditor={
                                closeManagementReportEditor
                            }
                            mode={"read"}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerReports;
