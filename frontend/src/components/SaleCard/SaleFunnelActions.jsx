const SaleFunnelActions = ({ requestNextStage, stage }) => {
    return (
        <nav className="grid grid-cols-[12px_12px_12px] justify-around items-center gap-2 pr-8">
            <button
                type="button"
                className="w-[12px] h-[12px] rounded-[50%] opacity-[0.4] bg-red-400 hover:opacity-100 transition-opacity"
                title="Отказ от участия"
                onClick={(e) => {
                    if (confirm("Вы уверены?")) {
                        requestNextStage(stage[2].id);
                    }
                    e.stopPropagation;
                }}
            ></button>
            <button
                type="button"
                className="w-[12px] h-[12px] rounded-[50%] opacity-[0.4] bg-yellow-400 hover:opacity-100 transition-opacity"
                title="Отложить проект"
                onClick={(e) => {
                    requestNextStage(stage[1].id);
                    e.stopPropagation;
                }}
            ></button>
            <button
                type="button"
                className="w-[12px] h-[12px] rounded-[50%] opacity-[0.4] bg-green-400 hover:opacity-100 transition-opacity"
                title="Принять"
                onClick={(e) => {
                    requestNextStage(stage[0].id);
                    e.stopPropagation;
                }}
            ></button>
        </nav>
    );
};

export default SaleFunnelActions;
