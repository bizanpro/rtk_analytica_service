import { useState, useCallback, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";

import ExecutorBlock from "../ExecutorBlock/ExecutorBlock";
import DatePicker from "react-datepicker";

import "./ProjectCard.scss";
import "react-datepicker/dist/react-datepicker.css";

const ProjectCard = () => {
    const URL = `${import.meta.env.VITE_API_URL}projects`;

    const { projectId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [projectData, setProjectData] = useState({});
    const [projectName, setProjectName] = useState(
        projectId ? "" : location.state?.projectName
    );

    useEffect(() => {
        if (projectId) {
            getData("/data/projects.json", { Accept: "application/json" }).then(
                (response) => {
                    const data = response.data.find(
                        (item) => item.id == projectId
                    );
                    setProjectData(data);
                }
            );
        }
        // .finally(() => setIsLoading(false));
    }, []);

    const [mode, setMode] = useState(projectId ? "read" : "edit");
    const [keyPersons, setKeyPersons] = useState([]);
    const [lenders, setLenders] = useState([]);
    const [teammates, setTeammates] = useState([]);
    const [contractors, setContractors] = useState([]);

    useEffect(() => {
        if (projectId && projectData?.name) {
            setProjectName(projectData.name);
        }
        if (projectId && projectData?.customer_key_persons) {
            setKeyPersons(projectData.customer_key_persons);
        }
    }, [projectData, projectId]);

    const defaultRanges = {
        picker1: { start: new Date("2024-08-01"), end: new Date("2024-10-01") },
        picker2: { start: new Date("2024-06-01"), end: new Date("2024-07-01") },
        picker3: { start: new Date("2024-06-01"), end: new Date("2024-07-01") },
    };

    const [dateRanges, setDateRanges] = useState(defaultRanges);
    const [agreementStatus, setAgreementStatus] = useState("запланирован");
    const [reportWindowsState, setReportWindowsState] = useState(false);

    const addBlock = (type) => {
        if (type === "key-person") {
            if (keyPersons.length < 5) {
                setKeyPersons([
                    ...keyPersons,
                    {
                        id: Date.now(),
                        fullName: "",
                        phone: "",
                        position: "",
                        email: "",
                        borderClass: "border-gray-300",
                    },
                ]);
            }
        } else if (type === "lender") {
            if (lenders.length < 5) {
                setLenders([
                    ...lenders,
                    {
                        id: Date.now(),
                        fullName: "",
                        phone: "",
                        position: "",
                        email: "",
                        borderClass: "border-gray-300",
                    },
                ]);
            }
        } else if (type === "teammate") {
            if (teammates.length < 5) {
                setTeammates([
                    ...teammates,
                    {
                        id: Date.now(),
                    },
                ]);
            }
        } else if (type === "contractor") {
            if (contractors.length < 5) {
                setContractors([
                    ...contractors,
                    {
                        id: Date.now(),
                    },
                ]);
            }
        }
    };

    const removeBlock = useCallback((id, data, method) => {
        method(data.filter((block) => block.id !== id));
    }, []);

    const handleChange = useCallback((id, field, value, data, method) => {
        method(
            data.map((block) =>
                block.id === id
                    ? {
                          ...block,
                          borderClass: "border-gray-300",
                          [field]: value,
                      }
                    : block
            )
        );
    }, []);

    const handleFocus = (id, data, method) => {
        method(
            data.map((block) =>
                block.id === id
                    ? { ...block, borderClass: "border-gray-300" }
                    : block
            )
        );
    };

    const handleBlur = useCallback((id, data, method) => {
        method(
            data.map((block) => {
                if (block.id === id) {
                    const allFilled =
                        block.fullName.trim() &&
                        block.phone.trim() &&
                        block.position.trim() &&
                        block.email.trim();

                    return {
                        ...block,
                        borderClass: allFilled
                            ? "border-transparent"
                            : "border-gray-300",
                    };
                }
                return block;
            })
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

    const createProject = () => {
        if (projectId) return;

        postData("POST", URL, { name: projectName }).then((response) => {
            if (response) {
                alert("Проект успешно создан");
                navigate(`/projects`);
            }
        });
    };

    return (
        <main className="page">
            <div className="new-project">
                <div className="container py-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                className="text-3xl font-medium"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                disabled={mode == "read" ? true : false}
                            />

                            <button
                                type="button"
                                className="save-icon"
                                style={{
                                    opacity: projectName.length > 3 ? 1 : 0,
                                }}
                                onClick={createProject}
                            ></button>
                        </div>

                        <nav className="switch">
                            <div>
                                <input
                                    type="radio"
                                    name="mode"
                                    id="read_mode"
                                    onChange={() => {
                                        setMode("read");
                                        setReportWindowsState(false);
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
                                        value={
                                            projectId && projectData
                                                ? projectData.service_cost
                                                : "Нет данных"
                                        }
                                        disabled={mode == "read" ? true : false}
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
                                        {mode == "read" ? (
                                            <input
                                                className="w-full h-[21px]"
                                                type="text"
                                                disabled
                                                value={
                                                    projectId && projectData
                                                        ? projectData.client
                                                        : "ООО 'СГРК'"
                                                }
                                            />
                                        ) : (
                                            <select className="w-full">
                                                <option
                                                    value={
                                                        projectId && projectData
                                                            ? projectData.client
                                                            : "ООО 'СГРК'"
                                                    }
                                                >
                                                    {projectId && projectData
                                                        ? projectData.client
                                                        : "ООО 'СГРК'"}
                                                </option>
                                            </select>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span className="flex items-center gap-2 text-gray-400">
                                        Услуги{" "}
                                        <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                            ?
                                        </span>
                                    </span>
                                    <ul className="grid gap-3">
                                        <li className="flex items-center gap-4">
                                            <div className="text-lg">ФТМ</div>
                                            <div className="text-lg">
                                                5,0 млн руб.
                                            </div>
                                            <div className="text-lg">
                                                ежеквартально
                                            </div>
                                            <div className="bg-gray-200 py-1 px-2 text-center rounded-md">
                                                в процессе
                                            </div>
                                        </li>
                                        <li className="flex items-center gap-4">
                                            <div className="text-lg">ФТМ</div>
                                            <div className="text-lg">
                                                5,0 млн руб.
                                            </div>
                                            <div className="text-lg">
                                                ежеквартально
                                            </div>
                                            <div className="bg-gray-200 py-1 px-2 text-center rounded-md">
                                                в процессе
                                            </div>
                                        </li>
                                    </ul>
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
                                        value={
                                            projectId && projectData
                                                ? projectData.implementation_period_start
                                                : "ООО 'СГРК'"
                                        }
                                        disabled={mode == "read" ? true : false}
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
                                        {mode == "read" ? (
                                            <input
                                                className="w-full h-[21px]"
                                                type="text"
                                                disabled
                                                value={
                                                    projectId && projectData
                                                        ? projectData.sector
                                                        : "Золотодобыча"
                                                }
                                            />
                                        ) : (
                                            <select className="w-full">
                                                <option
                                                    value={
                                                        projectId && projectData
                                                            ? projectData.sector
                                                            : "Золотодобыча"
                                                    }
                                                >
                                                    {projectId && projectData
                                                        ? projectData.sector
                                                        : "Золотодобыча"}
                                                </option>
                                            </select>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6 grid-cols-[60%_40%] mb-5">
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray-400">
                                        Краткое описание
                                    </span>
                                    <textarea
                                        className="border-2 border-gray-300 p-5 min-h-[300px] max-h-[400px]"
                                        placeholder="Заполните описание проекта"
                                        type="text"
                                        disabled={mode == "read" ? true : false}
                                        value={
                                            projectId && projectData
                                                ? projectData.comment
                                                : ""
                                        }
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
                                    <div className="grid gap-8 mt-10">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="text-lg">
                                                    Прохоров Серей Викторович
                                                </div>
                                                <span className="text-sm">
                                                    Сотрудник
                                                </span>
                                            </div>
                                            <div className="text-lg">
                                                Руководитель проекта
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="text-lg">
                                                    ООО "ИЭС"
                                                </div>
                                                <span className="text-sm">
                                                    Подрядчик
                                                </span>
                                            </div>
                                            <div className="text-lg">
                                                Технология
                                            </div>
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
                                        {mode == "edit" && (
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
                                        )}
                                    </div>

                                    <ul className="mt-12 grid gap-4">
                                        {keyPersons.length === 0 ? (
                                            <p>Нет данных</p>
                                        ) : (
                                            keyPersons.map((person) => (
                                                <ExecutorBlock
                                                    key={person.id}
                                                    person={person}
                                                    borderClass={
                                                        person.borderClass ||
                                                        "border-transparent"
                                                    }
                                                    removeBlock={removeBlock}
                                                    handleChange={handleChange}
                                                    handleBlur={handleBlur}
                                                    data={keyPersons}
                                                    method={setKeyPersons}
                                                    handleFocus={handleFocus}
                                                />
                                            ))
                                        )}
                                    </ul>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">
                                            Кредиторы
                                        </span>
                                        {mode == "edit" && (
                                            <button
                                                type="button"
                                                className="add-button"
                                                onClick={() =>
                                                    addBlock("lender")
                                                }
                                                title="Добавить Кредитора"
                                            >
                                                <span></span>
                                            </button>
                                        )}
                                    </div>

                                    <ul className="flex gap-3 flex-wrap">
                                        <li className="border rounded border-gray-300 border-dashed p-1 flex-[0_0_30%] text-center text-gray-300">
                                            Банк
                                        </li>
                                    </ul>

                                    <ul className="mt-3.5 grid gap-4">
                                        {lenders.length === 0 ? (
                                            <p>Нет данных</p>
                                        ) : (
                                            lenders.map((person) => (
                                                <ExecutorBlock
                                                    key={person.id}
                                                    person={person}
                                                    borderClass={
                                                        person.borderClass ||
                                                        "border-transparent"
                                                    }
                                                    removeBlock={removeBlock}
                                                    handleChange={handleChange}
                                                    handleBlur={handleBlur}
                                                    data={lenders}
                                                    method={setKeyPersons}
                                                    handleFocus={handleFocus}
                                                />
                                            ))
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="border-2 border-gray-300 p-5 mb-5">
                                <div className="flex flex-col gap-2 justify-between">
                                    <div className="switch gap-4 w-[70%] mb-5">
                                        <div>
                                            <input
                                                type="radio"
                                                name="time_sort"
                                                id="this_year"
                                                checked
                                            />
                                            <label
                                                className="bg-gray-200 py-1 px-2 text-center rounded-md"
                                                htmlFor="this_year"
                                            >
                                                Текущий год
                                            </label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                name="time_sort"
                                                id="all_time"
                                            />
                                            <label
                                                className="bg-gray-200 py-1 px-2 text-center rounded-md"
                                                htmlFor="all_time"
                                            >
                                                За всё время
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid items-stretch grid-cols-3 gap-3 mb-3">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            Выручка{" "}
                                            <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                ?
                                            </span>
                                        </div>
                                        <div className="flex items-center flex-grow gap-2">
                                            <strong className="font-normal text-4xl">
                                                10,0
                                            </strong>
                                            <small className="text-sm">
                                                млн
                                                <br />
                                                руб.
                                            </small>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="text-gray-400">
                                            Поступления
                                        </div>
                                        <div className="flex items-center flex-grow gap-2">
                                            <strong className="font-normal text-4xl">
                                                8,0
                                            </strong>
                                            <small className="text-sm">
                                                млн
                                                <br />
                                                руб.
                                            </small>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            ДЗ{" "}
                                            <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                ?
                                            </span>
                                        </div>
                                        <div className="flex items-center flex-grow gap-2">
                                            <strong className="font-normal text-4xl">
                                                2,0
                                            </strong>
                                            <small className="text-sm">
                                                млн
                                                <br />
                                                руб.
                                            </small>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid items-stretch grid-cols-3 gap-3">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center flex-grow gap-2 text-gray-400">
                                            Валовая прибыль{" "}
                                            <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                ?
                                            </span>
                                        </div>
                                        <input type="text" value="Нет данных" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            Подрячики{" "}
                                            <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                ?
                                            </span>
                                        </div>
                                        <div className="flex items-center flex-grow gap-2">
                                            <strong className="font-normal text-4xl">
                                                1,0
                                            </strong>
                                            <small className="text-sm">
                                                млн
                                                <br />
                                                руб.
                                            </small>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            Валовая рент.{" "}
                                            <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                                ?
                                            </span>
                                        </div>
                                        <input
                                            className="flex-grow"
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
                                    {mode == "edit" && (
                                        <button
                                            type="button"
                                            className="add-button"
                                            onClick={() =>
                                                setReportWindowsState(true)
                                            }
                                        >
                                            <span></span>
                                        </button>
                                    )}
                                </div>

                                <div className="border-2 border-gray-300 py-5 px-4 min-h-full flex-grow">
                                    {!reportWindowsState ? (
                                        <ul className="grid gap-3">
                                            <li className="grid items-center grid-cols-[24%_24%_49%] gap-3 mb-2 text-gray-400">
                                                <span>Отчет</span>
                                                <span>Статус</span>
                                                <span>Период выполнения</span>
                                            </li>

                                            <li className="grid items-center grid-cols-[24%_24%_49%] gap-3">
                                                <div className="flex flex-col">
                                                    <div className="text-lg">
                                                        ФТМ 1Q25
                                                    </div>
                                                    <span className="text-sm">
                                                        01.01.25 - 31.03.25
                                                    </span>
                                                </div>
                                                <div className="bg-gray-200 py-1 px-2 text-center rounded-md">
                                                    завершён
                                                </div>
                                                <div className="flex gap-3 items-center">
                                                    <div className="flex flex-col flex-grow">
                                                        <div className="text-lg">
                                                            180 дней
                                                        </div>
                                                        <span className="text-sm">
                                                            01.04.25 - 20.05.25
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="flex-none w-[15px] h-[20px] border border-gray-400"
                                                    ></button>
                                                    <button
                                                        type="button"
                                                        className="flex-none w-[20px] h-[20px] border border-gray-400 rounded-[50%]"
                                                    ></button>
                                                </div>
                                            </li>
                                            <li className="grid items-center grid-cols-[24%_24%_49%] gap-3">
                                                <div className="flex flex-col">
                                                    <div className="text-lg">
                                                        ФТМ 1Q25
                                                    </div>
                                                    <span className="text-sm">
                                                        01.01.25 - 31.03.25
                                                    </span>
                                                </div>
                                                <div className="bg-gray-200 py-1 px-2 text-center rounded-md">
                                                    завершён
                                                </div>
                                                <div className="flex gap-3 items-center">
                                                    <div className="flex flex-col flex-grow">
                                                        <div className="text-lg">
                                                            180 дней
                                                        </div>
                                                        <span className="text-sm">
                                                            01.04.25 - 20.05.25
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="flex-none w-[15px] h-[20px] border border-gray-400"
                                                    ></button>
                                                    <button
                                                        type="button"
                                                        className="flex-none w-[20px] h-[20px] border border-gray-400 rounded-[50%]"
                                                    ></button>
                                                </div>
                                            </li>
                                        </ul>
                                    ) : (
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
                                                            dateRanges.picker1
                                                                .start
                                                        }
                                                        startDate={
                                                            dateRanges.picker1
                                                                .start
                                                        }
                                                        endDate={
                                                            dateRanges.picker1
                                                                .end
                                                        }
                                                        onChange={handleChangeDateRange(
                                                            "picker1"
                                                        )}
                                                        excludeDates={[
                                                            new Date(
                                                                "2024-05-01"
                                                            ),
                                                            new Date(
                                                                "2024-02-01"
                                                            ),
                                                            new Date(
                                                                "2024-01-01"
                                                            ),
                                                            new Date(
                                                                "2024-11-01"
                                                            ),
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
                                                        Бюджет проекта, млрд
                                                        руб.
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
                                                            dateRanges.picker2
                                                                .start
                                                        }
                                                        startDate={
                                                            dateRanges.picker2
                                                                .start
                                                        }
                                                        endDate={
                                                            dateRanges.picker2
                                                                .end
                                                        }
                                                        onChange={handleChangeDateRange(
                                                            "picker2"
                                                        )}
                                                        excludeDates={[
                                                            new Date(
                                                                "2024-05-01"
                                                            ),
                                                            new Date(
                                                                "2024-02-01"
                                                            ),
                                                            new Date(
                                                                "2024-01-01"
                                                            ),
                                                            new Date(
                                                                "2024-11-01"
                                                            ),
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
                                                            dateRanges.picker3
                                                                .start
                                                        }
                                                        startDate={
                                                            dateRanges.picker3
                                                                .start
                                                        }
                                                        endDate={
                                                            dateRanges.picker3
                                                                .end
                                                        }
                                                        onChange={handleChangeDateRange(
                                                            "picker3"
                                                        )}
                                                        excludeDates={[
                                                            new Date(
                                                                "2024-05-01"
                                                            ),
                                                            new Date(
                                                                "2024-02-01"
                                                            ),
                                                            new Date(
                                                                "2024-01-01"
                                                            ),
                                                            new Date(
                                                                "2024-11-01"
                                                            ),
                                                        ]}
                                                        dateFormat="dd.MM.yyyy"
                                                        placeholderText=""
                                                        selectsRange
                                                    />
                                                </div>
                                            </div>

                                            <div
                                                className={`grid gap-3 ${
                                                    agreementStatus ==
                                                    "завершён"
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
                                                            value={
                                                                agreementStatus
                                                            }
                                                            onChange={(evt) =>
                                                                setAgreementStatus(
                                                                    evt.target
                                                                        .value
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

                                                {agreementStatus ==
                                                    "завершён" && (
                                                    <div className="flex flex-col gap-2 justify-between">
                                                        <span className="text-gray-400">
                                                            Добавить отчет
                                                        </span>

                                                        <div className="grid gap-3 grid-cols-2">
                                                            <div className="radio-field">
                                                                <input
                                                                    type="radio"
                                                                    name="add_report"
                                                                    id="addReportYes"
                                                                />
                                                                <label htmlFor="addReportYes">
                                                                    Да
                                                                </label>
                                                            </div>
                                                            <div className="radio-field">
                                                                <input
                                                                    type="radio"
                                                                    name="add_report"
                                                                    id="addReportNo"
                                                                />
                                                                <label htmlFor="addReportNo">
                                                                    Нет
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid gap-3 grid-cols-1">
                                                <div className="flex flex-col gap-2 justify-between">
                                                    <span className="text-gray-400 flex items-center gap-2">
                                                        Команда проекта
                                                        <button
                                                            type="button"
                                                            className="add-button"
                                                            onClick={() =>
                                                                addBlock(
                                                                    "teammate"
                                                                )
                                                            }
                                                        >
                                                            <span></span>
                                                        </button>
                                                    </span>
                                                </div>
                                            </div>

                                            {teammates.length > 0 &&
                                                teammates.map((id) => (
                                                    <div
                                                        className="grid gap-3 grid-cols-2"
                                                        key={id}
                                                    >
                                                        <div className="flex flex-col gap-2 justify-between">
                                                            <div className="border-2 border-gray-300 p-1">
                                                                <select className="w-full">
                                                                    <option value="Прохоров Сергей Викторович">
                                                                        Прохоров
                                                                        Сергей
                                                                        Викторович
                                                                    </option>
                                                                    <option value="Прохоров Сергей Викторович">
                                                                        Прохоров
                                                                        Сергей
                                                                        Викторович
                                                                    </option>
                                                                    <option value="Прохоров Сергей Викторович">
                                                                        Прохоров
                                                                        Сергей
                                                                        Викторович
                                                                    </option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-2 justify-between">
                                                            <div className="border-2 border-gray-300 p-1">
                                                                <select className="w-full">
                                                                    <option value="Руководитель проекта">
                                                                        Руководитель
                                                                        проекта
                                                                    </option>
                                                                    <option value="Руководитель проекта">
                                                                        Руководитель
                                                                        проекта
                                                                    </option>
                                                                    <option value="Руководитель проекта">
                                                                        Руководитель
                                                                        проекта
                                                                    </option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                            <div className="grid gap-3 grid-cols-1">
                                                <div className="flex flex-col gap-2 justify-between">
                                                    <span className="text-gray-400 flex items-center gap-2">
                                                        Подрядчики
                                                        <button
                                                            type="button"
                                                            className="add-button"
                                                            onClick={() =>
                                                                addBlock(
                                                                    "contractor"
                                                                )
                                                            }
                                                        >
                                                            <span></span>
                                                        </button>
                                                    </span>
                                                </div>
                                            </div>

                                            {contractors.length > 0 &&
                                                contractors.map((id) => (
                                                    <div
                                                        className="flex flex-col gap-1"
                                                        key={id}
                                                    >
                                                        <div className="grid gap-3 grid-cols-2">
                                                            <div className="flex flex-col gap-2 justify-between">
                                                                <div className="border-2 border-gray-300 p-1">
                                                                    <select className="w-full">
                                                                        <option value="ООО 'ИЭС'">
                                                                            ООО
                                                                            'ИЭС'
                                                                        </option>
                                                                        <option value="ООО 'ИЭС'">
                                                                            ООО
                                                                            'ИЭС'
                                                                        </option>
                                                                        <option value="ООО 'ИЭС'">
                                                                            ООО
                                                                            'ИЭС'
                                                                        </option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col gap-2 justify-between">
                                                                <div className="border-2 border-gray-300 p-1">
                                                                    <select className="w-full">
                                                                        <option value="Технология">
                                                                            Технология
                                                                        </option>
                                                                        <option value="Технология">
                                                                            Технология
                                                                        </option>
                                                                        <option value="Технология">
                                                                            Технология
                                                                        </option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="grid gap-3 grid-cols-1">
                                                            <div className="flex flex-col gap-2 justify-between">
                                                                <span className="text-gray-400"></span>
                                                                <div className="border-2 border-gray-300 p-1">
                                                                    <select className="w-full">
                                                                        <option value="Договор 45222 от 12.01.2025">
                                                                            Договор
                                                                            45222
                                                                            от
                                                                            12.01.2025
                                                                        </option>
                                                                        <option value="Договор 45222 от 12.01.2025">
                                                                            Договор
                                                                            45222
                                                                            от
                                                                            13.01.2025
                                                                        </option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                            <div className="mt-5 flex items-center gap-6 justify-between">
                                                <button
                                                    type="button"
                                                    className="rounded-lg py-3 px-5 bg-black text-white flex-[1_1_50%]"
                                                    // onClick={}
                                                >
                                                    Сохранить
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setReportWindowsState(
                                                            false
                                                        )
                                                    }
                                                    className="border rounded-lg py-3 px-5 flex-[1_1_50%]"
                                                >
                                                    Отменить
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
export default ProjectCard;
