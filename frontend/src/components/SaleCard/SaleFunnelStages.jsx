import SaleFunnelItem from "./SaleFunnelItem";

const SaleFunnelStages = ({
    saleStages,
    handleNextStage,
    getStageDetails,
    activeStage,
    setActiveStage,
    handleActiveStageDate,
    mode,
}) => {
    return (
        saleStages.stages?.length > 0 &&
        saleStages.stages
            ?.sort((a, b) => a.order - b.order)
            .map((stage, index, arr) => {
                const prevStages = arr.slice(0, index);

                // Максимальная дата среди предшественников
                const maxPrevDate = prevStages.length
                    ? new Date(
                          Math.max(
                              ...prevStages.map((s) =>
                                  s.stage_date
                                      ? new Date(s.stage_date).getTime()
                                      : 0
                              )
                          )
                      )
                    : null;

                const isLast = index === arr.length - 1;

                return (
                    <SaleFunnelItem
                        key={stage.id}
                        stage={stage}
                        getStageDetails={getStageDetails}
                        activeStage={activeStage}
                        prevStage={maxPrevDate}
                        isLast={isLast}
                        setActiveStage={setActiveStage}
                        handleNextStage={handleNextStage}
                        handleActiveStageDate={handleActiveStageDate}
                        mode={mode}
                    />
                );
            })
    );
};

export default SaleFunnelStages;
