import DatePicker from "react-datepicker";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SaleFunnelItem = ({
    stage,
    getStageDetails,
    activeStage,
    maxPrevDate,
    showStageDots,
    showStageActions,
    isLast,
    setActiveStage,
    handleNextStage,
    handleActiveStageDate,
    requestNextStage,
}) => {
    const handleStage = (next_possible_stages, action) => {
        if (stage.stage_date) {
            if (next_possible_stages?.selected) {
                if (action === "rejected") {
                    if (confirm("Вы уверены?")) {
                        requestNextStage(next_possible_stages.id, action);
                    }
                    return;
                } else {
                    requestNextStage(next_possible_stages.id, action);
                }
            } else {
                if (action === "rejected") {
                    if (confirm("Вы уверены?")) {
                        handleNextStage(
                            next_possible_stages.id,
                            stage.name,
                            action
                        );
                    }
                    return;
                } else {
                    handleNextStage(
                        next_possible_stages.id,
                        stage.name,
                        action
                    );
                }
            }
        } else {
            toast.error("Выберите дату", {
                containerId: "container",
                isLoading: false,
                autoClose: 2000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                position: "top-center",
            });
        }
    };

    const noActionStages =
        stage.name.toLowerCase() !== "отказ от участия" &&
        stage.name.toLowerCase() !== "получен отказ" &&
        stage.name.toLowerCase() !== "проект отложен" &&
        stage.name.toLowerCase() !== "договор заключён";

    return (
        <>
            <ToastContainer containerId="container" />

            <li
                className="grid items-center grid-cols-[1fr_31%_18%] gap-5 mb-2 text-lg cursor-pointer"
                onClick={() => {
                    if (activeStage != stage.instance_id) {
                        setActiveStage(stage.instance_id);
                        getStageDetails(stage.instance_id);
                    }
                }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className={`w-[10px] h-[10px] flex-[0_0_10px] rounded-[50%] transition ${
                            activeStage === stage.instance_id
                                ? "bg-gray-400"
                                : ""
                        }`}
                    ></div>

                    <div className="flex flex-col">{stage.name}</div>
                </div>

                <div className="flex items-center gap-2">
                    <DatePicker
                        className="border-2 border-gray-300 p-1 w-full h-[32px]"
                        startDate={stage.stage_date}
                        selected={stage.stage_date || ""}
                        onChange={(date) =>
                            handleActiveStageDate(
                                date,
                                stage.id,
                                stage.instance_id
                            )
                        }
                        dateFormat="dd.MM.yyyy"
                        minDate={maxPrevDate}
                        disabled={!isLast}
                    />

                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px] flex-[0_0_20px]">
                        ?
                    </span>
                </div>

                {stage.hasOwnProperty("next_possible_stages") &&
                    stage.next_possible_stages.length > 0 &&
                    showStageActions &&
                    noActionStages && (
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

                                    handleStage(
                                        stage.next_possible_stages[1],
                                        "rejected"
                                    );
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

                                    handleStage(
                                        stage.next_possible_stages[2],
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

                                    handleStage(
                                        stage.next_possible_stages[0],
                                        "success"
                                    );
                                }}
                            ></button>
                        </nav>
                    )}

                {/* Отображаем индикатор примененного действия у этапа, если действия
            ему больше не доступны */}
                {stage.hasOwnProperty("next_possible_stages") &&
                    showStageDots &&
                    noActionStages && (
                        <div className="grid grid-cols-[12px_12px_12px] justify-around items-center gap-2 pr-8">
                            <div
                                className={`w-[12px] h-[12px] rounded-[50%] ${
                                    !stage.next_possible_stages[1]?.selected
                                        ? "opacity-[0.3]"
                                        : ""
                                } bg-red-400`}
                            ></div>
                            <div
                                className={`w-[12px] h-[12px] rounded-[50%] ${
                                    !stage.next_possible_stages[2]?.selected
                                        ? "opacity-[0.3]"
                                        : ""
                                } bg-yellow-400`}
                            ></div>
                            <div
                                className={`w-[12px] h-[12px] rounded-[50%] ${
                                    !stage.next_possible_stages[0]?.selected
                                        ? "opacity-[0.3]"
                                        : ""
                                } bg-green-400`}
                            ></div>
                        </div>
                    )}
            </li>
        </>
    );
};

export default SaleFunnelItem;
