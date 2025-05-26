import SaleFunnelItemCurrent from "./SaleFunnelItemCurrent";
import SaleFunnelItemActive from "./SaleFunnelItemActive";

const SaleFunnelStages = ({
    saleStages,
    requestNextStage,
    getStageDetails,
    activeStage,
    setActiveStage,
}) => {
    const { stages = [], next_possible_stages = [] } = saleStages;

    return (
        <>
            {stages.map((stage) => {
                return (
                    <SaleFunnelItemActive
                        key={stage.id}
                        stage={stage}
                        getStageDetails={getStageDetails}
                        activeStage={activeStage}
                        setActiveStage={setActiveStage}
                    />
                );
            })}

            {next_possible_stages.length > 0 && (
                <SaleFunnelItemCurrent
                    stage={next_possible_stages}
                    requestNextStage={requestNextStage}
                    getStageDetails={getStageDetails}
                    activeStage={activeStage}
                    setActiveStage={setActiveStage}
                />
            )}
        </>
    );
};

export default SaleFunnelStages;
