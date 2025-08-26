import { useState, useEffect } from "react";

import getData from "../../utils/getData";

import ManagementReportListItem from "./ManagementReportListItem";
import ReportRateEditor from "../Reports/ReportRateEditor";

import "./ManagementReports.scss";

const URL = `${import.meta.env.VITE_API_URL}projects`;

interface ManagementReportsTabProps {
    projectId: number;
    setManagementReports: React.Dispatch<React.SetStateAction<any[]>>;
}

const ManagementReportsTab = ({
    projectId,
    setManagementReports,
}: ManagementReportsTabProps) => {
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
                setManagementReports(response.data);
            }
        });
    };

    useEffect(() => {
        getList();
    }, []);

    return !rateEditorState ? (
        <ul className="reports__list">
            <li
                className="management-reports__item"
                // onClick={() => openEditor(reportData)}
            >
                <div className="management-reports__item__col">
                    <p>Март 2025</p>
                </div>

                <div className="management-reports__item__col">
                    <p>Прохоров Евгений Петрович</p>
                </div>

                <div
                    className={`reports__list-item__status status reports__list-item__status_completed completed`}
                >
                    Утверждён
                </div>

                <div className="management-reports__item__col">
                    <nav className={`rate-switch rate-switch_green`}>
                        <button
                            type="button"
                            className="rate-switch__button"
                        ></button>
                        <button
                            type="button"
                            className="rate-switch__button"
                        ></button>
                        <button
                            type="button"
                            className="rate-switch__button"
                        ></button>
                    </nav>
                </div>
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
