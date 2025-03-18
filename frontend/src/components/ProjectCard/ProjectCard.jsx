import { useState, useCallback, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";

import ExecutorBlock from "../ExecutorBlock/ExecutorBlock";
import EmptyExecutorBlock from "../ExecutorBlock/EmptyExecutorBlock";
import ProjectReportWindow from "./ProjectReportWindow";
import ProjectReportItem from "./ProjectReportItem";
import ProjectStatisticsBlock from "./ProjectStatisticsBlock";

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

    const [industries, setIndustries] = useState([]);
    const [contragents, setContragents] = useState([]);
    const [banks, setBanks] = useState([]);

    const [lenders, setLenders] = useState([]);

    const [addLender, setAddLender] = useState(false);
    const [addCustomer, setAddCustomer] = useState(false);

    const [newLender, setNewLender] = useState({});
    const [newCustomer, setNewCustomer] = useState({});

    const [reportWindowsState, setReportWindowsState] = useState(false);

    const handleInputChange = (e, name) => {
        setFormFields({ ...formFields, [name]: e.target.value });
        setProjectData({ ...projectData, [name]: e.target.value });
    };

    // Обработчик ввода данных блока заказчика и кредитора
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

    // Получение проекта
    const getProject = (id) => {
        getData(`${URL}/${id}`, { Accept: "application/json" })
            .then((response) => {
                setProjectData(response.data);

                // Получаем кредиторов
                setLenders(
                    response.data?.creditors?.flatMap(
                        (bank) => bank.contact_persons || []
                    ) || []
                );
            })
            .then(() => {
                // Получение отраслей
                getData(`${import.meta.env.VITE_API_URL}industries`, {
                    Accept: "application/json",
                }).then((response) => {
                    setIndustries(response.data.data);
                });

                // Получение заказчика
                getData(`${import.meta.env.VITE_API_URL}contragents`, {
                    Accept: "application/json",
                }).then((response) => {
                    setContragents(response.data);
                });

                // Получение банков
                getData(`${import.meta.env.VITE_API_URL}banks`).then(
                    (response) => {
                        setBanks(response.data.data);
                    }
                );
            });
    };

    // Добавление кредитора и заказчика
    const sendExecutor = (type) => {
        if (type === "lender") {
            const contactId = projectData.creditors.find(
                (bank) => bank.pivot.bank_id == newLender.bank_id
            ).pivot.contact_id;

            setNewLender((prevState) => {
                const updatedLender = { ...prevState, contact_id: contactId };
                const data = { contact_persons: [updatedLender] };

                postData("PATCH", `${URL}/${projectId}`, data).then(
                    (response) => {
                        if (response) {
                            console.log(response);
                        }
                    }
                );

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
        if (projectData.creditors) {
            setFormFields((prev) => ({
                ...prev,
                bank_ids: projectData.creditors.map((bank) => bank.id),
            }));
        }
    }, [projectData.creditors]);

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
                                                    ? projectData?.industry_id
                                                    : "Выбрать отрасль"
                                            }
                                            onChange={(e) => {
                                                setFormFields({
                                                    ...formFields,
                                                    industry_id: e.target.value,
                                                });
                                                setProjectData({
                                                    ...projectData,
                                                    industry_id: e.target.value,
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
                                        {(projectData.creditors?.length > 0
                                            ? projectData.creditors
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
                                                                !projectData.creditors.some(
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

                                        {projectData.creditors &&
                                            projectData.creditors.length > 0 &&
                                            projectData.creditors.length <
                                                banks.length &&
                                            projectData.creditors[
                                                projectData.creditors.length - 1
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
                                                                    .creditors
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
                                                                    !projectData.creditors.some(
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

                                        {lenders.length > 0 &&
                                        banks.length > 0 ? (
                                            lenders.map((lender) => (
                                                <ExecutorBlock
                                                    key={lender.id}
                                                    contanct={lender}
                                                    mode={mode}
                                                    banks={banks}
                                                    type={"lender"}
                                                    removeBlock={removeBlock}
                                                    handleChange={handleChange}
                                                    method={setKeyPersons}
                                                />
                                            ))
                                        ) : (
                                            <p>Нет данных</p>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <ProjectStatisticsBlock />

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

                                            <ProjectReportItem />
                                        </ul>
                                    ) : (
                                        <ProjectReportWindow
                                            ReportWindowsState={
                                                setReportWindowsState
                                            }
                                        />
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
