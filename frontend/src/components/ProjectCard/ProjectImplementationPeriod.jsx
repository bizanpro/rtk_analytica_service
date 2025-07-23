import ProgressBlock from "../ProgressBlock";
import getColorBySign from "../../utils/getColorBySign";

const ProjectImplementationPeriod = ({ projectData }) => {
    const percentage = projectData?.completion_percentage;
    const date = projectData?.implementation_period_string || "";

    return (
        <div>
            <div className="flex items-end gap-5 min-h-[42px] mb-2">
                <div className="flex items-center gap-2">
                    {projectData?.implementation_period > 0 && (
                        <>
                            <strong className="text-4xl font-normal">
                                {projectData.implementation_period}
                            </strong>
                            <span className="text-1xl leading-6">мес.</span>
                        </>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    {projectData?.implementation_period_difference_percentage !==
                        null && (
                        <div
                            className={`flex gap-1 ${getColorBySign(
                                projectData.implementation_period_difference_percentage,
                                "text-red-400",
                                "text-green-400"
                            )}`}
                        >
                            <div className="max-w-[50px] overflow-hidden text-ellipsis whitespace-nowrap">
                                {
                                    projectData?.implementation_period_difference_percentage
                                }
                            </div>
                            <span>%</span>
                        </div>
                    )}

                    {projectData?.fta_implementation_period > 0 && (
                        <div className="flex gap-1">
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
