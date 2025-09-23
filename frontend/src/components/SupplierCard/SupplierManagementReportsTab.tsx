import { useState } from "react";

import SupplierManagementReportListItem from "./SupplierManagementReportListItem";
import ReportRateEditor from "../Reports/ReportRateEditor";

const SupplierManagementReportsTab = ({
    managerReports,
    mode,
}: {
    managerReports: [];
    mode: string;
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
            <li className="grid items-center grid-cols-[18%_15%_46px_15%_1fr] gap-[20px] mb-2 text-gray-400">
                <span>Проект</span>
                <span>Месяц</span>
                <span>Оценка</span>
                <span>Статус</span>
                <span>Отвественный</span>
            </li>

            {managerReports.length > 0 &&
                managerReports.map((item) => (
                    <SupplierManagementReportListItem
                        openEditor={openRateReportEditor}
                        reportData={item}
                    />
                ))}
        </ul>
    ) : (
        <ReportRateEditor
            reportData={reportData}
            closeEditor={closeRateReportEditor}
            mode={mode}
        />
    );
};

export default SupplierManagementReportsTab;
