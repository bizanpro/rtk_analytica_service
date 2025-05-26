import React from "react";

const SaleStageDetails = ({ stageMetrics, setStageMetrics }) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <div className="flex flex-col gap-2 flex-grow">
                    <span className="flex items-center gap-2 text-gray-400">
                        Стоимость предложения, руб.
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </span>

                    <div className="grid grid-cols-[50px_1fr] items-center gap-4">
                        <span> ФТА:</span>

                        <div className="border-2 border-gray-300 py-1 px-2">
                            <input
                                type="text"
                                className="w-full"
                                defaultValue={stageMetrics.fta_value || ""}
                                onChange={(evt) => {
                                    setStageMetrics((prev) => ({
                                        ...prev,
                                        fta_value: evt.target.value,
                                    }));
                                }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-[50px_1fr] items-center gap-4">
                        <span>ТК:</span>

                        <div className="border-2 border-gray-300 py-1 px-2">
                            <input
                                type="text"
                                className="w-full"
                                defaultValue={stageMetrics.tk_value || ""}
                                onChange={(evt) => {
                                    setStageMetrics((prev) => ({
                                        ...prev,
                                        tk_value: evt.target.value,
                                    }));
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div
                    className="flex flex-col gap-2"
                    style={{ flex: "0 0 60px" }}
                >
                    <span className="flex items-center gap-2 text-gray-400">
                        Изменение
                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                            ?
                        </span>
                    </span>

                    <div className="border-2 border-gray-300 py-1 px-2 h-[30px] text-red-500">
                        {stageMetrics.fta_change_percent || ""}
                    </div>

                    <div className="border-2 border-gray-300 py-1 px-2 h-[30px] text-red-500">
                        {stageMetrics.tk_change_percent || ""}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <span className="text-gray-400">Комментарий:</span>
                <textarea
                    className="border-2 border-gray-300 p-5 min-h-[300px]"
                    placeholder="Оставьте комментарий по этапу"
                    style={{ resize: "none" }}
                    defaultValue={stageMetrics.comment || ""}
                    onChange={(evt) => {
                        setStageMetrics((prev) => ({
                            ...prev,
                            comment: evt.target.value,
                        }));
                    }}
                />
            </div>
        </div>
    );
};

export default SaleStageDetails;
