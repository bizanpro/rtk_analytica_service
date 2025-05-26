import SaleFunnelActions from "./SaleFunnelActions";

const SaleFunnelItemCurrent = ({
    stage,
    requestNextStage,
    activeStage,
    setActiveStage,
    getStageDetails,
}) => {
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
                <div className="flex flex-col">{stage[0].name}</div>
            </div>

            <div className="border-2 border-gray-300 p-1 w-full h-[32px]"></div>

            <SaleFunnelActions
                stage={stage}
                requestNextStage={requestNextStage}
            />
        </li>
    );
};

export default SaleFunnelItemCurrent;
