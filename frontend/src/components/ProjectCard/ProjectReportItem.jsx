const ProjectReportItem = ({
    id,
    report_period_code,
    status,
    report_period,
    days,
    execution_period_code,
    openReportEditor,
    deleteReport,
    mode,
}) => {
    return (
        <li
            className="grid items-center grid-cols-[33%_25%_33%_1fr] gap-4 cursor-pointer"
            onClick={() => {
                openReportEditor(id);
            }}
        >
            <div className="flex flex-col">
                <div className="text-lg">{report_period_code}</div>
                <span className="text-sm">{report_period}</span>
            </div>

            <div className="bg-gray-200 py-1 px-2 text-center rounded-md">
                {status}
            </div>

            <div className="flex gap-3 items-center">
                <div className="flex flex-col flex-grow">
                    <div className="text-lg">{days}</div>
                    <span className="text-sm">{execution_period_code}</span>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2">
                {mode === "edit" && (
                    <button
                        className="delete-icon flex-none w-[20px] h-[20px]"
                        title="Удалить отчёт"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteReport(id);
                        }}
                    ></button>
                )}
            </div>
        </li>
    );
};

export default ProjectReportItem;
