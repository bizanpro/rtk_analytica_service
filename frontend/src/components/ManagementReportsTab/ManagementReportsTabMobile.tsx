import { useState } from "react";

import ManagementReportListItem from "./ManagementReportListItem";
import ReportRateEditor from "../ReportRateEditor/ReportRateEditor";

const ManagementReportsTab = ({
    managementReports,
    mode,
}: {
    managementReports: [];
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

    return (
        <>
            <ul className="reports__list">
                {managementReports.length > 0 &&
                    managementReports.map((item) => (
                        <ManagementReportListItem
                            openEditor={openRateReportEditor}
                            reportData={item}
                        />
                    ))}
            </ul>

            <ReportRateEditor
                rateEditorState={rateEditorState}
                reportData={reportData}
                closeEditor={closeRateReportEditor}
                mode={mode}
            />
        </>
    );
};

export default ManagementReportsTab;
