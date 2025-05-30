import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

const FunnelProjectItem = ({
    name,
    industry,
    creditors,
    last_fta_value,
    current_stage,
    stage_date,
}) => {
    return (
        <li className="grid grid-cols-[1fr_120px_80px_1fr] items-start">
            <div className="flex flex-col">
                <div className="text-lg">{name}</div>
                <span className="text-gray-400">{industry.name}</span>
            </div>

            <div className="text-lg">{creditors.name}</div>

            <div className="flex flex-col">
                <strong className="text-lg font-normal max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {last_fta_value.value}
                </strong>
                <span className="text-sm">{last_fta_value.label}</span>
            </div>

            <div className="flex flex-col">
                <div className="text-lg">{current_stage.name}</div>
                <span className="text-gray-400">
                    {format(parseISO(stage_date), "d.MM.yyyy,", {
                        locale: ru,
                    })}
                </span>
            </div>
        </li>
    );
};

export default FunnelProjectItem;
