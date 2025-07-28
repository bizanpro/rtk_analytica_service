import getColorBySign from "../../utils/getColorBySign";

const ProgressBlock = ({ percentage, date }) => {
    const progress = percentage > 100 ? 0 : percentage;

    return (
        <div className="project-budget__block-progress">
            <div
                className="project-budget__block-progress__line"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};

const ProjectImplementationPeriod = ({ projectData }) => {
    const percentage = projectData?.completion_percentage;
    const date = projectData?.implementation_period_string || "";

    return (
        <div
            className={`project-budget__block ${
                projectData?.implementation_period > 0 && "active"
            }`}
        >
            <div className="project-budget__block-main">
                <div className="flex items-end gap-[8px]">
                    {projectData?.implementation_period > 0 && (
                        <>
                            <strong className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                                {projectData.implementation_period}
                            </strong>
                            <span>мес.</span>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-[10px]">
                    {projectData?.fta_implementation_period !== null && (
                        <span>
                            {projectData.fta_implementation_period} мес.
                        </span>
                    )}

                    {projectData.implementation_period_difference_percentage >
                        0 && (
                        <div
                            className={`project-budget__block-percentage ${getColorBySign(
                                projectData.implementation_period_difference_percentage,
                                "plus",
                                "minus"
                            )}`}
                        >
                            {
                                projectData.implementation_period_difference_percentage
                            }
                            %
                        </div>
                    )}
                </div>
            </div>

            <div className="project-budget__block-title">
                <span
                    className={`${
                        projectData?.implementation_period > 0 && "active"
                    }`}
                >
                    срок реализации
                </span>
                {projectData?.implementation_period == 0 && <b>Нет данных</b>}

                {projectData?.completion_percentage !== 0 && (
                    <span className="flex items-center gap-[10px]">
                        <span>{projectData?.completion_percentage}%</span>

                        {projectData?.implementation_period_string}
                    </span>
                )}
            </div>

            {percentage && (
                <ProgressBlock percentage={percentage} date={date} />
            )}
        </div>
    );
};

export default ProjectImplementationPeriod;
