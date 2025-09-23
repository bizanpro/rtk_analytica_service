import FunnelMetrics from "./FunnelMetrics";
import FunnelProjectItem from "./FunnelProjectItem";

const Sales = ({ funnelMetrics }) => {
    return (
        <div className="flex flex-col gap-3 border border-gray-300 p-4">
            <h2 className="mb-2 text-2xl font-semibold tracking-tight text-balance">
                Продажи
            </h2>

            <FunnelMetrics funnelMetrics={funnelMetrics.metrics} />

            <div className="py-2">
                <div className="grid items-center grid-cols-[200px_120px_85px_1fr] gap-2 justify-between pb-2 text-gray-400 border-b border-gray-300">
                    <span>Проект</span>
                    <span>Источник</span>
                    <span>Стоим.</span>
                    <span>Статус</span>
                </div>

                <ul className="min-h-[245px] max-h-[245px] overflow-x-hidden overflow-y-auto flex flex-col gap-3 py-3">
                    {funnelMetrics.sales_funnel_projects_with_stage_changes
                        ?.length > 0 &&
                        funnelMetrics.sales_funnel_projects_with_stage_changes.map(
                            (project) => (
                                <FunnelProjectItem
                                    key={project.id}
                                    {...project}
                                />
                            )
                        )}
                </ul>
            </div>
        </div>
    );
};

export default Sales;
