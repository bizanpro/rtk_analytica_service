import { useEffect, useState } from "react";
import postData from "../../utils/postData";
import ProjectItem from "./ProjectItem";

const Projects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        postData("POST", "../../../src/data/projects.json", {}).then(
            (response) => setProjects(response)
        );
        // .finally(() => setIsLoading(false));
    }, []);

    return (
        <main className="page">
            <div className="container py-8">
                <h1 className="text-4xl mb-8">Список проектов</h1>

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
