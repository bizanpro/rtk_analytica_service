import { useState, useEffect } from "react";

import getData from "../../utils/getData";

import ManagementReportListItem from "../ManagementReportsTab/ManagementReportListItem";
import ReportRateEditor from "../Reports/ReportRateEditor";

const URL = `${import.meta.env.VITE_API_URL}projects`;

const SupplierManagementReportsTab = ({
    managerReports,
}: {
    managerReports: [];
}) => {
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

    return !rateEditorState ? (
        <ul className="grid gap-3">
            <li className="grid items-center grid-cols-[20%_15%_20%_1fr] gap-3 mb-2 text-gray-400">
                <span>Месяц</span>
                <span>Оценка</span>
                <span>Статус</span>
                <span>Отвественный</span>
            </li>

            {managerReports.length > 0 &&
                managerReports.map((item) => (
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
            // updateReportDetails={updateReportDetails}
        />
    );
};

export default SupplierManagementReportsTab;

// interface RateSwitchProps {
//     name: string;
//     rateHandler: (name: string, value: string | number) => void;
//     reportRateData: Record<string, number | undefined>;
// }

// const RateSwitch = ({ name, reportRateData, rateHandler }: RateSwitchProps) => {
