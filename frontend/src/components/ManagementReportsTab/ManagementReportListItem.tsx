type Props = {
    openEditor: () => void;
    reportData: object;
};

const ManagementReportListItem = ({ openEditor, reportData }: Props) => {
    return (
        <li
            className="grid items-center grid-cols-[20%_65px_20%_1fr] gap-4 cursor-pointer"
            onClick={() => openEditor(reportData)}
        >
            <div className="text-lg">{reportData.report_month}</div>

            <div className="grid grid-cols-[12px_12px_12px] justify-around items-center gap-2">
                <div
                    className={`w-[12px] h-[12px] rounded-[50%] bg-red-400 ${
                        reportData.general_assessment === 0
                            ? "opacity-100"
                            : "opacity-30"
                    }`}
                ></div>

                <div
                    className={`w-[12px] h-[12px] rounded-[50%] bg-yellow-400 ${
                        reportData.general_assessment === 1
                            ? "opacity-100"
                            : "opacity-30"
                    }`}
                ></div>

                <div
                    className={`w-[12px] h-[12px] rounded-[50%] bg-green-400 ${
                        reportData.general_assessment === 2
                            ? "opacity-100"
                            : "opacity-30"
                    }`}
                ></div>
            </div>

            <div>{reportData.status}</div>

            <div className="text-lg">{reportData.physical_person?.name}</div>
        </li>
    );
};

export default ManagementReportListItem;
