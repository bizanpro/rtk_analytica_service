import SaleFunnelItemCurrent from "./SaleFunnelItemCurrent";
import SaleFunnelItemActive from "./SaleFunnelItemActive";

const SaleFunnelStages = ({
    saleStages,
    requestNextStage,
    getStageDetails,
    activeStage,
    setActiveStage,
}) => {
    const stages = saleStages.stages ?? [];
    const lastStage = stages[stages.length - 1];
    const previousStages = stages.slice(0, -1);

    return (
        <>
            {previousStages?.length > 0 &&
                previousStages.map((stage) => (
                    <SaleFunnelItemActive
                        key={stage.id}
                        stage={stage}
                        getStageDetails={getStageDetails}
                        activeStage={activeStage}
                        setActiveStage={setActiveStage}
                    />
                ))}

            {saleStages.next_possible_stages?.length > 0 && (
                <SaleFunnelItemCurrent
                    stage={lastStage}
                    nextPossibleStages={saleStages.next_possible_stages}
                    requestNextStage={requestNextStage}
                    activeStage={activeStage}
                />
            )}
        </>
    );
};

export default SaleFunnelStages;
