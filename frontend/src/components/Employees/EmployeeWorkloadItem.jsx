const EmployeeWorkloadItem = ({
    project,
    report,
    completion_percentage,
    role,
}) => {
    return (
        <li className="grid items-stretch grid-cols-4 gap-4">
            <div className="flex flex-col justify-between gap-2 min-w-[140px]">
                <div className="text-lg">{project?.name}</div>

                <span className="text-gray-400">{project?.main_industry}</span>
            </div>

            <div className="flex flex-col justify-start gap-2">
                <div className="text-lg">{report?.report_period_code}</div>
                <span className="text-xs">{report?.report_period}</span>
            </div>
            <div className="flex flex-col justify-start items-center gap-2">
                <div className="relative h-[20px] w-full border border-gray-200 overflow-hidden text-center flex items-center justify-center">
                    <div className="min-w-min whitespace-nowrap">
                        {completion_percentage}%
                    </div>

                    <div
                        className="absolute top-0 left-0 bottom-0 h-full bg-gray-200 transition-all opacity-60 z-[-1]"
                        style={{
                            width: `${completion_percentage}%`,
                        }}
                    ></div>
                </div>
                <span className="text-xs">{report?.execution_period}</span>
            </div>
            <div className="leading-6">{role}</div>
        </li>
    );
};

export default EmployeeWorkloadItem;
