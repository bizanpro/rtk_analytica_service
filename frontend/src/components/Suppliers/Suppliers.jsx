import { useEffect, useState, useMemo } from "react";
import getData from "../../utils/getData";
import handleStatus from "../../utils/handleStatus";
import SupplierItem from "./SupplierItem";
import Select from "../Select";
import Search from "../Search/Search";
import { createDebounce } from "../../utils/debounce";

const Suppliers = () => {
    const [list, setList] = useState([]);
    const [selectedName, setSelectedName] = useState("default");
    const [selectedStatus, setSelectedStatus] = useState("default");
    const [isLoading, setIsLoading] = useState(true);

    const URL = `${import.meta.env.VITE_API_URL}suppliers/?active=true`;

    const COLUMNS = [
        { label: "Наименование", key: "program_name" },
        { label: "Кол-во проектов, всего", key: "projects_total_count" },
        { label: "Кол-во активных проектов", key: "projects_active_count" },
        { label: "Роли", key: "role" },
        { label: "Оплачено услуг, млн руб.", key: "" },
        { label: "Статус", key: "status" },
    ];

    const filteredList = useMemo(() => {
        return list.filter((customer) => {
            const matchName =
                selectedName && selectedName !== "default"
                    ? customer.program_name === selectedName
                    : true;

            const matchStatus =
                selectedStatus && selectedStatus !== "default"
                    ? customer.status === selectedStatus
                    : true;

            return matchName && matchStatus;
        });
    }, [list, selectedName, selectedStatus]);

    const handleSearch = (event) => {
        const searchQuery = event.value.toLowerCase();

        getData(`${URL}&search=${searchQuery}`, { Accept: "application/json" })
            .then((response) => {
                if (response.status == 200) {
                    setList(response.data);
                }
            })
            .finally(() => setIsLoading(false));
    };

    const debounce = createDebounce(handleSearch, 300, true);

    // Заполняем селектор заказчиков
    const nameOptions = useMemo(() => {
        const allNames = list
            .map((item) => item.program_name)
            .filter((program_name) => program_name !== null);

        return Array.from(new Set(allNames));
    }, [list]);

    // Заполняем селектор статусов
    const statusOptions = useMemo(() => {
        const allStatuses = list
            .map((item) => item.status)
            .filter((status) => status !== null);

        const uniqueStatuses = Array.from(new Set(allStatuses));

        return uniqueStatuses.map((status) => ({
            value: status,
            label: handleStatus(status),
        }));
    }, [list]);

    useEffect(() => {
        setIsLoading(true);
        getData(URL, { Accept: "application/json" })
            .then((response) => {
                setList((prev) => [...prev, ...response.data]);
            })
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <main className="page">
            <div className="container py-8">
                <div className="flex justify-between items-center gap-6 mb-8">
                    <h1 className="text-3xl font-medium">
                        Реестр подрядчиков{" "}
                        {filteredList.length > 0 && `(${filteredList.length})`}
                    </h1>

                    <div className="flex items-center gap-6">
                        <Search
                            onSearch={debounce}
                            className="search-fullpage"
                            placeholder="Поиск подрядчика"
                        />

                        {nameOptions.length > 0 && (
                            <Select
                                className={
                                    "p-1 border border-gray-300 min-w-[120px] max-w-[200px]"
                                }
                                title={"Подрядчик"}
                                items={nameOptions}
                                onChange={(evt) => {
                                    setSelectedName(evt.target.value);
                                }}
                            />
                        )}

                        {statusOptions.length > 0 && (
                            <select
                                className={
                                    "p-1 border border-gray-300 min-w-[120px] max-w-[200px]"
                                }
                                onChange={(evt) =>
                                    setSelectedStatus(evt.target.value)
                                }
                            >
                                <option value="default">Статус</option>
                                {statusOptions.map((status, index) => (
                                    <option value={status.value} key={index}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto w-full pb-5">
                    <table className="table-auto w-full border-collapse border-gray-300 text-sm">
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
                            {filteredList.length > 0 &&
                                filteredList.map((item) => (
                                    <SupplierItem
                                        key={item.id}
                                        props={item}
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

export default Suppliers;
