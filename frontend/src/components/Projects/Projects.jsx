import { useEffect, useState, useMemo } from "react";
import getData from "../../utils/getData";
import postData from "../../utils/postData";
import ProjectItem from "./ProjectItem";
import Popup from "../Popup/Popup";
import Select from "../Select";
import { useNavigate } from "react-router-dom";

const Projects = () => {
    const URL = `${import.meta.env.VITE_API_URL}projects`;
    const navigate = useNavigate();

    const [mode, setMode] = useState("read");
    const [list, setList] = useState([]);
    const [popupState, setPopupState] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");
    const [selectedSector, setSelectedSector] = useState("");
    const [selectedBank, setSelectedBank] = useState("");
    const [selectedManager, setSelectedManager] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const COLUMNS = [
        { label: "Проект", key: "name" },
        { label: "Заказчик", key: "contragent" },
        { label: "Банк", key: "creditors" },
        { label: "Бюджет (млрд руб.)", key: "project_budget" },
        { label: "Срок (мес.)", key: "implementation_period" },
        { label: "Руководитель проекта", key: "project_manager" },
        { label: "Статус", key: "status" },
    ];

    const filteredProjects = useMemo(() => {
        const result = list.filter((project) => {
            return (
                (selectedSector && selectedSector !== "default"
                    ? project.industry === selectedSector
                    : true) &&
                (selectedBank && selectedBank !== "default"
                    ? Array.isArray(project.creditors)
                        ? project.creditors?.some(
                              (bank) => bank.name === selectedBank
                          )
                        : false
                    : true) &&
                (selectedManager && selectedManager !== "default"
                    ? project.manager === selectedManager
                    : true)
            );
        });
        return result;
    }, [list, selectedSector, selectedBank, selectedManager]);

    // Заполняем селектор отраслей
    const sectorOptions = useMemo(() => {
        const allSectors = list
            .map((item) => item.industry)
            .filter((industry) => industry !== null);

        return Array.from(new Set(allSectors));
    }, [list]);

    // Заполняем селектор банков
    const bankOptions = useMemo(() => {
        const allBanks = list.flatMap((item) =>
            item.creditors?.map((bank) => bank.name)
        );
        return Array.from(new Set(allBanks));
    }, [list]);

    // Заполняем селектор руководителей
    const projectManagerOptions = useMemo(() => {
        const allPM = list
            .map((item) => item.manager)
            .filter((manager) => manager !== null);
        return Array.from(new Set(allPM));
    }, [list]);

    const handleProjectsNameChange = (e) => {
        setNewProjectName(e.target.value);
    };

    const openPopup = () => {
        setPopupState(true);
    };

    const closePopup = (evt) => {
        if (evt.currentTarget.classList.contains("popup")) setPopupState(false);
    };

    const getProjects = () => {
        setIsLoading(true);

        getData(URL, { Accept: "application/json" })
            .then((response) => {
                setList(response.data);
            })
            .finally(() => setIsLoading(false));
    };

    // Создание проекта
    const createProject = () => {
        postData("POST", URL, { name: newProjectName }).then((response) => {
            if (response.ok) {
                navigate(`/projects/${response.id}`, {
                    state: { mode: "edit" },
                });
            }
        });
    };

    const deleteProject = (projectId) => {
        postData("DELETE", `${URL}/${projectId}`, {}).then((response) => {
            if (response.ok) {
                getProjects();
            }
        });
    };

    useEffect(() => {
        getProjects();
    }, []);

    return (
        <main className="page">
            <div className="container py-8">
                <div className="flex justify-between items-center gap-6 mb-8">
                    <h1 className="text-3xl font-medium">
                        Реестр проектов{" "}
                        {filteredProjects.length > 0 &&
                            `(${filteredProjects.length})`}
                    </h1>

                    <div className="flex items-center gap-6">
                        {sectorOptions.length > 0 && (
                            <Select
                                className={
                                    "p-1 border border-gray-300 min-w-[120px] max-w-[200px]"
                                }
                                title={"Отрасль"}
                                items={sectorOptions}
                                onChange={(evt) => {
                                    setSelectedSector(evt.target.value);
                                }}
                            />
                        )}

                        {bankOptions.length > 0 && (
                            <Select
                                className={
                                    "p-1 border border-gray-300 min-w-[120px] max-w-[200px]"
                                }
                                title={"Банк"}
                                items={bankOptions}
                                onChange={(evt) =>
                                    setSelectedBank(evt.target.value)
                                }
                            />
                        )}

                        {projectManagerOptions.length > 0 && (
                            <Select
                                className={
                                    "p-1 border border-gray-300 min-w-[200px] max-w-[200px]"
                                }
                                title={"Руководитель проекта"}
                                items={projectManagerOptions}
                                onChange={(evt) =>
                                    setSelectedManager(evt.target.value)
                                }
                            />
                        )}

                        {mode === "edit" && (
                            <button
                                type="button"
                                className="p-1 px-4 text-gray-900 rounded-lg bg-gray-100 group text-lg"
                                onClick={openPopup}
                            >
                                Создать проект
                            </button>
                        )}

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
                </div>

                <div className="overflow-x-auto w-full pb-5">
                    <table className="table-auto w-full border-collapse border-gray-300 text-sm">
                        <thead className="text-gray-400 text-left">
                            <tr className="border-b border-gray-300">
                                {COLUMNS.map(({ label, key }) => (
                                    <th
                                        className="text-base px-4 py-2 min-w-[180px] max-w-[200px]"
                                        rowSpan="2"
                                        key={key}
                                    >
                                        {label}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td className="text-base px-4 py-2">
                                        Загрузка...
                                    </td>
                                </tr>
                            ) : (
                                filteredProjects.length > 0 &&
                                filteredProjects.map((item) => (
                                    <ProjectItem
                                        key={item.id}
                                        props={item}
                                        columns={COLUMNS}
                                        mode={mode}
                                        deleteProject={deleteProject}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {popupState && (
                    <Popup onClick={closePopup} title="Создание проекта">
                        <div className="min-w-[280px]">
                            <div className="action-form__body">
                                <label
                                    htmlFor="project_name"
                                    className="block mb-3"
                                >
                                    Введите наименование проекта
                                </label>
                                <input
                                    type="text"
                                    name="project_name"
                                    id="project_name"
                                    className="border-2 border-gray-300 p-3 w-full"
                                    value={newProjectName}
                                    onChange={(e) =>
                                        handleProjectsNameChange(e)
                                    }
                                />
                            </div>
                            <div className="action-form__footer mt-5 flex items-center gap-6 justify-between">
                                <button
                                    type="button"
                                    className="rounded-lg py-2 px-5 bg-black text-white flex-[1_1_50%]"
                                    onClick={createProject}
                                >
                                    Создать
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPopupState(false)}
                                    className="border rounded-lg py-2 px-5 flex-[1_1_50%]"
                                >
                                    Отменить
                                </button>
                            </div>
                        </div>
                    </Popup>
                )}
            </div>
        </main>
    );
};

export default Projects;
