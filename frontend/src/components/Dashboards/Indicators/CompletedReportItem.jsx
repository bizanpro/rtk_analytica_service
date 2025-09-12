const CompletedReportItem = ({
    project,
    id,
    report_period_code,
    days,
    execution_period,
    report_period,
    openReportEditor,
}) => {
    return (
        <li
            className="grid items-center grid-cols-[30%_34%_34%] justify-between gap-3 cursor-pointer"
            onClick={() => {
                openReportEditor({
                    id,
                    contragent: project.contragent,
                    report_name: `${project.name} / ${report_period_code}`,
                });
            }}
            title={`Открыть отчёт ${report_period_code}`}
        >
            <div className="flex flex-col">
                <div className="text-lg">{project.name}</div>
                <span className="text-sm text-gray-400">
                    {project.industries[0]}
                </span>
            </div>

            <div className="flex gap-3 items-center">
                <div className="flex flex-col flex-grow">
                    <div className="text-lg">{report_period_code}</div>
                    <span className="text-sm">{report_period}</span>
                </div>
            </div>

            <div className="flex gap-3 items-center">
                <div className="flex flex-col flex-grow">
                    <div className="text-lg">{days}</div>
                    <span className="text-sm">{execution_period}</span>
                </div>
            </div>
        </li>
    );
};

export default CompletedReportItem;
