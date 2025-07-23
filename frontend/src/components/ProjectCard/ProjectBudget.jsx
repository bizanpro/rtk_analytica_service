import getColorBySign from "../../utils/getColorBySign";

const ProjectBudget = ({ projectData }) => {
    return (
        <div className="flex items-end gap-5 min-h-[42px]">
            <div className="flex items-end gap-2">
                {projectData?.project_budget !== null && (
                    <>
                        <strong className="text-4xl font-normal max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                            {projectData.project_budget}
                        </strong>
                        <span className="text-1xl leading-6">
                            млрд <br /> руб.
                        </span>
                    </>
                )}
            </div>
            <div className="flex flex-col gap-2">
                {projectData.budget_difference_percentage !== null && (
                    <div
                        className={`flex gap-1 ${getColorBySign(
                            projectData.budget_difference_percentage,
                            "text-red-400",
                            "text-green-400"
                        )} max-w-[50px] overflow-hidden text-ellipsis whitespace-nowrap`}
                    >
                        {projectData.budget_difference_percentage}
                        <span>%</span>
                    </div>
                )}

                {projectData?.fta_budget !== null && (
                    <div className="flex gap-1">
                        <div className="max-w-[50px] overflow-hidden text-ellipsis whitespace-nowrap">
                            {projectData.fta_budget}
                        </div>

                        <span>млрд</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectBudget;
