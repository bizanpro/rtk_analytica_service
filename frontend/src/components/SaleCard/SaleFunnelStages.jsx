import SaleFunnelItemCurrent from "./SaleFunnelItemCurrent";
import SaleFunnelItemActive from "./SaleFunnelItemActive";

const SaleFunnelStages = ({
    saleStages,
    requestNextStage,
    getStageDetails,
    activeStage,
    setActiveStage,
}) => {
    return (
        <>
            {saleStages.stages?.length > 0 &&
                saleStages.stages?.map((stage) => {
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

            {saleStages.next_possible_stages?.length > 0 && (
                <SaleFunnelItemCurrent
                    stage={saleStages.next_possible_stages}
                    requestNextStage={requestNextStage}
                    activeStage={activeStage}
                />
            )}
        </>
    );
};

export default SaleFunnelStages;
