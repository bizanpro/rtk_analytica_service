import { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";

import ExecutorBlock from "../ExecutorBlock/ExecutorBlock";

import DatePicker from "react-datepicker";

import "./NewProject.scss";
import "react-datepicker/dist/react-datepicker.css";

const NewProject = () => {
    const location = useLocation();
    const [projectName, setProjectName] = useState(
        location.state?.projectName || "Новый проект"
    );

    const [mode, setMode] = useState("edit");
    const [keyPersons, setKeyPersons] = useState([]);
    const [lenders, setLenders] = useState([]);

    const defaultRanges = {
        picker1: { start: new Date("2024-08-01"), end: new Date("2024-10-01") },
        picker2: { start: new Date("2024-06-01"), end: new Date("2024-07-01") },
        picker3: { start: new Date("2024-06-01"), end: new Date("2024-07-01") },
    };

    const [dateRanges, setDateRanges] = useState(defaultRanges);

    const [agreementStatus, setAgreementStatus] = useState("запланирован");

    const addBlock = (type) => {
        if (type === "key-person") {
            setKeyPersons([
                ...keyPersons,
                {
                    id: Date.now(),
                    fullName: "",
                    phone: "",
                    position: "",
                    email: "",
                    isEditing: false,
                },
            ]);
        } else if (type === "lender") {
            setLenders([
                ...lenders,
                {
                    id: Date.now(),
                    fullName: "",
                    phone: "",
                    position: "",
                    email: "",
                    isEditing: false,
                },
            ]);
        }
    };

    const removeBlock = useCallback((id, data, method) => {
        method(data.filter((block) => block.id !== id));
    }, []);

    const handleChange = useCallback((id, field, value, data, method) => {
        method(
            data.map((block) =>
                block.id === id
                    ? { ...block, [field]: value, isEditing: true }
                    : block
            )
        );
    }, []);

    const handleBlur = useCallback((id, data, method) => {
        method(
            data.map((block) =>
                block.id === id &&
                block.fullName &&
                block.phone &&
                block.position &&
                block.email
                    ? { ...block, isEditing: false }
                    : block
            )
        );
    }, []);

    const handleChangeDateRange =
        (id) =>
        ([newStartDate, newEndDate]) => {
            setDateRanges((prev) => ({
                ...prev,
                [id]: { start: newStartDate, end: newEndDate },
            }));
        };

    const updateStatus = () => {
        const today = new Date();
        const { start, end } = dateRanges.picker3;

        if (end && end < today) {
            setAgreementStatus("завершён");
        } else if (start > today) {
            setAgreementStatus("запланирован");
        } else if (start <= today && !end) {
            setAgreementStatus("в работе");
        }
    };

    useEffect(() => {
        updateStatus();
    }, [dateRanges]);

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
                                    <div className="border-2 border-gray-300 p-5">
                                        <select className="w-full">
                                            <option value="Золотодобыча">
                                                Золотодобыча
                                            </option>
                                            <option value="Золотодобыча">
                                                Золотодобыча
                                            </option>
                                        </select>
                                    </div>
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
                                            onClick={() =>
                                                addBlock("key-person")
                                            }
                                            title="Добавить ключевое лицо Заказчика"
                                        >
                                            <span></span>
                                        </button>
                                    </div>

                                    <ul className="mt-20 grid gap-4">
                                        {keyPersons.length === 0 ? (
                                            <p>Нет данных</p>
                                        ) : (
                                            keyPersons.map(
                                                ({
                                                    id,
                                                    fullName,
                                                    phone,
                                                    position,
                                                    email,
                                                    isEditing,
                                                }) => (
                                                    <ExecutorBlock
                                                        key={id}
                                                        id={id}
                                                        fullName={fullName}
                                                        phone={phone}
                                                        position={position}
                                                        email={email}
                                                        isEditing={isEditing}
                                                        removeBlock={
                                                            removeBlock
                                                        }
                                                        handleChange={
                                                            handleChange
                                                        }
                                                        handleBlur={handleBlur}
                                                        data={keyPersons}
                                                        method={setKeyPersons}
                                                    />
                                                )
                                            )
                                        )}
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
                                            onClick={() => addBlock("lender")}
                                            title="Добавить Кредитора"
                                        >
                                            <span></span>
                                        </button>
                                    </div>

                                    <ul className="flex gap-3 flex-wrap">
                                        <li className="border rounded border-gray-300 border-dashed p-1 flex-[0_0_30%] text-center text-gray-300">
                                            Банк
                                        </li>
                                    </ul>

                                    <ul className="mt-11 grid gap-4">
                                        {lenders.length === 0 ? (
                                            <p>Нет данных</p>
                                        ) : (
                                            lenders.map(
                                                ({
                                                    id,
                                                    fullName,
                                                    phone,
                                                    position,
                                                    email,
                                                    isEditing,
                                                }) => (
                                                    <ExecutorBlock
                                                        key={id}
                                                        id={id}
                                                        fullName={fullName}
                                                        phone={phone}
                                                        position={position}
                                                        email={email}
                                                        isEditing={isEditing}
                                                        removeBlock={
                                                            removeBlock
                                                        }
                                                        handleChange={
                                                            handleChange
                                                        }
                                                        handleBlur={handleBlur}
                                                        data={lenders}
                                                        method={setLenders}
                                                    />
                                                )
                                            )
                                        )}
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

                                <div className="border-2 border-gray-300 p-5 min-h-full flex-grow">
                                    {/* <ul>
                                        <li className="grid items-center grid-cols-[25%_20%_55%] text-gray-400">
                                            <span>Отчет</span>
                                            <span>Статус</span>
                                            <span>Согласован</span>
                                        </li>
                                    </ul> */}

                                    <div className="grid gap-6">
                                        <div className="grid gap-3 grid-cols-[50%_50%]">
                                            <div className="flex flex-col gap-2 justify-between">
                                                <span className="text-gray-400">
                                                    Тип отчёта
                                                </span>
                                                <div className="border-2 border-gray-300 p-1">
                                                    <select className="w-full">
                                                        <option value="ФТА">
                                                            ФТА
                                                        </option>
                                                        <option value="ФТМ">
                                                            ФТМ
                                                        </option>
                                                        <option value="ФМ">
                                                            ФМ
                                                        </option>
                                                        <option value="ИЗ">
                                                            ИЗ
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 justify-between">
                                                <span className="text-gray-400">
                                                    Отчетный период
                                                </span>
                                                <DatePicker
                                                    className="border-2 border-gray-300 p-1 w-full"
                                                    selected={
                                                        dateRanges.picker1.start
                                                    }
                                                    startDate={
                                                        dateRanges.picker1.start
                                                    }
                                                    endDate={
                                                        dateRanges.picker1.end
                                                    }
                                                    onChange={handleChangeDateRange(
                                                        "picker1"
                                                    )}
                                                    excludeDates={[
                                                        new Date("2024-05-01"),
                                                        new Date("2024-02-01"),
                                                        new Date("2024-01-01"),
                                                        new Date("2024-11-01"),
                                                    ]}
                                                    dateFormat="dd.MM.yyyy"
                                                    placeholderText=""
                                                    selectsRange
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-3 grid-cols-[50%_50%]">
                                            <div className="flex flex-col gap-2 justify-between">
                                                <span className="text-gray-400">
                                                    Бюджет проекта, млрд руб.
                                                </span>
                                                <div className="border-2 border-gray-300 p-1">
                                                    <input
                                                        type="number"
                                                        className="w-full"
                                                        placeholder="0,0"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 justify-between">
                                                <span className="text-gray-400">
                                                    Период реализации
                                                </span>
                                                <DatePicker
                                                    className="border-2 border-gray-300 p-1 w-full"
                                                    selected={
                                                        dateRanges.picker2.start
                                                    }
                                                    startDate={
                                                        dateRanges.picker2.start
                                                    }
                                                    endDate={
                                                        dateRanges.picker2.end
                                                    }
                                                    onChange={handleChangeDateRange(
                                                        "picker2"
                                                    )}
                                                    excludeDates={[
                                                        new Date("2024-05-01"),
                                                        new Date("2024-02-01"),
                                                        new Date("2024-01-01"),
                                                        new Date("2024-11-01"),
                                                    ]}
                                                    dateFormat="dd.MM.yyyy"
                                                    placeholderText=""
                                                    selectsRange
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-3 grid-cols-1">
                                            <div className="flex flex-col gap-2 justify-between">
                                                <span className="text-gray-400">
                                                    Договор
                                                </span>
                                                <div className="border-2 border-gray-300 p-1">
                                                    <select className="w-full">
                                                        <option value="Договор 45222 от 12.01.2025">
                                                            Договор 45222 от
                                                            12.01.2025
                                                        </option>
                                                        <option value="Договор 45222 от 12.01.2025">
                                                            Договор 45222 от
                                                            13.01.2025
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid gap-3 grid-cols-[50%_50%]">
                                            <div className="flex flex-col gap-2 justify-between">
                                                <span className="text-gray-400">
                                                    Стоимость услуг, руб.
                                                </span>
                                                <div className="border-2 border-gray-300 p-1">
                                                    <input
                                                        type="number"
                                                        className="w-full"
                                                        placeholder="0,0"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 justify-between">
                                                <span className="text-gray-400">
                                                    Период выполнения
                                                </span>
                                                <DatePicker
                                                    className="border-2 border-gray-300 p-1 w-full"
                                                    selected={
                                                        dateRanges.picker3.start
                                                    }
                                                    startDate={
                                                        dateRanges.picker3.start
                                                    }
                                                    endDate={
                                                        dateRanges.picker3.end
                                                    }
                                                    onChange={handleChangeDateRange(
                                                        "picker3"
                                                    )}
                                                    excludeDates={[
                                                        new Date("2024-05-01"),
                                                        new Date("2024-02-01"),
                                                        new Date("2024-01-01"),
                                                        new Date("2024-11-01"),
                                                    ]}
                                                    dateFormat="dd.MM.yyyy"
                                                    placeholderText=""
                                                    selectsRange
                                                />
                                            </div>
                                        </div>

                                        <div
                                            className={`grid gap-3 ${
                                                agreementStatus == "завершён"
                                                    ? "grid-cols-[50%_50%]"
                                                    : "grid-cols-1"
                                            }`}
                                        >
                                            <div className="flex flex-col gap-2 justify-between">
                                                <span className="text-gray-400">
                                                    Статус
                                                </span>
                                                <div className="border-2 border-gray-300 p-1">
                                                    <select
                                                        className="w-full"
                                                        value={agreementStatus}
                                                        onChange={(evt) =>
                                                            setAgreementStatus(
                                                                evt.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="запланирован">
                                                            запланирован
                                                        </option>
                                                        <option value="в работе">
                                                            в работе
                                                        </option>
                                                        <option value="завершён">
                                                            завершён
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>

                                            {agreementStatus == "завершён" && (
                                                <div className="flex flex-col gap-2 justify-between">
                                                    <span className="text-gray-400">
                                                        Добавить отчет
                                                    </span>

                                                    <div className="grid gap-3 grid-cols-[50%_50%]"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
export default NewProject;
