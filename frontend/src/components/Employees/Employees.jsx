import { useEffect, useState } from "react";
import getData from "../../utils/getData";
import EmployeeItem from "./EmployeeItem";

const Employees = () => {
    const [employees, setEmployees] = useState([]);

    const COLUMNS = [{ label: "Наименование", key: "employee_full_name" }];

    useEffect(() => {
        getData("/data/employees.json", { Accept: "application/json" }).then(
            (response) => setEmployees(response.data)
        );
        // .finally(() => setIsLoading(false));
    }, []);

    return (
        <main className="page">
            <div className="container py-8">
                <div className="flex justify-between items-center gap-6 mb-8">
                    <h1 className="text-3xl font-medium">
                        Реестр сотрудников{" "}
                        {employees.length > 0 && `(${employees.length})`}
                    </h1>
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
                            {employees.length > 0 &&
                                employees.map((item) => (
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
