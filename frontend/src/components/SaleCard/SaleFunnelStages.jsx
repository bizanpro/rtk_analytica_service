import SaleFunnelItemCurrent from "./SaleFunnelItemCurrent";
import SaleFunnelItemActive from "./SaleFunnelItemActive";

const SaleFunnelStages = ({ saleStages, requestNextStage }) => {
    const { stages = [], next_possible_stages = [] } = saleStages;

    return (
        <>
            {stages.map((stage) => {
                return <SaleFunnelItemActive key={stage.id} stage={stage} />;
            })}

            {next_possible_stages.length > 0 && (
                <SaleFunnelItemCurrent
                    stage={next_possible_stages}
                    requestNextStage={requestNextStage}
                />
            )}
        </>
    );
};

export default SaleFunnelStages;
