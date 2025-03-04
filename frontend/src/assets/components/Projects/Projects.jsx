import { useEffect, useState } from "react";
import postData from "../../utils/postData";
import ProjectItem from "./ProjectItem";
import Popup from "../Popup/Popup";
import { useNavigate } from "react-router-dom";

const Projects = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [popupState, setPopupState] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");

    const handleInputChange = (e) => {
        setNewProjectName(e.target.value);

        // if (e.target.value.trim().length >= 3) {
        //     setIsDisabled(false);
        // } else {
        //     setIsDisabled(true);
        // }
    };

    const openPopup = () => {
        setPopupState(true);
    };

    const closePopup = (evt) => {
        console.log(evt);

        if (evt.currentTarget.classList.contains("popup")) setPopupState(false);
    };

    const openNewProjectPage = () => {
        navigate(`/projects/new`, { state: { projectName: newProjectName } });
    };

    useEffect(() => {
        postData("POST", "../../../src/data/projects.json", {}).then(
            (response) => setProjects(response)
        );
        // .finally(() => setIsLoading(false));
    }, []);

    return (
        <main className="page">
            <div className="container py-8">
                <div className="flex justify-between items-center gap-6">
                    <h1 className="text-4xl mb-8">
                        Список проектов{" "}
                        {projects.length > 0 && `(${projects.length})`}
                    </h1>

                    <div className="flex items-center gap-6">
                        <select className="bg-gray-200 min-w-[120px]" name="">
                            <option value="Отрасль 1">Отрасль 1</option>
                            <option value="Отрасль 2">Отрасль 2</option>
                            <option value="Отрасль 3">Отрасль 3</option>
                        </select>

                        <select className="bg-gray-200 min-w-[120px]" name="">
                            <option value="Банк 1">Банк 1</option>
                            <option value="Банк 2">Банк 2</option>
                            <option value="Банк 3">Банк 3</option>
                        </select>

                        <select className="bg-gray-200 min-w-[200px]" name="">
                            <option value="Руководитель проекта 1">
                                Руководитель проекта 1
                            </option>
                            <option value="Руководитель проекта 2">
                                Руководитель проекта 2
                            </option>
                            <option value="Руководитель проекта 3">
                                Руководитель проекта 3
                            </option>
                        </select>

                        <button
                            type="button"
                            className="p-1 px-4 text-gray-900 rounded-lg bg-gray-100 group text-lg"
                            onClick={openPopup}
                        >
                            Создать проект
                        </button>
                    </div>
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
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </div>
                            <div className="action-form__footer mt-5 flex items-center gap-6 justify-between ">
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

                <div className="overflow-x-auto w-full">
                    <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg text-sm">
                        <thead className="bg-gray-200 text-gray-700">
                            <tr className="bg-gray-100">
                                <th
                                    className="border border-gray-300 px-4 py-2 align-middle"
                                    rowSpan="2"
                                >
                                    ID
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2 align-middle"
                                    rowSpan="2"
                                >
                                    Time code
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2 align-middle"
                                    rowSpan="2"
                                >
                                    Название
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2 align-middle"
                                    rowSpan="2"
                                >
                                    Тип
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2 align-middle"
                                    rowSpan="2"
                                >
                                    Статус
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2 align-middle"
                                    rowSpan="2"
                                >
                                    Оплаты
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2"
                                    rowSpan="2"
                                >
                                    Дебиторская задолженность
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2 align-middle"
                                    rowSpan="2"
                                >
                                    Сфера
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2 align-middle"
                                    rowSpan="2"
                                >
                                    Услуги
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2 align-middle"
                                    rowSpan="2"
                                >
                                    Заказчик
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2"
                                    colSpan="2"
                                >
                                    Кредитные управляющие
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2"
                                    colSpan="2"
                                >
                                    Период реализации, план
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2"
                                    colSpan="5"
                                >
                                    Рабочая группа
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2 align-middle"
                                    rowSpan="2"
                                >
                                    Наименование субподрядчика
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2 align-middle"
                                    rowSpan="2"
                                >
                                    Роль
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2 align-middle"
                                    rowSpan="2"
                                >
                                    Стоимость услуг
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2"
                                    colSpan="2"
                                >
                                    Период реализации, план
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2 align-middle"
                                    rowSpan="2"
                                >
                                    Комментарий
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2"
                                    colSpan="5"
                                >
                                    Рабочая группа
                                </th>
                            </tr>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2">
                                    Название банка
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    ФИО менеджера
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    Начало
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    Конец
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    ФИО сотрудника
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    ФОТ
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    Роль
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    % вовлечения, план
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    Затрачиваемое время, план
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    Начало
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    Конец
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    ФИО сотрудника
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    Роль
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    % вовлечения, план
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    Затрачиваемое время, план
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    Баллы
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {projects.length > 0 &&
                                projects.map((item) => (
                                    <ProjectItem key={item.id} {...item} />
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default Projects;
