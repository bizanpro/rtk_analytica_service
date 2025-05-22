import SaleFunnelItem from "./SaleFunnelItem";

const STAGES = [
    { id: 1, label: "Получен запрос" },
    { id: 2, label: "Подготовка КП" },
    { id: 3, label: "Отправлено КП" },
    { id: 4, label: "Получено согласие" },
    { id: 5, label: "Заключение договора" },
    { id: 6, label: "Договор заключён" },
];

const SaleFunnelStages = ({ saleStages, requestNextStage }) => {
    const firstStage = STAGES[0];

    const remainingStages = saleStages.map((stageData, index) => {
        const stageTemplate = STAGES[index + 1];
        return {
            ...stageTemplate,
            ...stageData,
        };
    });

    // Общий список для отображения
    const stagesToRender = [firstStage, ...remainingStages];

    return stagesToRender.map((stage, index) => (
        <SaleFunnelItem
            key={stage.id}
            stage={stage}
            isActive={false}
            showActions={false}
            requestNextStage={requestNextStage}
        />
    ));
};

export default SaleFunnelStages;
