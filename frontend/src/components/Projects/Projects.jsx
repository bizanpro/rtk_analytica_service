import { useEffect, useState, useMemo } from "react";
import getData from "../../utils/getData";
import ProjectItem from "./ProjectItem";
import Popup from "../Popup/Popup";
import Select from "../Select";
import { useNavigate } from "react-router-dom";

const Projects = () => {
    const URL = import.meta.env.DEV
        ? "/data/projects.json"
        : import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [popupState, setPopupState] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");
    const [selectedSector, setSelectedSector] = useState("");
    const [selectedBank, setSelectedBank] = useState("");
    const [selectedManager, setSelectedManager] = useState("");

    const filteredProjects = useMemo(() => {
        const result = projects.filter((project) => {
            return (
                (selectedSector && selectedSector !== "default"
                    ? project.sector === selectedSector
                    : true) &&
                (selectedBank && selectedBank !== "default"
                    ? Array.isArray(project.credit_manager_bank_name)
                        ? project.credit_manager_bank_name.includes(
                              selectedBank
                          )
                        : project.credit_manager_bank_name === selectedBank
                    : true) &&
                (selectedManager && selectedManager !== "default"
                    ? project.project_manager === selectedManager
                    : true)
            );
        });
        return result;
    }, [projects, selectedSector, selectedBank, selectedManager]);

    const sectorOptions = useMemo(() => {
        const allSectors = projects.flatMap((item) => item.sector);
        return Array.from(new Set(allSectors));
    }, [projects]);

    const bankOptions = useMemo(() => {
        const allSectors = projects.flatMap(
            (item) => item.credit_manager_bank_name
        );
        return Array.from(new Set(allSectors));
    }, [projects]);

    const projectManagerOptions = useMemo(() => {
        const allPM = projects.flatMap((item) => item.project_manager);
        return Array.from(new Set(allPM));
    }, [projects]);

    const handleProjectsNameChange = (e) => {
        setNewProjectName(e.target.value);
    };

    const openPopup = () => {
        setPopupState(true);
    };

    const closePopup = (evt) => {
        if (evt.currentTarget.classList.contains("popup")) setPopupState(false);
    };

    const openNewProjectPage = () => {
        // const valid = projects.filter((project) => {
        //     return (
        //         project.name.trim().toLowerCase() ===
        //         newProjectName.trim().toLowerCase()
        //     );
        // });

        navigate(`/projects/new`, { state: { projectName: newProjectName } });
    };

    useEffect(() => {
        getData(URL, { Accept: "application/json" }).then((response) => {
            console.log(response);

            setProjects(response.data);
        });
        // .finally(() => setIsLoading(false));
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
                        <Select
                            className={
                                "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                            }
                            title={"Отрасль"}
                            items={sectorOptions}
                            onChange={(evt) => {
                                setSelectedSector(evt.target.value);
                            }}
                        />

                        <Select
                            className={
                                "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                            }
                            title={"Банк"}
                            items={bankOptions}
                            onChange={(evt) =>
                                setSelectedBank(evt.target.value)
                            }
                        />

                        <Select
                            className={
                                "p-1 border border-gray-300 min-w-[200px] cursor-pointer"
                            }
                            title={"Руководитель проекта"}
                            items={projectManagerOptions}
                            onChange={(evt) =>
                                setSelectedManager(evt.target.value)
                            }
                        />

                        <button
                            type="button"
                            className="p-1 px-4 text-gray-900 rounded-lg bg-gray-100 group text-lg"
                            onClick={openPopup}
                        >
                            Создать проект
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto w-full pb-5">
                    <table className="table-auto w-full border-collapse border-b border-gray-300 text-sm">
                        <thead className="text-gray-400 text-left">
                            <tr>
                                <th
                                    className="border-b border-gray-300 text-base px-4 py-2 min-w-[180px] max-w-[200px]"
                                    rowSpan="2"
                                >
                                    Проект
                                </th>
                                <th
                                    className="border-b border-gray-300 text-base px-4 py-2 min-w-[180px] max-w-[200px]"
                                    rowSpan="2"
                                >
                                    Заказчик
                                </th>
                                <th
                                    className="border-b border-gray-300 text-base px-4 py-2 min-w-[180px] max-w-[200px]"
                                    rowSpan="2"
                                >
                                    Банк
                                </th>
                                <th
                                    className="border-b border-gray-300 text-base px-4 py-2 min-w-[180px] max-w-[200px]"
                                    rowSpan="2"
                                >
                                    Бюджет
                                </th>
                                <th
                                    className="border-b border-gray-300 text-base px-4 py-2 min-w-[180px] max-w-[200px]"
                                    rowSpan="2"
                                >
                                    Срок
                                </th>
                                <th
                                    className="border-b border-gray-300 text-base px-4 py-2 min-w-[180px] max-w-[200px]"
                                    rowSpan="2"
                                >
                                    Руководитель проекта
                                </th>
                                <th
                                    className="border-b border-gray-300 text-base px-4 py-2 min-w-[180px] max-w-[200px]"
                                    rowSpan="2"
                                >
                                    Статус
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProjects.length > 0 &&
                                filteredProjects.map((item) => (
                                    <ProjectItem key={item.id} {...item} />
                                ))}
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
                                    onClick={openNewProjectPage}
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
