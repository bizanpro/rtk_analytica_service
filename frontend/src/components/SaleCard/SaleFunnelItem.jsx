import SaleFunnelActions from "./SaleFunnelActions";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

const SaleFunnelItem = ({ stage, requestNextStage }) => {
    const stageId = stage?.pivot?.stage_id;

    return (
        <li className="grid items-center grid-cols-[1fr_30%_20%] gap-10 mb-2 text-lg">
            <div className="flex items-center gap-2">{stage.name}</div>
            <div className="flex items-center gap-2 ">
                <div className="border-2 border-gray-300 p-1 w-full h-[32px]">
                    {format(parseISO(stage?.created_at), "dd.MM.yyyy", {
                        locale: ru,
                    }) || ""}
                </div>
            </div>
            <SaleFunnelActions
                requestNextStage={requestNextStage}
                stageId={stageId}
            />
        </li>
    );
};

export default SaleFunnelItem;
