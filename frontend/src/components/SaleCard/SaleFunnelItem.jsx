import DatePicker from "react-datepicker";

const SaleFunnelItem = ({
    stage,
    getStageDetails,
    activeStage,
    prevStage,
    isLast,
    setActiveStage,
    handleNextStage,
    handleActiveStageDate,
    mode,
}) => {
    return (
        <li
            className="grid items-center grid-cols-[1fr_31%_18%] gap-5 mb-2 text-lg cursor-pointer"
            onClick={() => {
                if (activeStage != stage.id) {
                    setActiveStage(stage.id);
                    getStageDetails(stage.id);
                }
            }}
        >
            <div className="flex items-center gap-3">
                <div
                    className={`w-[10px] h-[10px] flex-[0_0_10px] rounded-[50%] transition ${
                        activeStage === stage.id ? "bg-gray-400" : ""
                    }`}
                ></div>

                <div className="flex flex-col">{stage.name}</div>
            </div>

            <div className="flex items-center gap-2">
                <DatePicker
                    className="border-2 border-gray-300 p-1 w-full h-[32px]"
                    startDate={stage.stage_date}
                    selected={stage.stage_date || ""}
                    onChange={(date) => handleActiveStageDate(date, stage.id)}
                    dateFormat="dd.MM.yyyy"
                    minDate={prevStage}
                    disabled={mode == "read" || !isLast}
                />

                <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px] flex-[0_0_20px]">
                    ?
                </span>
            </div>

            {stage.hasOwnProperty("next_possible_stages") &&
                stage.next_possible_stages.length > 0 &&
                stage.name.toLowerCase() !== "отказ от участия" &&
                stage.name.toLowerCase() !== "получен отказ" &&
                stage.name.toLowerCase() !== "заключение договора" && (
                    <nav className="grid grid-cols-[12px_12px_12px] justify-around items-center gap-2 pr-8">
                        <button
                            type="button"
                            className={`w-[12px] h-[12px] rounded-[50%] ${
                                !stage.next_possible_stages[1]?.selected &&
                                "opacity-[0.3]"
                            } bg-red-400 hover:opacity-100 transition-opacity`}
                            title="Отказ от участия"
                            onClick={(evt) => {
                                evt.stopPropagation();
                                if (confirm("Вы уверены?")) {
                                    handleNextStage(
                                        stage.next_possible_stages[1].id,
                                        stage.name,
                                        "rejected"
                                    );
                                }
                            }}
                        ></button>

                        <button
                            type="button"
                            className={`w-[12px] h-[12px] rounded-[50%] ${
                                !stage.next_possible_stages[2]?.selected &&
                                "opacity-[0.3]"
                            } bg-yellow-400 hover:opacity-100 transition-opacity`}
                            title="Отложить проект"
                            onClick={(evt) => {
                                evt.stopPropagation();
                                handleNextStage(
                                    stage.next_possible_stages[2].id,
                                    stage.name,
                                    "postponed"
                                );
                            }}
                        ></button>

                        <button
                            type="button"
                            className={`w-[12px] h-[12px] rounded-[50%] ${
                                !stage.next_possible_stages[0]?.selected &&
                                "opacity-[0.3]"
                            } bg-green-400 hover:opacity-100 transition-opacity`}
                            title="Принять"
                            onClick={(evt) => {
                                evt.stopPropagation();
                                handleNextStage(
                                    stage.next_possible_stages[0].id,
                                    stage.name,
                                    "success"
                                );
                            }}
                        ></button>
                    </nav>
                )}


            {/* Отображаем индикатор примененного действия у этапа, если действия
            ему больше не доступны */}
            {stage.hasOwnProperty("next_possible_stages") &&
                stage.next_possible_stages.length == 0 &&
                stage.name.toLowerCase() !== "отказ от участия" &&
                stage.name.toLowerCase() !== "получен отказ" &&
                stage.name.toLowerCase() !== "заключение договора" && (
                    <div className="grid grid-cols-[12px_12px_12px] justify-around items-center gap-2 pr-8">
                        <div
                            className={`w-[12px] h-[12px] rounded-[50%] ${
                                stage.type === "rejected"
                                    ? "opacity-100"
                                    : "opacity-[0.3]"
                            } bg-red-400`}
                        ></div>
                        <div
                            className={`w-[12px] h-[12px] rounded-[50%] ${
                                stage.type === "postponed"
                                    ? "opacity-100"
                                    : "opacity-[0.3]"
                            } bg-yellow-400`}
                        ></div>
                        <div
                            className={`w-[12px] h-[12px] rounded-[50%] ${
                                stage.type === "main"
                                    ? "opacity-100"
                                    : "opacity-[0.3]"
                            } bg-green-400`}
                        ></div>
                    </div>
                )}
        </li>
    );
};

export default SaleFunnelItem;
