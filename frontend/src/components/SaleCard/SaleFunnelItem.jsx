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
    let statusLabel = "";

    if (stage.type === "postponed") {
        statusLabel = "Проект отложен";
    } else if (stage.type === "rejected") {
        statusLabel = "Получен отказ";
    }

    return (
        <li
            className="grid items-center grid-cols-[1fr_30%_20%] gap-10 mb-2 text-lg cursor-pointer"
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

                <div className="flex flex-col">
                    {stage.name}
                    <span className="text-gray-400 text-sm">
                        {stage.type !== "main" && statusLabel}
                    </span>
                </div>
            </div>

            <div>
                {stage.name?.toLowerCase() !== "подготовка кп" &&
                    stage.name?.toLowerCase() !== "заключение договора" && (
                        <DatePicker
                            className="border-2 border-gray-300 p-1 w-full h-[32px]"
                            startDate={stage.stage_date}
                            selected={stage.stage_date || ""}
                            onChange={(date) =>
                                handleActiveStageDate(date, stage.id)
                            }
                            dateFormat="dd.MM.yyyy"
                            minDate={prevStage}
                            disabled={mode === "read" || !isLast}
                        />
                    )}
            </div>

            {/* stage.hasOwnProperty("next_possible_stages") &&
            stage.next_possible_stages.length > 0 && */}

            {stage.is_final == false ? (
                <nav className="grid grid-cols-[12px_12px_12px] justify-around items-center gap-2 pr-8">
                    <button
                        type="button"
                        className={`w-[12px] h-[12px] rounded-[50%] ${
                            stage.type === "rejected" ? "" : "opacity-[0.3]"
                        } bg-red-400 hover:opacity-100 transition-opacity`}
                        title="Отказ от участия"
                        onClick={(evt) => {
                            evt.stopPropagation();
                            if (confirm("Вы уверены?")) {
                                handleNextStage(
                                    stage.next_possible_stages[2].id,
                                    stage.name,
                                    "rejected"
                                );
                            }
                        }}
                    ></button>
                    <button
                        type="button"
                        className={`w-[12px] h-[12px] rounded-[50%] ${
                            stage.type === "postponed" ? "" : "opacity-[0.3]"
                        } bg-yellow-400 hover:opacity-100 transition-opacity`}
                        title="Отложить проект"
                        onClick={(evt) => {
                            evt.stopPropagation();
                            handleNextStage(
                                stage.next_possible_stages[1].id,
                                stage.name,
                                "postponed"
                            );
                        }}
                    ></button>
                    <button
                        type="button"
                        className={`w-[12px] h-[12px] rounded-[50%] ${
                            stage.type === "main" ? "" : "opacity-[0.3]"
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
            ) : (
                <nav className="grid grid-cols-[12px_12px_12px] justify-around items-center gap-2 pr-8">
                    <div
                        className={`w-[12px] h-[12px] rounded-[50%] bg-red-400 ${
                            stage.type === "rejected" ? "" : "opacity-[0.3]"
                        }`}
                    ></div>
                    <div
                        className={`w-[12px] h-[12px] rounded-[50%] bg-yellow-400 ${
                            stage.type === "postponed" ? "" : "opacity-[0.3]"
                        }`}
                    ></div>
                    <div
                        className={`w-[12px] h-[12px] rounded-[50%] bg-green-400 ${
                            stage.type === "main" ? "" : "opacity-[0.3]"
                        }`}
                    ></div>
                </nav>
            )}
        </li>
    );
};

export default SaleFunnelItem;
