import { useEffect, useState, useMemo } from "react";
import getData from "../../utils/getData";
import EmployeeItem from "./EmployeeItem";

const Employees = () => {
    const [list, setList] = useState([]);
    const [selectedType, setSelectedType] = useState("default");
    const [selectedStatus, setSelectedStatus] = useState("default");

    const COLUMNS = [
        { label: "ФИО", key: "name" },
        { label: "Кол-во проектов", key: "active_projects_count" },
        { label: "Квалификация", key: "qualification" },
        { label: "Телефон", key: "phone_number" },
        { label: "email", key: "email" },
        { label: "Тип", key: "is_staff" },
        { label: "Статус", key: "is_active" },
    ];

    const filteredEmployees = useMemo(() => {
        const result = list.filter((employee) => {
            return (
                (selectedType !== "default"
                    ? employee.is_staff === (selectedType === "true")
                    : true) &&
                (selectedStatus !== "default"
                    ? employee.is_active === (selectedStatus === "true")
                    : true)
            );
        });

        return result;
    }, [list, selectedType, selectedStatus]);

    useEffect(() => {
        getData(`${import.meta.env.VITE_API_URL}physical-persons`).then(
            (response) => {
                if (response.status == 200) {
                    setList(response.data);
                }
            }
        );
        // .finally(() => setIsLoading(false));
    }, []);

    return (
        <main className="page">
            <div className="container py-8">
                <div className="flex justify-between items-center gap-6 mb-8">
                    <h1 className="text-3xl font-medium">
                        Реестр сотрудников{" "}
                        {filteredEmployees.length > 0 &&
                            `(${filteredEmployees.length})`}
                    </h1>

                    <div className="flex items-center gap-6">
                        <>
                            <select
                                className={
                                    "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                }
                                onChange={(evt) => {
                                    setSelectedType(evt.target.value);
                                }}
                            >
                                <option value="default">Тип</option>
                                <option value="true">штатный</option>
                                <option value="false">внештатный</option>
                            </select>

                            <select
                                className={
                                    "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                }
                                onChange={(evt) => {
                                    setSelectedStatus(evt.target.value);
                                }}
                            >
                                <option value="default">Статус</option>
                                <option value="true">работает</option>
                                <option value="false">не работает</option>
                            </select>
                        </>
                    </div>
                </div>

                <div className="overflow-x-auto w-full">
                    <table className="table-auto w-full border-collapse border-b border-gray-300 text-sm">
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
                            {filteredEmployees.length > 0 &&
                                filteredEmployees.map((item) => (
                                    <EmployeeItem
                                        key={item.id}
                                        data={item}
                                        columns={COLUMNS}
                                    />
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default Employees;
