const SaleFunnelActions = ({ requestNextStage, stageId, status }) => {
    return (
        <nav className="grid grid-cols-[12px_12px_12px] justify-around items-center gap-2 pr-8">
            <button
                type="button"
                className={`w-[12px] h-[12px] rounded-[50%] bg-red-400 hover:opacity-100 transition-opacity ${
                    status == "rejected" ? "opacity-100" : "opacity-[0.4]"
                }`}
                title="Отказ от участия"
            ></button>
            <button
                type="button"
                className={`w-[12px] h-[12px] rounded-[50%] bg-yellow-400 hover:opacity-100 transition-opacity ${
                    status == "postponed" ? "opacity-100" : "opacity-[0.4]"
                }`}
                title="Отложить проект"
            ></button>
            <button
                type="button"
                className={`w-[12px] h-[12px] rounded-[50%] bg-green-400 hover:opacity-100 transition-opacity ${
                    status == "main" ? "opacity-100" : "opacity-[0.4]"
                }`}
                title="Принять"
                onClick={
                    status != "main"
                        ? () => {
                              requestNextStage(stageId);
                          }
                        : undefined
                }
            ></button>
        </nav>
    );
};

export default SaleFunnelActions;
