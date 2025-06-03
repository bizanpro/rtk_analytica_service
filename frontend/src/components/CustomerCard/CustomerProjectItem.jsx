import handleStatus from "../../utils/handleStatus";

const CustomerProjectItem = ({
    id,
    name,
    project_budget,
    implementation_period,
    implementation_period_string,
    industry,
    status,
    getReports,
    setProjectData,
    projectData,
}) => {
    return (
        <li
            className={`p-2 grid items-center grid-cols-[1fr_25%_1fr] gap-3 cursor-pointer border-2 transition-all ${
                projectData.id === id ? "border-gray-300" : "border-transparent"
            }`}
            onClick={() => {
                getReports(id);
                setProjectData({ id, name, industry });
            }}
        >
            <div className="flex flex-col">
                <div className="text-lg">{name}</div>
                <span className="text-gray-400">{industry}</span>
            </div>
            <div className="flex items-end gap-2">
                {project_budget && (
                    <>
                        <strong className="text-4xl font-normal max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">
                            {project_budget}
                        </strong>
                        <span className="text-1xl leading-6">
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
