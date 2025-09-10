import FunnelMetrics from "./FunnelMetrics";
import FunnelProjectItem from "./FunnelProjectItem";

const Sales = ({ funnelMetrics }) => {
    return (
        <div className="flex flex-col gap-3 border border-gray-300 p-4">
            <h2 className="mb-2 text-2xl font-semibold tracking-tight text-balance">
                Продажи
            </h2>

            <FunnelMetrics funnelMetrics={funnelMetrics.metrics} />

            <ul className="max-h-[365px] overflow-x-hidden overflow-y-auto py-2 flex flex-col gap-3">
                <li className="grid items-center grid-cols-[200px_120px_85px_1fr] gap-2 justify-between pb-2 text-gray-400 border-b border-gray-300">
                    <span>Проект</span>
                    <span>Источник</span>
                    <span>Стоим.</span>
                    <span>Статус</span>
                </li>

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
