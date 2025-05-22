import SaleFunnelActions from "./SaleFunnelActions";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

const SaleFunnelItem = ({ stage, requestNextStage }) => {
    const stageId = stage?.pivot?.stage_id;

    let status;

    if (stage.type === "postponed") {
        status = "Проект отложен";
    } else if (stage.type === "rejected") {
        status = "Получен отказ";
    }

    return (
        <li className="grid items-center grid-cols-[1fr_30%_20%] gap-10 mb-2 text-lg">
            <div className="flex flex-col">
                {stage.label}
                <span className="text-gray-400 text-sm">
                    {stage.type != "main" && status}
                </span>
            </div>
            <div>
                <div className="border-2 border-gray-300 p-1 w-full h-[32px]">
                    {stage?.created_at
                        ? format(parseISO(stage.created_at), "dd.MM.yyyy", {
                              locale: ru,
                          })
                        : ""}
                </div>
            </div>
            <SaleFunnelActions
                requestNextStage={requestNextStage}
                stageId={stageId}
                status={stage.type}
            />
        </li>
    );
};

export default SaleFunnelItem;
