import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

const SaleFunnelItemActive = ({
    stage,
    getStageDetails,
    activeStage,
    setActiveStage,
}) => {
    let statusLabel = "";

    if (stage.type === "postponed") {
        statusLabel = "Проект отложен";
    } else if (stage.type === "rejected") {
        statusLabel = "Получен отказ";
    }

    return (
        <li
            className="grid items-center grid-cols-[1fr_30%_20%] gap-10 mb-2 text-lg cursor-pointer"
            onClick={() => {
                if (activeStage != stage.id) {
                    setActiveStage(stage.id);
                    getStageDetails(stage.id);
                }
            }}
        >
            <div className="flex items-center gap-3">
                <div
                    className={`w-[10px] h-[10px] rounded-[50%] transition ${
                        activeStage === stage.id ? "bg-gray-400" : ""
                    }`}
                ></div>

                <div className="flex flex-col">
                    {stage.name}
                    <span className="text-gray-400 text-sm">
                        {stage.type !== "main" && statusLabel}
                    </span>
                </div>
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

            <nav className="grid grid-cols-[12px_12px_12px] justify-around items-center gap-2 pr-8">
                <div
                    className={`w-[12px] h-[12px] rounded-[50%] bg-red-400  ${
                        stage.type === "rejected" ? "" : "opacity-[0.4]"
                    }`}
                ></div>
                <div
                    className={`w-[12px] h-[12px] rounded-[50%] bg-yellow-400 opacity-[0.4] ${
                        stage.type === "postponed" ? "" : "opacity-[0.4]"
                    }`}
                ></div>
                <div
                    className={`w-[12px] h-[12px] rounded-[50%] bg-green-400 ${
                        stage.type === "main" ? "" : "opacity-[0.4]"
                    }`}
                ></div>
            </nav>
        </li>
    );
};

export default SaleFunnelItemActive;
