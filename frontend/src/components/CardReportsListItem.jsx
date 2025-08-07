const CardReportsListItem = ({
    id,
    report_period_code,
    report_period,
    status,
    role,
    execution_period_code,
    days,
    openReportEditor,
    project_name,
    main_industry,
}) => {
    return (
        <li
            className="grid items-center grid-cols-[21%_28%_20%_28%] gap-2 cursor-pointer"
            onClick={() => {
                openReportEditor(id);
            }}
        >
            <div className="flex flex-col">
                <div className="text-lg">{project_name}</div>
                <span className="text-sm text-gray-400">
                    {main_industry}
                </span>
            </div>

            <div className="flex flex-col">
                <div className="text-lg">{report_period_code}</div>
                <span className="text-sm">{report_period}</span>
            </div>

            <div className="flex flex-col gap-2">
                <div className="bg-gray-200 py-1 px-2 text-center rounded-md">
                    {status}
                </div>
                {role && (
                    <div className="py-1 px-2 text-center border border-gray-200 rounded-md">
                        {role}
                    </div>
                )}
            </div>

            <div className="flex gap-3 items-center">
                <div className="flex flex-col flex-grow">
                    <div className="text-lg">{days}</div>
                    <span className="text-sm">{execution_period_code}</span>
                </div>
            </div>
        </li>
    );
};

export default CardReportsListItem;
