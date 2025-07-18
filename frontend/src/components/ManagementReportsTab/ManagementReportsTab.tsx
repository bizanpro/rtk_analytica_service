import { useState, useEffect } from "react";

import getData from "../../utils/getData";

import ManagementReportListItem from "./ManagementReportListItem";
import ReportRateEditor from "../Reports/ReportRateEditor";

const URL = `${import.meta.env.VITE_API_URL}projects`;

const ManagementReportsTab = ({ projectId }: { projectId: number }) => {
    const [list, setList] = useState([]);
    const [rateEditorState, setRateEditorState] = useState(false); // Редактор оценки отчёта
    const [reportData, setReportData] = useState({});

    // Открытие окна редактора оценки отчета
    const openRateReportEditor = (props) => {
        setReportData(props);
        setRateEditorState(true);
    };

    // Закрытие окно редактора отчета менеджмента
    const closeRateReportEditor = () => {
        setReportData({});
        setRateEditorState(false);
    };

    // Обновляем отчет с оценками
    const updateReportDetails = (report, action) => {
        // query = toast.loading("Обновление", {
        //     containerId: "report",
        //     position: "top-center",
        // });
        // report.action = action;
        // postData(
        //     "PATCH",
        //     `${import.meta.env.VITE_API_URL}management-reports/${report.id}`,
        //     report
        // )
        //     .then((response) => {
        //         if (response?.ok) {
        //             toast.update(query, {
        //                 render: "Данные обновлены",
        //                 type: "success",
        //                 containerId: "report",
        //                 isLoading: false,
        //                 autoClose: 1200,
        //                 pauseOnFocusLoss: false,
        //                 pauseOnHover: false,
        //                 position: "top-center",
        //             });
        //             closeRateReportEditor();
        //             getFilteredManagementReports();
        //         } else {
        //             toast.dismiss(query);
        //             toast.error("Ошибка обновления данных", {
        //                 containerId: "report",
        //                 isLoading: false,
        //                 autoClose: 1500,
        //                 pauseOnFocusLoss: false,
        //                 pauseOnHover: false,
        //                 position: "top-center",
        //             });
        //         }
        //     })
        //     .catch((error) => {
        //         toast.dismiss(query);
        //         toast.error(error.message || "Ошибка обновления данных", {
        //             containerId: "report",
        //             isLoading: false,
        //             autoClose: 5000,
        //             pauseOnFocusLoss: false,
        //             pauseOnHover: false,
        //             position: "top-center",
        //         });
        //     });
    };

    const getList = () => {
        getData(`${URL}/${projectId}/manager-reports`).then((response) => {
            if (response.status == 200) {
                setList(response.data);
            }
        });
    };

    useEffect(() => {
        getList();
    }, []);

    return !rateEditorState ? (
        <ul className="grid gap-3">
            <li className="grid items-center grid-cols-[20%_15%_20%_1fr] gap-3 mb-2 text-gray-400">
                <span>Месяц</span>
                <span>Оценка</span>
                <span>Статус</span>
                <span>Отвественный</span>
            </li>

            {list.length > 0 &&
                list.map((item) => (
                    <ManagementReportListItem
                        openEditor={openRateReportEditor}
                        reportData={item}
                    />
                ))}
        </ul>
    ) : (
        <ReportRateEditor
            reportData={reportData}
            closeEditor={closeRateReportEditor}
            updateReportDetails={updateReportDetails}
        />
    );
};

export default ManagementReportsTab;

// interface RateSwitchProps {
//     name: string;
//     rateHandler: (name: string, value: string | number) => void;
//     reportRateData: Record<string, number | undefined>;
// }

// const RateSwitch = ({ name, reportRateData, rateHandler }: RateSwitchProps) => {
