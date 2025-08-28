import { useEffect, useState, useMemo } from "react";

import getData from "../../utils/getData";

import EmployeeItem from "./EmployeeItem";
import CreatableSelect from "react-select/creatable";

const Employees = () => {
    const [list, setList] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedType, setSelectedType] = useState("default");
    const [selectedStatus, setSelectedStatus] = useState("default");
    const [selectedName, setSelectedName] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const COLUMNS = [
        { label: "ФИО", key: "name" },
        { label: "Загрузка", key: "reports_count" },
        { label: "Должность", key: "position" },
        { label: "Телефон", key: "phone_number" },
        { label: "Email", key: "email" },
        { label: "Подразделение", key: "department_name" },
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
                    ? employee.status === (selectedStatus === "true")
                    : true) &&
                (selectedName !== null
                    ? employee.name === selectedName
                    : true) &&
                (selectedDepartment !== null
                    ? employee.department_id === selectedDepartment
                    : true)
            );
        });

        return result;
    }, [list, selectedType, selectedStatus, selectedName, selectedDepartment]);

    // Заполняем селектор сотрудников
    const nameOptions = useMemo(() => {
        const allNames = list.map((item) => ({
            value: item.id,
            label: item.name,
        }));

        return Array.from(new Set(allNames));
    }, [list]);

    // Получени списка сотрудников
    const getList = () => {
        setIsLoading(true);
        getData(`${import.meta.env.VITE_API_URL}physical-persons`)
            .then((response) => {
                if (response.status == 200) {
                    setList(response.data);
                }
            })
            .finally(() => setIsLoading(false));
    };

    // Получение списка подразделений
    const getDepartments = () => {
        getData(`${import.meta.env.VITE_API_URL}departments`).then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.data.length > 0) {
                        setDepartments(
                            response.data.data.filter(
                                (item) => item.employee_count > 0
                            )
                        );
                    }
                }
            }
        );
    };

    useEffect(() => {
        getDepartments();
        getList();
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
                        {nameOptions.length > 0 && (
                            <CreatableSelect
                                isClearable
                                options={nameOptions}
                                className="p-1 border border-gray-300 min-w-[250px] max-w-[300px] executor-block__name-field"
                                placeholder="Сотрудник"
                                noOptionsMessage={() => "Совпадений нет"}
                                isValidNewOption={() => false}
                                onChange={(selectedOption) => {
                                    if (selectedOption) {
                                        setSelectedName(selectedOption.label);
                                    } else {
                                        setSelectedName(null);
                                    }
                                }}
                            />
                        )}

                        {departments.length > 0 && (
                            <CreatableSelect
                                isClearable
                                options={departments.map((item) => ({
                                    value: item.id,
                                    label: item.name,
                                }))}
                                className="p-1 border border-gray-300 min-w-[250px] max-w-[300px] executor-block__name-field"
                                placeholder="Подразделение"
                                noOptionsMessage={() => "Совпадений нет"}
                                isValidNewOption={() => false}
                                onChange={(selectedOption) => {
                                    if (selectedOption) {
                                        setSelectedDepartment(
                                            selectedOption.value
                                        );
                                    } else {
                                        setSelectedDepartment(null);
                                    }
                                }}
                            />
                        )}

                        <select
                            className={
                                "p-1 border border-gray-300 min-w-[120px] max-w-[200px] h-[48px]"
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
                                "p-1 border border-gray-300 min-w-[120px] max-w-[200px] h-[48px]"
                            }
                            onChange={(evt) => {
                                setSelectedStatus(evt.target.value);
                            }}
                        >
                            <option value="default">Статус</option>
                            <option value="true">работает</option>
                            <option value="false">не работает</option>
                        </select>
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

                    {isLoading && <div className="mt-4">Загрузка...</div>}
                </div>
            </div>
        </main>
    );
};

export default Employees;
