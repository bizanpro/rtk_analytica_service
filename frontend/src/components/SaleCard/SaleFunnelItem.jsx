import SaleFunnelActions from "./SaleFunnelActions";

import DatePicker from "react-datepicker";

const SaleFunnelItem = ({ mode, stage, requestNextStage }) => {
    const stageId = stage?.pivot?.stage_id;

    return (
        <li className="grid items-center grid-cols-[1fr_30%_20%] gap-10 mb-2 text-lg">
            <div className="flex items-center gap-2">{stage.name}</div>
            <div className="flex items-center gap-2">
                <DatePicker
                    className="border-2 border-gray-300 p-1 w-full h-[32px]"
                    selected={stage?.created_at || new Date()}
                    placeholderText="дд.мм.гггг"
                    startDate={new Date()}
                    dateFormat="dd.MM.yyyy"
                    disabled={mode === "read" ? true : false}
                />
            </div>
            <SaleFunnelActions
                requestNextStage={requestNextStage}
                stageId={stageId}
            />
        </li>
    );
};

export default SaleFunnelItem;
