import { useEffect, useState, useMemo } from "react";

import getData from "../../utils/getData";
import { createDebounce } from "../../utils/debounce";

import EmployeeItem from "./EmployeeItem";
import Select from "../Select";
import Search from "../Search/Search";

const Employees = () => {
    const [list, setList] = useState([]);
    const [selectedType, setSelectedType] = useState("default");
    const [selectedStatus, setSelectedStatus] = useState("default");
    const [selectedName, setSelectedName] = useState("default");
    const [isLoading, setIsLoading] = useState(true);

    const COLUMNS = [
        { label: "ФИО", key: "name" },
        { label: "Загрузка", key: "reports_count" },
        { label: "Должность", key: "position" },
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
                    : true) &&
                (selectedName !== "default"
                    ? employee.name === selectedName
                    : true)
            );
        });

        return result;
    }, [list, selectedType, selectedStatus, selectedName]);

    const handleSearch = (event) => {
        const searchQuery = event.value.toLowerCase();

        getData(
            `${
                import.meta.env.VITE_API_URL
            }physical-persons/?search=${searchQuery}`,
            { Accept: "application/json" }
        )
            .then((response) => {
                if (response.status == 200) {
                    setList(response.data);
                }
            })
            .finally(() => setIsLoading(false));
    };

    const debounce = createDebounce(handleSearch, 300, true);

    // Заполняем селектор сотрудников
    const nameOptions = useMemo(() => {
        const allNames = list
            .map((item) => item.name)
            .filter((name) => name !== null);

        return Array.from(new Set(allNames));
    }, [list]);

    useEffect(() => {
        setIsLoading(true);
        getData(`${import.meta.env.VITE_API_URL}physical-persons`)
            .then((response) => {
                if (response.status == 200) {
                    setList(response.data);
                }
            })
            .finally(() => setIsLoading(false));
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
                        <Search
                            onSearch={debounce}
                            className="search-fullpage"
                            placeholder="Поиск сотрудника"
                        />

                        {nameOptions.length > 0 && (
                            <Select
                                className={
                                    "p-1 border border-gray-300 min-w-[120px] max-w-[200px]"
                                }
                                title={"Сотрудник"}
                                items={nameOptions}
                                onChange={(evt) => {
                                    setSelectedName(evt.target.value);
                                }}
                            />
                        )}

                        <select
                            className={
                                "p-1 border border-gray-300 min-w-[120px] max-w-[200px]"
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
                                "p-1 border border-gray-300 min-w-[120px] max-w-[200px]"
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
