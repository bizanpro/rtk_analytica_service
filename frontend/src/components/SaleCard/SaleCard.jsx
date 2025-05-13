import { useState, useCallback, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";

import NewCustomerWindow from "./NewCustomerWindow";

import "react-datepicker/dist/react-datepicker.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SaleCard = () => {
    const URL = `${import.meta.env.VITE_API_URL}sales`;
    const location = useLocation();
    const { saleId } = useParams();

    const [mode, setMode] = useState(location.state?.mode || "read");

    const [addCustomer, setAddCustomer] = useState(false);

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
                                    checked={mode === "read"}
                                />
                                <label htmlFor="read_mode">Чтение</label>
                            </div>

                            <div>
                                <input
                                    type="radio"
                                    name="mode"
                                    id="edit_mode"
                                    onChange={() => setMode("edit")}
                                    checked={mode === "edit"}
                                />
                                <label htmlFor="edit_mode">
                                    Редактирование
                                </label>
                            </div>
                        </nav>
                    </div>

                    <div className="mt-15 grid grid-cols-3 gap-10">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-2 flex-shrink-0 flex-grow">
                                <span className="flex items-center gap-2 text-gray-400">
                                    Заказчик{" "}
                                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                        ?
                                    </span>
                                </span>
                                <div className="border-2 border-gray-300 p-5">
                                    {addCustomer ? (
                                        <NewCustomerWindow
                                            setAddCustomer={setAddCustomer}
                                        />
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">
                                                Добавьте нового или выберите из
                                                списка
                                            </span>

                                            <button
                                                type="button"
                                                className="add-button"
                                                title="Выбрать заказчика"
                                                onClick={() =>
                                                    setAddCustomer(true)
                                                }
                                            >
                                                <span></span>
                                            </button>
                                        </div>
                                    )}
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
                                        Банк
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

                            <div className="flex flex-col gap-2 flex-shrink-0 flex-grow">
                                <span className="flex items-center gap-2 text-gray-400">
                                    Местоположение
                                </span>
                                <div className="border-2 border-gray-300 p-5">
                                    <input
                                        type="text"
                                        className="w-full"
                                        placeholder="Заполните местоположение"
                                        disabled={mode == "read" ? true : false}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-gray-400">
                                    Краткое описание
                                </span>
                                <textarea
                                    className="border-2 border-gray-300 p-5 min-h-[300px]"
                                    placeholder="Заполните описание проекта"
                                    style={{ resize: "none" }}
                                    type="text"
                                    name="description"
                                    disabled={mode == "read" ? true : false}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-2 h-[200px]">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">
                                        Услуги
                                    </span>
                                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                        ?
                                    </span>
                                    <button
                                        type="button"
                                        className="add-button"
                                        title="Добавить услугу"
                                    >
                                        <span></span>
                                    </button>
                                </div>

                                <div className="border-2 border-gray-300 py-5 px-4 h-full overflow-x-hidden overflow-y-auto">
                                    <ul className="grid gap-3">
                                        <li className="grid items-center grid-cols-[1fr_40%] gap-3 mb-2 text-gray-400">
                                            <span>Тип услуги</span>
                                            <span className="flex items-center gap-2">
                                                Стоимость
                                                <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                    ?
                                                </span>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 flex-grow">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">
                                        Воронка продажи
                                    </span>
                                </div>

                                <div className="border-2 border-gray-300 py-5 px-4 h-full overflow-x-hidden overflow-y-auto">
                                    <ul className="grid gap-3">
                                        <li className="grid items-center grid-cols-[1fr_25%_25%] gap-3 mb-2 text-gray-400">
                                            <span className="flex items-center gap-2">
                                                Этап
                                                <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                    ?
                                                </span>
                                            </span>
                                            <span className="flex items-center gap-2">
                                                Дата
                                                <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                    ?
                                                </span>
                                            </span>
                                            <span className="flex items-center gap-2">
                                                Статус
                                                <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                    ?
                                                </span>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-2 h-[200px]">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">
                                        Перечень работ
                                    </span>
                                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                        ?
                                    </span>
                                </div>

                                <textarea
                                    className="border-2 border-gray-300 p-5 h-full"
                                    placeholder="Заполните перечень работ"
                                    style={{ resize: "none" }}
                                    type="text"
                                    name="description"
                                    disabled={mode == "read" ? true : false}
                                />
                            </div>

                            <div className="flex flex-col gap-2 flex-grow">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">
                                        Воронка продажи
                                    </span>
                                </div>

                                <div className="border-2 border-gray-300 py-5 px-4 h-full">
                                    <textarea
                                        className="p-5 h-full w-full"
                                        placeholder="Оставьте комментарии по этапу"
                                        style={{ resize: "none" }}
                                        type="text"
                                        name="description"
                                        disabled={mode == "read" ? true : false}
                                    />
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
