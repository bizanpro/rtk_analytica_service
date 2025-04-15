const EmployeeWorkloadSummary = ({
    hours,
    industry_name,
    load_percentage,
    project_name,
}) => {
    return (
        <li className="flex items-center gap-3">
            <div className="flex items-center justify-center text-lg border border-gray-300 h-[50px] w-[50px]">
                {load_percentage}%
            </div>

            <div className="flex-grow">
                <div className="flex items-center gap-4">
                    <div className="text-lg">{project_name}</div>

                    <span className="text-gray-400">{industry_name}</span>
                </div>
                <div
                    className="relative h-[20px] w-full overflow-hidden text-center flex items-center justify-start
    px-1"
                >
                    <div className="min-w-min whitespace-nowrap">{hours}</div>

                    <div
                        className="absolute top-0 left-0 bottom-0 h-full bg-gray-200 transition-all opacity-60 z-[-1]"
                        style={{
                            width: `${industry_name}%`,
                        }}
                    ></div>
                </div>
            </div>
        </li>
    );
};

export default EmployeeWorkloadSummary;
