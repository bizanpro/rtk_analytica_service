const SaleFunnelItemCurrent = ({
    stage,
    nextPossibleStages,
    requestNextStage,
    activeStage,
}) => {
    return (
        <li className="grid items-center grid-cols-[1fr_30%_20%] gap-10 mb-2 text-lg ">
            <div className="flex items-center gap-3">
                <div
                    className={`w-[10px] h-[10px] rounded-[50%] transition ${
                        activeStage === stage.id ? "bg-gray-400" : ""
                    }`}
                ></div>
                <div className="flex flex-col">{stage.name}</div>
            </div>

            <div className="border-2 border-gray-300 p-1 w-full h-[32px]"></div>

            <nav className="grid grid-cols-[12px_12px_12px] justify-around items-center gap-2 pr-8">
                <button
                    type="button"
                    className="w-[12px] h-[12px] rounded-[50%] opacity-[0.3] bg-red-400 hover:opacity-100 transition-opacity"
                    title="Отказ от участия"
                    onClick={() => {
                        if (confirm("Вы уверены?")) {
                            requestNextStage(nextPossibleStages[2].id);
                        }
                    }}
                ></button>
                <button
                    type="button"
                    className="w-[12px] h-[12px] rounded-[50%] opacity-[0.3] bg-yellow-400 hover:opacity-100 transition-opacity"
                    title="Отложить проект"
                    onClick={() => {
                        requestNextStage(nextPossibleStages[1].id);
                    }}
                ></button>
                <button
                    type="button"
                    className="w-[12px] h-[12px] rounded-[50%] opacity-[0.3] bg-green-400 hover:opacity-100 transition-opacity"
                    title="Принять"
                    onClick={() => {
                        requestNextStage(nextPossibleStages[0].id);
                    }}
                ></button>
            </nav>
        </li>
    );
};

export default SaleFunnelItemCurrent;
