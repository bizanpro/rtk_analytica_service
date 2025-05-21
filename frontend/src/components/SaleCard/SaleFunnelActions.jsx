const SaleFunnelActions = ({ requestNextStage, stageId }) => {
    return (
        <nav className="grid grid-cols-[12px_12px_12px] justify-around items-center gap-2 pr-8">
            <button
                type="button"
                className="w-[12px] h-[12px] rounded-[50%] bg-red-400 opacity-[0.4] hover:opacity-100 transition-opacity"
                title="Отказ от участия"
            ></button>
            <button
                type="button"
                className="w-[12px] h-[12px] rounded-[50%] bg-yellow-400 opacity-[0.4] hover:opacity-100 transition-opacity"
                title="Отложить проект"
            ></button>
            <button
                type="button"
                className="w-[12px] h-[12px] rounded-[50%] bg-green-400 opacity-[0.4] hover:opacity-100 transition-opacity"
                title="Принять"
                onClick={() => {
                    requestNextStage(stageId);
                }}
            ></button>
        </nav>
    );
};

export default SaleFunnelActions;
