import { useState, useEffect } from "react";

import getData from "../../utils/getData";

import ManagementReportListItem from "./ManagementReportListItem";
import ReportRateEditor from "../ReportRateEditor/ReportRateEditor";

import "./ManagementReports.scss";

const URL = `${import.meta.env.VITE_API_URL}projects`;

const ManagementReportsTab = ({
    projectId,
    setManagementReports,
    mode,
}: {
    projectId: number;
    setManagementReports: React.Dispatch<React.SetStateAction<object[]>>;
    mode: string;
}) => {
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
            mode={mode}
        />
    );
};

export default ManagementReportsTab;
