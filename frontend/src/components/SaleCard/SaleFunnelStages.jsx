import SaleFunnelItem from "./SaleFunnelItem";

const SaleFunnelStages = ({
    saleStages,
    requestNextStage,
    getStageDetails,
    activeStage,
    setActiveStage,
}) => {
    return (
        saleStages.stages?.length > 0 &&
        saleStages.stages.map((stage) => (
            <SaleFunnelItem
                key={stage.id}
                stage={stage}
                getStageDetails={getStageDetails}
                activeStage={activeStage}
                setActiveStage={setActiveStage}
                requestNextStage={requestNextStage}
            />
        ))
    );
};

export default SaleFunnelStages;
