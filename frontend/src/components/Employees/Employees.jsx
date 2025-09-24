import { useEffect, useState, useMemo } from "react";

import getData from "../../utils/getData";
import { sortList } from "../../utils/sortList";

import EmployeeItem from "./EmployeeItem";
import CreatableSelect from "react-select/creatable";
import TheadSortButton from "../TheadSortButton/TheadSortButton";

const Employees = () => {
    const [sortBy, setSortBy] = useState({ key: "", action: "" });

    const [list, setList] = useState([]);
    const [sortedList, setSortedList] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const [departments, setDepartments] = useState([]);

    const [selectedType, setSelectedType] = useState("default");
    const [selectedStatus, setSelectedStatus] = useState("default");
    const [selectedName, setSelectedName] = useState(null);
    const [selectedDepartments, setSelectedDepartments] = useState(null);

    const COLUMNS = [
        { label: "ФИО", key: "name" },
        { label: "Загрузка", key: "reports_count", is_sortable: true },
        { label: "Должность", key: "position" },
        { label: "Телефон", key: "phone_number" },
        { label: "Email", key: "email" },
        { label: "Подразделение", key: "department_name" },
        { label: "Тип", key: "is_staff" },
        { label: "Статус", key: "status" },
    ];

    const filteredEmployees = useMemo(() => {
        const result = sortedList.filter((employee) => {
            return (
                (selectedType !== "default"
                    ? employee.is_staff === (selectedType === "true")
                    : true) &&
                (selectedStatus !== "default"
                    ? employee.is_active === (selectedStatus === "true")
                    : true) &&
                (selectedName !== null
                    ? employee.name === selectedName
                    : true) &&
                (selectedDepartments && selectedDepartments.length > 0
                    ? selectedDepartments.includes(employee.department_id)
                    : true)
            );
        });

        return result;
    }, [
        sortedList,
        selectedType,
        selectedStatus,
        selectedName,
        selectedDepartments,
    ]);

    // Заполняем селектор сотрудников
    const nameOptions = useMemo(() => {
        const allNames = sortedList.map((item) => ({
            value: item.id,
            label: item.name,
        }));

        return Array.from(new Set(allNames));
    }, [sortedList]);

    // Получени списка сотрудников
    const getList = () => {
        setIsLoading(true);
        getData(`${import.meta.env.VITE_API_URL}physical-persons`)
            .then((response) => {
                if (response.status == 200) {
                    setList(response.data);
                    setSortedList(response.data);
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
                        setDepartments(response.data.data);
                    }
                }
            }
        );
    };

    const handleListSort = () => {
        setSortedList(sortList(list, sortBy));
    };

    useEffect(() => {
        handleListSort();
    }, [sortBy]);

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
                                isMulti
                                options={departments.map((item) => ({
                                    value: item.id,
                                    label: item.name,
                                }))}
                                className="p-1 border border-gray-300 min-w-[250px] max-w-[300px] executor-block__name-field"
                                placeholder="Подразделение"
                                noOptionsMessage={() => "Совпадений нет"}
                                isValidNewOption={() => false}
                                onChange={(selectedOptions) => {
                                    if (
                                        selectedOptions &&
                                        selectedOptions.length > 0
                                    ) {
                                        setSelectedDepartments(
                                            selectedOptions.map(
                                                (option) => option.value
                                            )
                                        );
                                    } else {
                                        setSelectedDepartments([]);
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
                                {COLUMNS.map(({ label, key, is_sortable }) => (
                                    <th
                                        className="text-base px-4 py-2 min-w-[180px] max-w-[200px]"
                                        rowSpan="2"
                                        key={key}
                                    >
                                        {is_sortable ? (
                                            <TheadSortButton
                                                label={label}
                                                value={key}
                                                sortBy={sortBy}
                                                setSortBy={setSortBy}
                                            />
                                        ) : (
                                            label
                                        )}
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
