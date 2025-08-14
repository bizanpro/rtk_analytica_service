const CustomerProjectItem = ({
    id,
    name,
    project_budget,
    implementation_period,
    implementation_period_string,
    industry,
    status,
    getProjectReports,
    getProjectContact,
    setActiveProject,
    activeProject,
}) => {
    return (
        <li
            className={`p-2 grid items-center grid-cols-[30%_27%_1fr] gap-3 cursor-pointer border-2 transition-all ${
                activeProject === id ? "border-gray-300" : "border-transparent"
            }`}
            onClick={() => {
                getProjectReports(id);
                setActiveProject(id);
                if (typeof getProjectContact === "function") {
                    getProjectContact(id);
                }
            }}
        >
            <div className="flex flex-col">
                <div className="text-lg">{name}</div>
                <span className="text-gray-400">{industry}</span>
            </div>
            <div className="flex items-end gap-2">
                {project_budget && (
                    <>
                        <strong className="text-2xl font-normal whitespace-nowrap">
                            {project_budget}
                        </strong>
                        <span className="text-base leading-5">
                            млрд <br /> руб.
                        </span>
                    </>
                )}
            </div>
            <div className="grid grid-cols-[1fr_20px] items-start gap-2">
                <div className="flex flex-col justify-between items-center gap-2">
                    {implementation_period && (
                        <>
                            <div className="relative h-[20px] w-full border border-gray-200 overflow-hidden text-center flex items-center justify-center">
                                <div className="min-w-min whitespace-nowrap">
                                    {implementation_period}%
                                </div>

                                <div
                                    className="absolute top-0 left-0 bottom-0 h-full bg-gray-200 transition-all opacity-60 z-[-1]"
                                    style={{
                                        width: `${implementation_period}%`,
                                    }}
                                ></div>
                            </div>
                            <span className="text-xs">
                                {implementation_period_string}
                            </span>
                        </>
                    )}
                </div>

                <div
                    className={`mt-0.5 w-[15px] h-[15px] rounded-[50%] ${
                        status === "active"
                            ? "bg-green-500"
                            : status === "completed"
                            ? "bg-black"
                            : "bg-gray-300"
                    }`}
                ></div>
            </div>
        </li>
    );
};

export default CustomerProjectItem;
