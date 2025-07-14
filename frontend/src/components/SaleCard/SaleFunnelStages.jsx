import SaleFunnelItem from "./SaleFunnelItem";

const SaleFunnelStages = ({
    saleStages,
    requestNextStage,
    getStageDetails,
    activeStage,
    setActiveStage,
    handleActiveStageDate,
    mode,
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
                handleActiveStageDate={handleActiveStageDate}
                mode={mode}
            />
        ))
    );
};

export default SaleFunnelStages;
