import ProgressBlock from "../ProgressBlock";

const ProjectImplementationPeriod = ({ projectData }) => {
    const percentage = projectData?.completion_percentage;
    const date = projectData?.completion_data || "";

    return (
        <div>
            <div className="flex items-end gap-5 min-h-[42px] mb-2">
                <div className="flex items-center gap-2">
                    {projectData?.implementation_period > 0 && (
                        <>
                            <strong className="text-4xl font-normal">
                                {projectData.implementation_period}
                                60
                            </strong>
                            <span className="text-1xl leading-6">мес.</span>
                        </>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    {projectData?.implementation_period_difference_percentage >
                        0 && (
                        <div className="flex gap-1 text-red-400">
                            +
                            {
                                projectData.implementation_period_difference_percentage
                            }
                            15
                            <span>%</span>
                        </div>
                    )}
                    {projectData?.fta_implementation_period > 0 && (
                        <div className="flex gap-1">
                            45
                            {+projectData.fta_implementation_period}
                            <span>мес.</span>
                        </div>
                    )}
                </div>
            </div>
            {percentage && (
                <ProgressBlock percentage={percentage} date={date} />
            )}
        </div>
    );
};

export default ProjectImplementationPeriod;
