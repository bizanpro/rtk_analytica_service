import { useState } from "react";
import { useLocation } from "react-router-dom";

import "./NewProject.scss";

const NewProject = () => {
    const location = useLocation();
    const [projectName, setProjectName] = useState(
        location.state?.projectName || "Новый проект"
    );
    const [mode, setMode] = useState("edit");

    return (
        <main className="page">
            <div className="new-project">
                <div className="container py-8">
                    <div className="flex justify-between items-center">
                        <input
                            type="text"
                            className="text-3xl font-medium"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                        />

                        <nav className="switch">
                            <div>
                                <input
                                    type="radio"
                                    name="mode"
                                    id="read_mode"
                                    onChange={() => setMode("read")}
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

                    <div className="new-project__wrapper mt-15">
                        <div>
                            <div className="grid gap-6 grid-cols-[20%_40%_40%] mb-10">
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray-400">
                                        Бюджет проекта
                                    </span>
                                    <input
                                        className="py-5"
                                        type="text"
                                        value="Нет данных"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span className="flex items-center gap-2 text-gray-400">
                                        Заказчик{" "}
                                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                            ?
                                        </span>
                                    </span>
                                    <div className="border-2 border-gray-300 p-5">
                                        <select className="w-full">
                                            <option value="ООО 'СГРК'">
                                                ООО "СГРК"
                                            </option>
                                            <option value="ООО 'СГРК'">
                                                ООО "СГРК"
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span className="flex items-center gap-2 text-gray-400">
                                        Услуги{" "}
                                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                            ?
                                        </span>
                                    </span>
                                    <input
                                        className="py-5"
                                        type="text"
                                        value="Нет данных"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-6 grid-cols-[20%_40%_40%] mb-10">
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray-400">
                                        Срок реализации
                                    </span>
                                    <input
                                        className="py-5"
                                        type="text"
                                        value="Нет данных"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span className="flex items-center gap-2 text-gray-400">
                                        Отрасль{" "}
                                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                            ?
                                        </span>
                                    </span>
                                    <input
                                        type="text"
                                        className="border-2 border-gray-300 p-5"
                                        placeholder="Наименование отрасли"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-6 grid-cols-[60%_40%] mb-10">
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray-400">
                                        Краткое описание
                                    </span>
                                    <textarea
                                        className="border-2 border-gray-300 p-5 min-h-[320px] max-h-[450px]"
                                        placeholder="Заполните описание проекта"
                                        type="text"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span className="text-gray-400">
                                        Команда проекта
                                    </span>
                                    <ul className="flex gap-3 flex-wrap">
                                        <li className="border rounded border-gray-300 border-dashed p-2 flex-[1_0_30%]"></li>
                                        <li className="border rounded border-gray-300 border-dashed p-2 flex-[1_0_30%]"></li>
                                        <li className="border rounded border-gray-300 border-dashed p-2 flex-[1_0_30%]"></li>
                                    </ul>
                                    <div className="grid grid-cols-2 gap-4 mt-10">
                                        <div className="flex flex-col gap-2">
                                            <b>Прохоров Серей Викторович</b>
                                            <span>Сотрудник</span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <b>Руководитель проекта</b>
                                            <span></span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <b>ООО "ИЭС"</b>
                                            <span>Подрядчик</span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <b>Технология</b>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6 grid-cols-[50%_50%]">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">
                                            Ключевые лица Заказчика
                                        </span>
                                        <button
                                            type="button"
                                            className="add-button"
                                        >
                                            <span></span>
                                        </button>
                                    </div>

                                    <ul className="mt-20">
                                        Нет данных
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                    </ul>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">
                                            Кредиторы
                                        </span>
                                        <button
                                            type="button"
                                            className="add-button"
                                        >
                                            <span></span>
                                        </button>
                                    </div>

                                    <ul className="flex gap-3 flex-wrap">
                                        <li className="border rounded border-gray-300 border-dashed p-1 flex-[0_0_30%] text-center text-gray-300">
                                            Банк
                                        </li>
                                    </ul>

                                    <ul className="mt-20">
                                        Нет данных
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="border-2 border-gray-300 p-5 mb-5">
                                <div className="grid items-center grid-cols-3 gap-3">
                                    <div className="flex flex-col gap-2">
                                        <span className="flex items-center gap-2 text-gray-400">
                                            Выручка{" "}
                                            <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                ?
                                            </span>
                                        </span>
                                        <input
                                            className="py-5"
                                            type="text"
                                            value="Нет данных"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-gray-400">
                                            Поступления
                                        </span>
                                        <input
                                            className="py-5"
                                            type="text"
                                            value="Нет данных"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="flex items-center gap-2 text-gray-400">
                                            ДЗ{" "}
                                            <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                ?
                                            </span>
                                        </span>
                                        <input
                                            className="py-5"
                                            type="text"
                                            value="Нет данных"
                                        />
                                    </div>
                                </div>
                                <div className="grid items-center grid-cols-3 gap-3">
                                    <div className="flex flex-col gap-2">
                                        <span className="flex items-center gap-2 text-gray-400">
                                            Валовая прибыль{" "}
                                            <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                ?
                                            </span>
                                        </span>
                                        <input
                                            className="py-5"
                                            type="text"
                                            value="Нет данных"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="flex items-center gap-2 text-gray-400">
                                            Подрячики{" "}
                                            <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                ?
                                            </span>
                                        </span>
                                        <input
                                            className="py-5"
                                            type="text"
                                            value="Нет данных"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="flex items-center gap-2 text-gray-400">
                                            Валовая рент.{" "}
                                            <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                ?
                                            </span>
                                        </span>
                                        <input
                                            className="py-5"
                                            type="text"
                                            value="Нет данных"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 flex-grow">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">
                                        История проекта
                                    </span>

                                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                        ?
                                    </span>

                                    <button
                                        type="button"
                                        className="add-button"
                                    >
                                        <span></span>
                                    </button>
                                </div>

                                <ul className="border-2 border-gray-300 p-5 min-h-full flex-grow">
                                    <li className="grid items-center grid-cols-[25%_20%_55%] text-gray-400">
                                        <span>Отчет</span>
                                        <span>Статус</span>
                                        <span>Согласован</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
export default NewProject;
