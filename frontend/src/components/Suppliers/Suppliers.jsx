import { useEffect, useState, useMemo } from "react";

import getData from "../../utils/getData";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import handleStatus from "../../utils/handleStatus";

import SupplierItem from "./SupplierItem";
import CreatableSelect from "react-select/creatable";

const Suppliers = () => {
    const [list, setList] = useState([]);
    const [selectedName, setSelectedName] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("default");
    const [isLoading, setIsLoading] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({
        current_page: 1,
        last_page: 1,
    });

    const URL = `${import.meta.env.VITE_API_URL}suppliers/?active=true`;

    const COLUMNS = [
        { label: "Наименование", key: "program_name" },
        { label: "Кол-во проектов, всего", key: "projects_total_count" },
        { label: "Кол-во активных проектов", key: "projects_active_count" },
        { label: "Роли", key: "roles" },
        { label: "Оплачено услуг, млн руб.", key: "total_receipts" },
        { label: "Статус", key: "status" },
    ];

    const filteredList = useMemo(() => {
        return list.filter((customer) => {
            const matchName =
                selectedName !== null
                    ? customer.program_name === selectedName
                    : true;

            const matchStatus =
                selectedStatus && selectedStatus !== "default"
                    ? customer.status === selectedStatus
                    : true;

            return matchName && matchStatus;
        });
    }, [list, selectedName, selectedStatus]);

    // Заполняем селектор заказчиков
    const nameOptions = useMemo(() => {
        const allNames = list.map((item) => ({
            value: item.id,
            label: item.program_name,
        }));

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
        getData(`${URL}&page=${page}`, { Accept: "application/json" })
            .then((response) => {
                setList((prev) => [...prev, ...response.data.data]);
                setMeta(response.data.meta);
            })
            .finally(() => setIsLoading(false));
    }, [page]);

    useEffect(() => {
        selectedName === "default" && selectedStatus === "default"
            ? setIsFiltering(false)
            : setIsFiltering(true);
    }, [selectedName, selectedStatus]);

    const loaderRef = useInfiniteScroll({
        isLoading,
        meta,
        setPage,
        isFiltering,
    });

    return (
        <main className="page">
            <div className="container py-8">
                <div className="flex justify-between items-center gap-6 mb-8">
                    <h1 className="text-3xl font-medium">
                        Реестр подрядчиков{" "}
                        {filteredList.length > 0 && `(${filteredList.length})`}
                    </h1>

                    <div className="flex items-center gap-6">
                        <CreatableSelect
                            isClearable
                            options={nameOptions}
                            className="p-1 border border-gray-300 min-w-[250px] max-w-[300px] executor-block__name-field"
                            placeholder="Подрядчик"
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

                        {statusOptions.length > 0 && (
                            <select
                                className={
                                    "p-1 border border-gray-300 min-w-[120px] max-w-[200px] h-[48px]"
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

                    <div ref={loaderRef} className="h-4" />
                    {isLoading && <div className="mt-4">Загрузка...</div>}
                </div>
            </div>
        </main>
    );
};

export default Suppliers;
