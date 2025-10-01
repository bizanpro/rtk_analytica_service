import { useState } from "react";

import getData from "../../utils/getData";
import postData from "../../utils/postData";

import SaleFunnelItem from "./SaleFunnelItem";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SaleFunnelStages = ({
    saleId,
    saleStages,
    handleNextStage,
    getStageDetails,
    activeStage,
    setActiveStage,
    handleActiveStageDate,
    getStages,
    requestNextStage,
    mode,
}) => {
    const [popupState, setPopupState] = useState(false);
    const [resumableStages, setResumableStages] = useState([]);

    const openResumableStagesPopup = () => {
        getData(
            `${
                import.meta.env.VITE_API_URL
            }sales-funnel-projects/${saleId}/resumable-stages`
        ).then((response) => {
            if (response?.status == 200) {
                setResumableStages(response.data.stages);
                setPopupState(true);
            }
        });
    };

    // Возобновить воронку продаж
    const resumeSaleFunnel = (id) => {
        postData(
            "POST",
            `${
                import.meta.env.VITE_API_URL
            }sales-funnel-projects/${saleId}/resume`,
            { stage_id: id }
        )
            .then((response) => {
                if (response?.ok) {
                    toast.success(response.message || "Воронка возобновления", {
                        containerId: "toast",
                        isLoading: false,
                        autoClose: 3000,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position: "top-center",
                    });

                    getStages();
                    setPopupState(false);
                    setResumableStages([]);
                }
            })
            .catch((error) => {
                toast.error(error.message || "Ошибка возобновления", {
                    containerId: "toast",
                    isLoading: false,
                    autoClose: 3000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                });
            });
    };

    // Отменить возобновление воронки продаж
    const cancelResumeSaleFunnel = () => {
        postData(
            "DELETE",
            `${
                import.meta.env.VITE_API_URL
            }sales-funnel-projects/${saleId}/resume`
        )
            .then((response) => {
                if (response?.ok) {
                    toast.success(
                        response.message || "Возобновление отменено",
                        {
                            containerId: "toast",
                            isLoading: false,
                            autoClose: 3000,
                            pauseOnFocusLoss: false,
                            pauseOnHover: false,
                            position: "top-center",
                        }
                    );

                    getStages();
                }
            })
            .catch((error) => {
                toast.error(error.message || "Ошибка отмены", {
                    containerId: "toast",
                    isLoading: false,
                    autoClose: 3000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                });
            });
    };

    return (
        <ul className="grid gap-3">
            <ToastContainer containerId="toast" />

            <li className="grid items-center grid-cols-[1fr_32%_19%] gap-5 mb-2 text-gray-400 pl-5">
                <span className="flex items-center gap-2">Этап</span>
                <span className="flex items-center gap-2">Дата</span>
                <span className="flex items-center gap-2">Статус</span>
            </li>

            {saleStages.stages?.length > 0 &&
                saleStages.stages.map((stage, index, arr) => {
                    const prevStages = arr.slice(0, index);

                    // Максимальная дата среди предшественников
                    const maxPrevDate = prevStages.length
                        ? new Date(
                              Math.max(
                                  ...prevStages.map((s) =>
                                      s.stage_date
                                          ? new Date(s.stage_date).getTime()
                                          : 0
                                  )
                              )
                          )
                        : null;

                    const isLast = index === arr.length - 1;

                    const nextStage = arr[index + 1];

                    const showCancelButton =
                        nextStage && nextStage.can_cancel_resume === true;

                    return stage.name.toLowerCase() ==
                        "воронка возобновлена" ? (
                        <div
                            key={stage.id}
                            className="text-gray-400 px-5.5 flex items-center gap-2 mb-2"
                        >
                            {stage.name}

                            {showCancelButton && (
                                <button
                                    className="border rounded-[50%] flex items-center justify-center w-[20px] h-[20px] flex-[0_0_20px] leading-4"
                                    type="button"
                                    title="Отменить возобновление воронки"
                                    onClick={() => {
                                        cancelResumeSaleFunnel();
                                    }}
                                >
                                    X
                                </button>
                            )}
                        </div>
                    ) : (
                        <SaleFunnelItem
                            key={stage.id}
                            stage={stage}
                            getStageDetails={getStageDetails}
                            activeStage={activeStage}
                            prevStage={maxPrevDate}
                            isLast={isLast}
                            setActiveStage={setActiveStage}
                            handleNextStage={handleNextStage}
                            handleActiveStageDate={handleActiveStageDate}
                            requestNextStage={requestNextStage}
                        />
                    );
                })}

            {saleStages.stages[
                saleStages.stages.length - 1
            ]?.name?.toLowerCase() === "отказ от участия" ||
            saleStages.stages[
                saleStages.stages.length - 1
            ]?.name?.toLowerCase() === "получен отказ" ||
            saleStages.stages[
                saleStages.stages.length - 1
            ]?.name?.toLowerCase() === "проект отложен" ? (
                <button
                    type="button"
                    className="text-lg italic w-fit px-5.5"
                    onClick={() => openResumableStagesPopup()}
                    title="Возобновить воронку"
                >
                    Возобновить воронку
                </button>
            ) : null}

            {popupState && (
                <div
                    className="fixed w-[100vw] h-[100vh] inset-0 z-2 flex items-center justify-center"
                    style={{ background: "rgba(0, 0, 0, 0.2)" }}
                    onClick={() => {
                        setPopupState(false);
                    }}
                >
                    <div
                        className="bg-white p-6"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <div className="flex items-center justify-between gap-8 mb-5 text-lg">
                            <b>
                                Выберите этап для возобновления воронки продаж
                            </b>

                            <button
                                type="button"
                                className="border rounded-[50%] flex items-center justify-center w-[20px] h-[20px] flex-[0_0_20px] leading-4"
                                style={{ lineHeight: "150%" }}
                                title="Закрыть окно"
                                onClick={() => {
                                    setPopupState(false);
                                }}
                            >
                                x
                            </button>
                        </div>

                        {resumableStages.length > 0 && (
                            <ul className="grid gap-4">
                                {resumableStages.map((item) => (
                                    <button
                                        type="button"
                                        className="w-fit text-lg"
                                        key={item.id}
                                        title={`Перейти к этапу ${item.name}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            resumeSaleFunnel(item.id);
                                        }}
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </ul>
    );
};

export default SaleFunnelStages;
