import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getData from "../../utils/getData";

const EmployeeCard = () => {
    const { employeeId } = useParams();
    const [employeeData, setEmployeeData] = useState({});

    useEffect(() => {
        getData("/data/employees.json", { Accept: "application/json" }).then(
            (response) => {
                const data = response.data.find((item) => item.id == employeeId);
                setEmployeeData(data);
            }
        );
        // .finally(() => setIsLoading(false));
    }, []);

    return (
        <main className="page">
            <div className="container py-8">
                <div className="max-w-[1000px] mx-auto my-0">
                    <a
                        href="/employees"
                        className="flex items-center gap-3 mb-5 text-lg"
                    >
                        <span>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M15 20l-8-8 8-8"
                                    stroke="#000"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                        Назад
                    </a>

                    <h1 className="text-4xl mb-8">Карточка сотрудника</h1>

                    {employeeData && Object.keys(employeeData).length > 0 ? (
                        <div className="project-card__wrapper flex flex-col gap-10 text-lg">
                            <div className="flex justify-between items-center">
                                <div className="project-card__header flex gap-10">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-gray-400">
                                            ID проекта
                                        </span>
                                        <div>{employeeData.id}</div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <span className="text-gray-400">
                                            Time code
                                        </span>
                                        <div>{employeeData.time_code}</div>
                                    </div>
                                </div>

                                <div className="mr-[50px]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="80"
                                        height="80"
                                        viewBox="0 0 1280 1536"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M1280 1271q0 109-62.5 187t-150.5 78H213q-88 0-150.5-78T0 1271q0-85 8.5-160.5t31.5-152t58.5-131t94-89T327 704q131 128 313 128t313-128q76 0 134.5 34.5t94 89t58.5 131t31.5 152t8.5 160.5zm-256-887q0 159-112.5 271.5T640 768T368.5 655.5T256 384t112.5-271.5T640 0t271.5 112.5T1024 384z"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div className="project-card__body grid grid-cols-1 gap-5">
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray-400">ФИО</span>
                                    <input
                                        type="text"
                                        className="border-2 border-gray-300 p-5"
                                        value={employeeData.employee_full_name}
                                    />
                                </div>
                            </div>

                            <div className="project-card__body grid grid-cols-2 gap-5">
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray-400">
                                        Телефон
                                    </span>
                                    <input
                                        type="text"
                                        className="border-2 border-gray-300 p-5"
                                        value={employeeData.phone}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray-400">Email</span>
                                    <input
                                        type="text"
                                        className="border-2 border-gray-300 p-5"
                                        value={employeeData.email}
                                    />
                                </div>
                            </div>

                            <div className="project-card__body grid grid-cols-2 gap-5">
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray-400">
                                        Должность
                                    </span>
                                    <div className="border-2 border-gray-300 p-5">
                                        <select className="w-full">
                                            <option
                                                value={employeeData.position}
                                            >
                                                {employeeData.position}
                                            </option>
                                            <option
                                                value={employeeData.position}
                                            >
                                                {employeeData.position}
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span className="text-gray-400">
                                        Кадровые события
                                    </span>
                                    <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg text-sm">
                                        <thead>
                                            <tr className="bg-blue-300 text-white">
                                                <th className="border border-gray-300 px-4 py-2 align-middle">
                                                    Мероприятие
                                                </th>
                                                <th className="border border-gray-300 px-4 py-2 align-middle">
                                                    Значение
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-gray-300 hover:bg-gray-50 transition cursor-pointer">
                                                <td
                                                    className="border border-gray-300 px-4 py-2 min-w-[150px]"
                                                    style={{
                                                        verticalAlign:
                                                            "stretch",
                                                    }}
                                                >
                                                    {Array.isArray(
                                                        employeeData.hr_events
                                                    ) ? (
                                                        <table className="w-full">
                                                            <tbody>
                                                                {employeeData.hr_events.event.map(
                                                                    (
                                                                        item,
                                                                        index
                                                                    ) => (
                                                                        <tr
                                                                            className="border-b border-gray-300 transition"
                                                                            key={`${employeeData.hr_events.event.key}_${index}`}
                                                                        >
                                                                            <td>
                                                                                <select className="w-full p-2">
                                                                                    <option
                                                                                        value={item.toString()}
                                                                                    >
                                                                                        {item.toString()}
                                                                                    </option>
                                                                                    <option
                                                                                        value={item.toString()}
                                                                                    >
                                                                                        {item.toString()}
                                                                                    </option>
                                                                                </select>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        <select className="w-full p-2">
                                                            <option
                                                                value={employeeData.hr_events.event.toString()}
                                                            >
                                                                {employeeData.hr_events.event.toString()}
                                                            </option>
                                                            <option
                                                                value={employeeData.hr_events.event.toString()}
                                                            >
                                                                {employeeData.hr_events.event.toString()}
                                                            </option>
                                                        </select>
                                                    )}
                                                </td>

                                                <td
                                                    className="border border-gray-300 px-4 py-2 min-w-[150px]"
                                                    style={{
                                                        verticalAlign:
                                                            "stretch",
                                                    }}
                                                >
                                                    {Array.isArray(
                                                        employeeData.hr_events
                                                    ) ? (
                                                        <table className="w-full">
                                                            <tbody>
                                                                {employeeData.hr_events.value.map(
                                                                    (
                                                                        item,
                                                                        index
                                                                    ) => (
                                                                        <tr
                                                                            className="border-b border-gray-300 transition"
                                                                            key={`${employeeData.hr_events.value.key}_${index}`}
                                                                        >
                                                                            <td>
                                                                                <input
                                                                                    type="text"
                                                                                    className=""
                                                                                    value={
                                                                                        item
                                                                                    }
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            className=""
                                                            value={
                                                                employeeData
                                                                    .hr_events
                                                                    .value
                                                            }
                                                        />
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="project-card__body grid grid-cols-2 gap-5">
                                <div className="grid grid-cols-1 gap-5">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-gray-400">
                                            Оклад, руб./мес.
                                        </span>
                                        <input
                                            type="text"
                                            className="border-2 border-gray-300 p-5"
                                            value={
                                                employeeData.salary_rub_month
                                            }
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <span className="text-gray-400">
                                            Квалификация
                                        </span>
                                        <input
                                            type="text"
                                            className="border-2 border-gray-300 p-5"
                                            value={employeeData.qualification}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-gray-400">
                                            Ближайший отпуск
                                        </span>

                                        {Object.entries(
                                            employeeData.next_vacation
                                        ).map(([key, value]) => (
                                            <div
                                                className="flex items-center gap-5"
                                                key={`${value}_${key}`}
                                            >
                                                <p>{key}</p>

                                                <input
                                                    type="text"
                                                    className="border-2 border-gray-300 p-5 w-full"
                                                    value={value}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-gray-400">
                                    Кадровые события
                                </span>
                                <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg text-sm">
                                    <thead>
                                        <tr className="bg-blue-300 text-white">
                                            <th className="border border-gray-300 px-4 py-2 align-middle">
                                                ID
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2 align-middle">
                                                Название
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2 align-middle">
                                                Роль
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2 align-middle">
                                                % загрузки
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2 align-middle">
                                                Рабочее время
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-300 hover:bg-gray-50 transition cursor-pointer">
                                            <td
                                                className="border border-gray-300 px-4 py-2 min-w-[150px]"
                                                style={{
                                                    verticalAlign: "stretch",
                                                }}
                                            >
                                                <select className="w-full p-2">
                                                    <option
                                                        value={employeeData.projects_and_workload.project_id.toString()}
                                                    >
                                                        {employeeData.projects_and_workload.project_id.toString()}
                                                    </option>
                                                    <option
                                                        value={employeeData.projects_and_workload.project_id.toString()}
                                                    >
                                                        {employeeData.projects_and_workload.project_id.toString()}
                                                    </option>
                                                </select>
                                            </td>
                                            <td
                                                className="border border-gray-300 px-4 py-2 min-w-[150px]"
                                                style={{
                                                    verticalAlign: "stretch",
                                                }}
                                            >
                                                <input
                                                    type="text"
                                                    value={
                                                        employeeData
                                                            .projects_and_workload
                                                            .project_name
                                                    }
                                                />
                                            </td>
                                            <td
                                                className="border border-gray-300 px-4 py-2 min-w-[150px]"
                                                style={{
                                                    verticalAlign: "stretch",
                                                }}
                                            >
                                                <input
                                                    type="text"
                                                    value={
                                                        employeeData
                                                            .projects_and_workload
                                                            .role
                                                    }
                                                />
                                            </td>
                                            <td
                                                className="border border-gray-300 px-4 py-2 min-w-[150px]"
                                                style={{
                                                    verticalAlign: "stretch",
                                                }}
                                            >
                                                <input
                                                    type="text"
                                                    value={
                                                        employeeData
                                                            .projects_and_workload
                                                            .workload_percentage
                                                    }
                                                />
                                            </td>
                                            <td
                                                className="border border-gray-300 px-4 py-2 min-w-[150px]"
                                                style={{
                                                    verticalAlign: "stretch",
                                                }}
                                            >
                                                <input
                                                    type="text"
                                                    value={
                                                        employeeData
                                                            .projects_and_workload
                                                            .working_hours
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex items-center justify-center gap-14">
                                <button
                                    type="button"
                                    className="p-2 text-gray-400"
                                >
                                    Сбросить форму
                                </button>
                                <button
                                    type="button"
                                    className="p-2 border-[2px] rounded-lg border-gray-400"
                                >
                                    Сохранить и отправить
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p>Нет данных</p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default EmployeeCard;
