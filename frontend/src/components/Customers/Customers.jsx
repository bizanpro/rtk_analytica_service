import { useEffect, useState, useMemo } from "react";
import getData from "../../utils/getData";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import handleStatus from "../../utils/handleStatus";
import ProjectItem from "./CustomerItem";
import Select from "../Select";

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedName, setSelectedName] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);

    const URL = `${import.meta.env.VITE_API_URL}contragents`;

    const COLUMNS = [
        { label: "Наименование", key: "program_name" },
        { label: "Кол-во проектов, всего", key: "projects_total_count" },
        { label: "Кол-во активных проектов", key: "projects_active_count" },
        { label: "Средняя оценка", key: "average_score" },
        { label: "Бюджет проектов, млрд руб.", key: "projects_total_budget" },
        { label: "Выручка, млн руб.", key: "revenue_total" },
        { label: "Получено оплат, млн руб.", key: "income_total" },
        { label: "Статус", key: "status" },
    ];

    const filteredCustomers = useMemo(() => {
        return customers.filter((customer) => {
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
    }, [customers, selectedName, selectedStatus]);

    // Заполняем селектор заказчиков
    const nameOptions = useMemo(() => {
        const allNames = customers
            .map((item) => item.program_name)
            .filter((program_name) => program_name !== null);

        return Array.from(new Set(allNames));
    }, [customers]);

    // Заполняем селектор статусов
    const statusOptions = useMemo(() => {
        const allStatuses = customers
            .map((item) => item.status)
            .filter((status) => status !== null);

        const uniqueStatuses = Array.from(new Set(allStatuses));

        return uniqueStatuses.map((status) => ({
            value: status,
            label: handleStatus(status),
        }));
    }, [customers]);

    useEffect(() => {
        setIsLoading(true);
        getData(`${URL}/?page=${page}`, { Accept: "application/json" })
            .then((response) => {
                setCustomers((prev) => [...prev, ...response.data.data]);
                setMeta(response.data.meta);
            })
            .finally(() => setIsLoading(false));
    }, [page]);

    useInfiniteScroll({
        isLoading,
        hasMore: meta ? page < meta.last_page : true,
        loadMore: () => setPage((prev) => prev + 1),
    });

    return (
        <main className="page">
            <div className="container py-8">
                <div className="flex justify-between items-center gap-6 mb-8">
                    <h1 className="text-3xl font-medium">
                        Реестр заказчиков{" "}
                        {filteredCustomers.length > 0 &&
                            `(${filteredCustomers.length})`}
                    </h1>

                    <div className="flex items-center gap-6">
                        {nameOptions.length > 0 && (
                            <Select
                                className={
                                    "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                }
                                title={"Заказчик"}
                                items={nameOptions}
                                onChange={(evt) => {
                                    setSelectedName(evt.target.value);
                                }}
                            />
                        )}

                        {statusOptions.length > 0 && (
                            <select
                                className={
                                    "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                }
                                onChange={(evt) =>
                                    setSelectedStatus(evt.target.value)
                                }
                            >
                                <option value="">Статус</option>
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
                            {filteredCustomers.length > 0 &&
                                filteredCustomers.map((item) => (
                                    <ProjectItem
                                        key={item.id}
                                        props={item}
                                        columns={COLUMNS}
                                    />
                                ))}
                        </tbody>
                    </table>

                    {isLoading && (
                        <div className="text-center py-4 text-gray-500">
                            Загрузка...
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Customers;
