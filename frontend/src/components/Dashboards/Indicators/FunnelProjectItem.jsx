import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

const FunnelProjectItem = ({
    name,
    industry,
    banks,
    last_fta_value,
    current_stage,
}) => {
    return (
        <li className="grid grid-cols-[200px_120px_85px_1fr] gap-2 items-start">
            <div className="flex flex-col">
                <div className="text-lg">{name}</div>
                <span className="text-gray-400">{industry?.name}</span>
            </div>

            <div className="text-lg">
                {banks.length > 0 ? banks.map((bank) => bank.name + ", ") : "-"}
            </div>

            <div className="flex flex-col">
                <strong className="text-lg font-normal max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {last_fta_value?.value}
                </strong>
                <span className="text-sm">{last_fta_value?.label}</span>
            </div>

            <div className="flex flex-col">
                <div
                    className={`text-lg ${
                        current_stage?.name?.toLowerCase() ===
                        "получено согласие"
                            ? "text-green-400"
                            : current_stage?.name?.toLowerCase() ===
                              "получен отказ"
                            ? "text-red-400"
                            : ""
                    }`}
                >
                    {current_stage?.name}
                </div>
                <span className="text-gray-400">
                    {current_stage?.changed_at &&
                        format(
                            parseISO(current_stage?.changed_at),
                            "d.MM.yyyy",
                            {
                                locale: ru,
                            }
                        )}
                </span>
            </div>
        </li>
    );
};

export default FunnelProjectItem;
