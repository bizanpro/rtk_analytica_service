type Props = {
    openEditor: () => void;
    reportData: object;
};

const ManagementReportListItem = ({ openEditor, reportData }: Props) => {
    return (
        <li
            className="grid items-center grid-cols-[20%_15%_20%_1fr] gap-3 cursor-pointer"
            // onClick={() => openEditor(reportData)}
        >
            <div className="text-lg">{reportData.report_month}</div>
            <div></div>
            <div>{reportData.status}</div>
            <div className="text-lg">{reportData.physical_person?.name}</div>
        </li>
    );
};

export default ManagementReportListItem;
