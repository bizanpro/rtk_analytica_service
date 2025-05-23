import SaleFunnelItemCurrent from "./SaleFunnelItemCurrent";
import SaleFunnelItemActive from "./SaleFunnelItemActive";

const STAGES = [
    { id: 1, label: "Получен запрос" },
    { id: 2, label: "Подготовка КП" },
    { id: 3, label: "Отправлено КП" },
    { id: 4, label: "Получено согласие" },
    { id: 5, label: "Заключение договора" },
    { id: 6, label: "Договор заключён" },
];

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
