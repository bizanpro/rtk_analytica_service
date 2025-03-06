import { useEffect, useState } from "react";
import getData from "../../utils/getData";
import EmployeeItem from "./EmployeeItem";

const Employees = () => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        getData("/data/employees.json", { Accept: "application/json" }).then(
            (response) => setEmployees(response.data)
        );
        // .finally(() => setIsLoading(false));
    }, []);

    return (
        <main className="page">
            <div className="container py-8">
                <h1 className="text-4xl mb-8">Список сотрудников</h1>

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
                                    ФИО сотрудника
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2 align-middle"
                                    rowSpan="2"
                                >
                                    Телефон
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2 align-middle"
                                    rowSpan="2"
                                >
                                    Email
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2 align-middle"
                                    rowSpan="2"
                                >
                                    Должность
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2"
                                    colSpan="2"
                                >
                                    Кадровые мероприятия
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2"
                                    rowSpan="2"
                                >
                                    Оклад, руб./мес.
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2"
                                    rowSpan="5"
                                >
                                    Квалификация
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2 align-middle"
                                    colSpan="3"
                                >
                                    Ближайший отпуск
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2 align-middle"
                                    colSpan="5"
                                >
                                    Проекты и загрузка
                                </th>
                            </tr>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2">
                                    Мероприятие
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    Значение
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    1
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    2
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    3
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    ID
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    Название
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    Роль
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    % загрузки
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    Рабочее время
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.length > 0 &&
                                employees.map((item) => (
                                    <EmployeeItem key={item.id} {...item} />
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default Employees;
