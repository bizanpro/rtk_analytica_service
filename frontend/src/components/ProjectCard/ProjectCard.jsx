import { useState, useCallback, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";

import ExecutorBlock from "../ExecutorBlock/ExecutorBlock";
import EmptyExecutorBlock from "../ExecutorBlock/EmptyExecutorBlock";
import DatePicker from "react-datepicker";

import "./ProjectCard.scss";
import "react-datepicker/dist/react-datepicker.css";

const ProjectCard = () => {
    const URL = `${import.meta.env.VITE_API_URL}projects`;
    const location = useLocation();
    const { projectId } = useParams();

    const [projectData, setProjectData] = useState({});
    const [formFields, setFormFields] = useState({});

    const [mode, setMode] = useState(location.state?.mode);
    const [keyPersons, setKeyPersons] = useState([]);
    const [teammates, setTeammates] = useState([]);
    const [contractors, setContractors] = useState([]);
    const [industries, setIndustries] = useState([]);
    const [contragents, setContragents] = useState([]);
    const [banks, setBanks] = useState([]);
    const [addLender, setAddLender] = useState(false);
    const [addCustomer, setAddCustomer] = useState(false);
    const [newLender, setNewLender] = useState({});
    const [newCustomer, setNewCustomer] = useState({});

    const defaultRanges = {
        picker1: { start: new Date("2024-08-01"), end: new Date("2024-10-01") },
        picker2: { start: new Date("2024-06-01"), end: new Date("2024-07-01") },
        picker3: { start: new Date("2024-06-01"), end: new Date("2024-07-01") },
    };

    const [dateRanges, setDateRanges] = useState(defaultRanges);
    const [agreementStatus, setAgreementStatus] = useState("запланирован");
    const [reportWindowsState, setReportWindowsState] = useState(false);

    const handleChangeDateRange =
        (id) =>
        ([newStartDate, newEndDate]) => {
            setDateRanges((prev) => ({
                ...prev,
                [id]: { start: newStartDate, end: newEndDate },
            }));
        };

    const handleInputChange = (e, name) => {
        setFormFields({ ...formFields, [name]: e.target.value });
        setProjectData({ ...projectData, [name]: e.target.value });
    };

    // Обработчик ввода данных для заказчика и кредитора
    const handleNewExecutor = (type, e, name) => {
        if (type === "lender") {
            setNewLender({
                ...newLender,
                [name]: name === "phone" ? e : e.target.value,
            });
        } else if (type === "customer") {
            setNewCustomer({
                ...newCustomer,
                [name]: name === "phone" ? e : e.target.value,
            });
        }
    };

    // Обработчик назначения банков
    const handleBankChange = (e, index) => {
        const selectedId = e.target.value;

        setFormFields((prev) => {
            const updatedBanks = prev.bank_ids ? [...prev.bank_ids] : [];

            if (selectedId === "") {
                updatedBanks.splice(index, 1);
            } else {
                updatedBanks[index] = selectedId;
            }

            const uniqueBanks = updatedBanks.filter((id) => id !== "");
            const newState = { ...prev, bank_ids: uniqueBanks };

            return newState;
        });

        setProjectData((prev) => {
            const updatedBanks = prev.banks ? [...prev.banks] : [];

            if (selectedId === "") {
                updatedBanks.splice(index, 1);
            } else {
                const selectedBank = banks.find(
                    (bank) => bank.id == selectedId
                );
                if (selectedBank) {
                    updatedBanks[index] = {
                        id: selectedBank.id,
                        name: selectedBank.name,
                    };
                }
            }

            const uniqueBanks = updatedBanks.filter((bank) => bank?.id);
            const newState = { ...prev, banks: uniqueBanks };
            return newState;
        });
    };

    // Добавление блока заказчика или кредитора
    const addBlock = (type) => {
        if (type === "teammate") {
            if (teammates.length < 1) {
                setTeammates([
                    ...teammates,
                    {
                        id: Date.now(),
                    },
                ]);
            }
        } else if (type === "contractor") {
            if (contractors.length < 1) {
                setContractors([
                    ...contractors,
                    {
                        id: Date.now(),
                    },
                ]);
            }
        }
    };

    // Удаление блока команды проекта или подрядчика
    const removeBlock = useCallback((id, data, method) => {
        method(data.filter((block) => block.id !== id));
    }, []);

    // Обработка состояния добавочного блока при изменении
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

    // Обновление статуса проекта в отчете
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

    // Получение проекта
    const getProject = (id) => {
        getData(`${URL}/${id}`, { Accept: "application/json" })
            .then((response) => {
                setProjectData(response.data.project);
            })
            .then(() => {
                // Получение отраслей
                getData(`${import.meta.env.VITE_API_URL}/industries`, {
                    Accept: "application/json",
                }).then((response) => {
                    setIndustries(response.data.data);
                });

                // Получение заказчика
                getData(`${import.meta.env.VITE_API_URL}/contragents`, {
                    Accept: "application/json",
                }).then((response) => {
                    setContragents(response.data);
                });

                // Получение банков
                getData(`${import.meta.env.VITE_API_URL}/banks`).then(
                    (response) => {
                        setBanks(response.data.data);
                    }
                );
            });
    };

    const sendExecutor = (type) => {
        console.log(type);

        if (type === "lender") {
            const contactId = projectData.banks.find(
                (bank) => bank.pivot.bank_id == newLender.bank_id
            ).pivot.contact_id;

            setNewLender((prevState) => {
                const updatedLender = { ...prevState, contact_id: contactId };

                // Формируем данные для запроса
                const data = { contact_persons: [updatedLender] };

                // Отправляем запрос после обновления состояния
                postData("PATCH", `${URL}/${projectId}`, data).then(
                    (response) => {
                        if (response) {
                            console.log(response);
                        }
                    }
                );

                // Возвращаем обновленное состояние
                return updatedLender;
            });
        }
    };

    // Обновление проекта
    const updateProject = (id) => {
        postData("PATCH", `${URL}/${id}`, formFields).then((response) => {
            if (response) {
                alert("Проект успешно обновлен");
            }
        });
    };

    useEffect(() => {
        if (projectId) {
            getProject(projectId);
        }
    }, []);

    useEffect(() => {
        if (projectId && projectData?.customer_key_persons) {
            setKeyPersons(projectData.customer_key_persons);
        }
    }, [projectData, projectId]);

    useEffect(() => {
        if (projectData.banks) {
            setFormFields((prev) => ({
                ...prev,
                bank_ids: projectData.banks.map((bank) => bank.id),
            }));
        }
    }, [projectData.banks]);

    useEffect(() => {
        updateStatus();
    }, [dateRanges]);

    return (
        <main className="page">
            <div className="new-project pt-8 pb-15">
                <div className="container">
                    <div className="flex justify-between items-center gap-10">
                        <div className="flex items-center gap-3 flex-grow">
                            <input
                                type="text"
                                className="text-3xl font-medium w-full"
                                name="name"
                                value={projectData?.name}
                                onChange={(e) => handleInputChange(e, "name")}
                                disabled={mode == "read" ? true : false}
                            />

                            {mode === "edit" &&
                                projectData?.name?.length > 2 && (
                                    <button
                                        type="button"
                                        className="update-icon"
                                        onClick={() => updateProject(projectId)}
                                    ></button>
                                )}
                        </div>

                        <nav className="switch">
                            <div>
                                <input
                                    type="radio"
                                    name="mode"
                                    id="read_mode"
                                    onChange={() => {
                                        setMode("read");
                                        setAddLender(false);
                                        setAddCustomer(false);
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
                                        readOnly
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
                                        <select
                                            className="w-full h-[21px]"
                                            value={
                                                projectId
                                                    ? projectData?.contragent_id
                                                    : "Выбрать заказчика"
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    e,
                                                    "contragent_id"
                                                )
                                            }
                                            disabled={
                                                mode == "read" ? true : false
                                            }
                                        >
                                            {contragents.length > 0 &&
                                                contragents.map((item) => (
                                                    <option
                                                        value={item.id}
                                                        key={item.id}
                                                    >
                                                        {item.program_name}
                                                    </option>
                                                ))}
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
                                    {/* <ul className="grid gap-3">
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
                                    </ul> */}
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
                                        readOnly
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
                                        <select
                                            className="w-full h-[21px]"
                                            value={
                                                projectId
                                                    ? projectData?.industry?.id
                                                    : "Выбрать отрасль"
                                            }
                                            onChange={(e) => {
                                                setFormFields({
                                                    ...formFields,
                                                    industry_id: e.target.value,
                                                });
                                                setProjectData({
                                                    ...projectData,
                                                    industry: {
                                                        id: e.target.value,
                                                    },
                                                });
                                            }}
                                            disabled={
                                                mode == "read" ? true : false
                                            }
                                        >
                                            {industries.length > 0 &&
                                                industries.map((item) => (
                                                    <option
                                                        value={item.id}
                                                        key={item.id}
                                                    >
                                                        {item.name}
                                                    </option>
                                                ))}
                                        </select>
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
                                        name="description"
                                        disabled={mode == "read" ? true : false}
                                        value={
                                            projectId && projectData
                                                ? projectData?.description
                                                : ""
                                        }
                                        onChange={(e) =>
                                            handleInputChange(e, "description")
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
                                    {/* <div className="grid gap-8 mt-10">
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
                                    </div> */}
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
                                                onClick={() => {
                                                    if (!addCustomer) {
                                                        setAddCustomer(true);
                                                    }
                                                }}
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
                                                    // handleNewExecutor={
                                                    //     handleNewExecutor
                                                    // }
                                                    data={keyPersons}
                                                    method={setKeyPersons}
                                                />
                                            ))
                                        )}

                                        {addCustomer && (
                                            <EmptyExecutorBlock
                                                borderClass={"border-gray-300"}
                                                banks={banks}
                                                type={"customer"}
                                                method={setKeyPersons}
                                                removeBlock={() =>
                                                    setAddCustomer(false)
                                                }
                                                handleNewExecutor={
                                                    handleNewExecutor
                                                }
                                                sendExecutor={sendExecutor}
                                            />
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
                                                onClick={() => {
                                                    if (!addLender) {
                                                        setAddLender(true);
                                                    }
                                                }}
                                                title="Добавить Кредитора"
                                            >
                                                <span></span>
                                            </button>
                                        )}
                                    </div>

                                    <ul className="flex gap-3 flex-wrap">
                                        {(projectData.banks?.length > 0
                                            ? projectData.banks
                                            : [{}]
                                        ).map((item, index) => (
                                            <div key={index} className="mb-2">
                                                <select
                                                    className="flex-[0_0_30%] bg-gray-200 py-1 px-2 text-center rounded-md"
                                                    value={item.id || ""}
                                                    onChange={(e) =>
                                                        handleBankChange(
                                                            e,
                                                            index
                                                        )
                                                    }
                                                    disabled={mode === "read"}
                                                >
                                                    <option value="">
                                                        Банк
                                                    </option>
                                                    {banks
                                                        .filter(
                                                            (bank) =>
                                                                !projectData.banks.some(
                                                                    (
                                                                        selectedBank,
                                                                        idx
                                                                    ) =>
                                                                        selectedBank.id ===
                                                                            bank.id &&
                                                                        idx !==
                                                                            index
                                                                )
                                                        )
                                                        .map((bank) => (
                                                            <option
                                                                value={bank.id}
                                                                key={bank.id}
                                                            >
                                                                {bank.name}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                        ))}

                                        {projectData.banks &&
                                            projectData.banks.length > 0 &&
                                            projectData.banks.length <
                                                banks.length &&
                                            projectData.banks[
                                                projectData.banks.length - 1
                                            ].id !== "" && (
                                                <div className="mb-2">
                                                    <select
                                                        className={`flex-[0_0_30%] py-1 px-2 text-center rounded-md ${
                                                            mode === "read"
                                                                ? "border border-gray-300 border-dashed"
                                                                : "bg-gray-200"
                                                        }`}
                                                        onChange={(e) =>
                                                            handleBankChange(
                                                                e,
                                                                projectData
                                                                    .banks
                                                                    .length
                                                            )
                                                        }
                                                        disabled={
                                                            mode === "read"
                                                        }
                                                    >
                                                        <option value="">
                                                            Банк
                                                        </option>
                                                        {banks
                                                            .filter(
                                                                (bank) =>
                                                                    !projectData.banks.some(
                                                                        (
                                                                            selectedBank
                                                                        ) =>
                                                                            selectedBank.id ===
                                                                            bank.id
                                                                    )
                                                            )
                                                            .map((bank) => (
                                                                <option
                                                                    value={
                                                                        bank.id
                                                                    }
                                                                    key={
                                                                        bank.id
                                                                    }
                                                                >
                                                                    {bank.name}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                            )}
                                    </ul>

                                    <ul className="mt-3.5 grid gap-4">
                                        {projectData.banks?.managers?.length <
                                            1 && banks.length < 1 ? (
                                            <p>Нет данных</p>
                                        ) : (
                                            projectData.banks?.map(
                                                (bankItem) => {
                                                    return bankItem.managers?.map(
                                                        (item) => (
                                                            <ExecutorBlock
                                                                key={item.id}
                                                                person={item}
                                                                mode={mode}
                                                                banks={banks}
                                                                type={"lender"}
                                                                removeBlock={
                                                                    removeBlock
                                                                }
                                                                handleChange={
                                                                    handleChange
                                                                }
                                                                method={
                                                                    setKeyPersons
                                                                }
                                                            />
                                                        )
                                                    );
                                                }
                                            )
                                        )}

                                        {addLender && (
                                            <EmptyExecutorBlock
                                                borderClass={"border-gray-300"}
                                                banks={banks}
                                                type={"lender"}
                                                method={setKeyPersons}
                                                removeBlock={() =>
                                                    setAddLender(false)
                                                }
                                                handleNewExecutor={
                                                    handleNewExecutor
                                                }
                                                sendExecutor={sendExecutor}
                                            />
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
                                                readOnly
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
                                                readOnly
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
                                        <input
                                            type="text"
                                            value="Нет данных"
                                            readOnly
                                        />
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
                                            readOnly
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
                                                        <select
                                                            className="w-full"
                                                            disabled
                                                        >
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
                                                            readOnly
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
                                                        <select
                                                            className="w-full"
                                                            disabled
                                                        >
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
                                                            readOnly
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
                                                                    readOnly
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
                                                                    readOnly
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
                                                                <select
                                                                    className="w-full"
                                                                    disabled
                                                                >
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
                                                                <select
                                                                    className="w-full"
                                                                    disabled
                                                                >
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
                                                                    <select
                                                                        className="w-full"
                                                                        disabled
                                                                    >
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
                                                                    <select
                                                                        className="w-full"
                                                                        disabled
                                                                    >
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
                                                                    <select
                                                                        className="w-full"
                                                                        disabled
                                                                    >
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
