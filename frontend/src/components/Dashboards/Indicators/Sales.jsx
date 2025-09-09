import FunnelMetrics from "./FunnelMetrics";
import FunnelProjectItem from "./FunnelProjectItem";

const Sales = ({ funnelMetrics }) => {
    return (
        <div className="flex flex-col gap-3 border border-gray-300 p-4">
            <h2 className="mb-4 text-3xl font-semibold tracking-tight text-balance">
                Продажи
            </h2>

            <FunnelMetrics funnelMetrics={funnelMetrics.metrics} />

            <ul className="max-h-[300px] overflow-x-hidden overflow-y-auto p-4 flex flex-col gap-3">
                {funnelMetrics.sales_funnel_projects_with_stage_changes
                    ?.length > 0 &&
                    funnelMetrics.sales_funnel_projects_with_stage_changes.map(
                        (project) => (
                            <FunnelProjectItem key={project.id} {...project} />
                        )
                    )}
            </ul>
        </div>
    );
};

export default Sales;
