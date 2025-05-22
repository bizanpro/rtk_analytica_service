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
    const mappedStages = saleStages.map((stageData, index) => {
        const stageTemplate = STAGES[index];
        return {
            ...stageTemplate,
            ...stageData,
        };
    });

    const lastStage = saleStages[saleStages.length - 1];

    const shouldAddNext =
        lastStage?.type === "main" && saleStages.length < STAGES.length;

    const nextStage = shouldAddNext ? STAGES[saleStages.length] : null;

    const stagesToRender = nextStage
        ? [...mappedStages, nextStage]
        : mappedStages;

    return stagesToRender.map((stage) => (
        <SaleFunnelItem
            key={stage.id}
            stage={stage}
            requestNextStage={requestNextStage}
        />
    ));
};

export default SaleFunnelStages;
