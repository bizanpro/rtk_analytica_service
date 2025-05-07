import { useState, useCallback, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";

import "react-datepicker/dist/react-datepicker.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SaleCard = () => {
    const URL = `${import.meta.env.VITE_API_URL}sales`;
    const location = useLocation();
    const { saleId } = useParams();

    const [mode, setMode] = useState(location.state?.mode || "read");

    let query;

    return (
        <main className="page">
            <div className="new-project pt-8 pb-15">
                <div className="container">
                    <ToastContainer containerId="projectCard" />

                    <div className="flex justify-between items-center gap-10">
                        <div className="flex items-center gap-3 flex-grow">
                            <div className="flex flex-col gap-3 w-full">
                                <input
                                    type="text"
                                    className="text-3xl font-medium"
                                    name="name"
                                    defaultValue="ГОК Радужный"
                                    // onChange={(e) =>
                                    //     handleInputChange(e, "name")
                                    // }
                                    disabled={mode == "read" ? true : false}
                                />
                            </div>

                            {/* {mode === "edit" &&
                                projectData?.name?.length > 2 && (
                                    <button
                                        type="button"
                                        className="update-icon"
                                        title="Обновить данные проекта"
                                        onClick={() => updateProject(projectId)}
                                    ></button>
                                )} */}
                        </div>

                        <nav className="switch">
                            <div>
                                <input
                                    type="radio"
                                    name="mode"
                                    id="read_mode"
                                    onChange={() => {
                                        setMode("read");
                                    }}
                                    checked={mode === "read" ? true : false}
                                />
                                <label htmlFor="read_mode">Чтение</label>
                            </div>

                            <div>
                                <input
                                    type="radio"
                                    name="mode"
                                    id="edit_mode"
                                    onChange={() => setMode("edit")}
                                    checked={mode === "edit" ? true : false}
                                />
                                <label htmlFor="edit_mode">
                                    Редактирование
                                </label>
                            </div>
                        </nav>
                    </div>

                    <div className="mt-15 grid grid-cols-3">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-2 flex-shrink-0 flex-grow">
                                <span className="flex items-center gap-2 text-gray-400">
                                    Заказчик{" "}
                                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                        ?
                                    </span>
                                </span>
                                <div className="border-2 border-gray-300 p-5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">
                                            Добавьте нового или выберите из
                                            списка
                                        </span>

                                        <button
                                            type="button"
                                            className="add-button"
                                            title="Выбрать заказчика"
                                        >
                                            <span></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-[1fr_40%] gap-5">
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2 flex-shrink-0 flex-grow">
                                        <span className="flex items-center gap-2 text-gray-400">
                                            Отрасль{" "}
                                            <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                ?
                                            </span>
                                        </span>
                                        <div className="border-2 border-gray-300 p-5">
                                            <select
                                                className="w-full h-[21px]"
                                                defaultValue={""}
                                                disabled={
                                                    mode == "read"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                <option value="">
                                                    Наименование отрасли
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 flex-shrink-0 flex-grow">
                                        <span className="flex items-center gap-2 text-gray-400">
                                            Источник{" "}
                                            <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                ?
                                            </span>
                                        </span>
                                        <div className="border-2 border-gray-300 p-5">
                                            <select
                                                className="w-full h-[21px]"
                                                defaultValue={""}
                                                disabled={
                                                    mode == "read"
                                                        ? true
                                                        : false
                                                }
                                            >
                                                <option value="">
                                                    Выберите из списка
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 flex-shrink-0 flex-grow">
                                    <span className="flex items-center gap-2 text-gray-400">
                                        Банк{" "}
                                        <button
                                            type="button"
                                            className="add-button"
                                            title="Выбрать банк"
                                        >
                                            <span></span>
                                        </button>
                                    </span>
                                    <div className="border-2 border-gray-300 p-5 h-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
export default SaleCard;
