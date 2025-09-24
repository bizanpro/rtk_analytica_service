import { useEffect, useState, useMemo } from "react";

import getData from "../../utils/getData";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import handleStatus from "../../utils/handleStatus";
// import { createDebounce } from "../../utils/debounce";
import { sortList } from "../../utils/sortList";

import ContragentItem from "./ContragentItem";
import TheadSortButton from "../TheadSortButton/TheadSortButton";
// import Select from "../Select";
import CreatableSelect from "react-select/creatable";
// import Search from "../Search/Search";

const Contragents = () => {
    const [list, setList] = useState([]);
    const [sortedList, setSortedList] = useState([]);

    const [sortBy, setSortBy] = useState({ key: "", action: "" });

    const [selectedName, setSelectedName] = useState("default");
    const [selectedStatus, setSelectedStatus] = useState("default");

    const [isLoading, setIsLoading] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);

    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({
        current_page: 1,
        last_page: 1,
    });

    const URL = `${import.meta.env.VITE_API_URL}contragents`;

    const COLUMNS = [
        { label: "Наименование", key: "program_name", is_sortable: false },
        {
            label: "Кол-во проектов, всего",
            key: "projects_total_count",
            is_sortable: true,
        },
        {
            label: "Кол-во активных проектов",
            key: "projects_active_count",
            is_sortable: true,
        },
        {
            label: "Бюджет проектов, млрд руб.",
            key: "projects_total_budget",
            is_sortable: true,
        },
        { label: "Выручка, млн руб.", key: "revenue_total", is_sortable: true },
        {
            label: "Получено оплат, млн руб.",
            key: "income_total",
            is_sortable: true,
        },
        { label: "Статус", key: "status", is_sortable: false },
    ];

    const filteredContragents = useMemo(() => {
        return sortedList.filter((customer) => {
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
    }, [sortedList, selectedName, selectedStatus]);

    const handleListSort = () => {
        setSortedList(sortList(list, sortBy));
    };

    // const handleSearch = (event) => {
    //     const searchQuery = event.value.toLowerCase();

    //     setIsLoading(true);
    //     getData(
    //         `${URL}?page=${page}&active=true&has_projects=true&scope=registry&search=${searchQuery}`,
    //         {
    //             Accept: "application/json",
    //         }
    //     )
    //         .then((response) => {
    //             setList(response.data.data);
    //         })
    //         .finally(() => setIsLoading(false));
    // };

    // const debounce = createDebounce(handleSearch, 300, true);

    // Заполняем селектор заказчиков
    const nameOptions = useMemo(() => {
        const allNames = sortedList
            .map((item) => ({
                value: item.id,
                label: item.program_name,
            }))
            .filter((program_name) => program_name !== null);

        return Array.from(new Set(allNames));
    }, [sortedList]);

    // Заполняем селектор статусов
    const statusOptions = useMemo(() => {
        const allStatuses = sortedList
            .map((item) => item.status)
            .filter((status) => status !== null);

        const uniqueStatuses = Array.from(new Set(allStatuses));

        return uniqueStatuses.map((status) => ({
            value: status,
            label: handleStatus(status),
        }));
    }, [sortedList]);

    useEffect(() => {
        setIsLoading(true);
        getData(
            `${URL}?page=${page}&active=true&has_projects=true&scope=registry`,
            {
                Accept: "application/json",
            }
        )
            .then((response) => {
                setList((prev) => [...prev, ...response.data.data]);
                setSortedList((prev) => [...prev, ...response.data.data]);
                setMeta(response.data.meta);
            })
            .finally(() => setIsLoading(false));
    }, [page]);

    useEffect(() => {
        selectedName === null && selectedStatus === "default"
            ? setIsFiltering(false)
            : setIsFiltering(true);
    }, [selectedName, selectedStatus]);

    useEffect(() => {
        handleListSort();
    }, [sortBy]);

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
                        Реестр заказчиков{" "}
                        {filteredContragents.length > 0 &&
                            `(${filteredContragents.length})`}
                    </h1>

                    <div className="flex items-center gap-6">
                        {/* <Search
                            onSearch={debounce}
                            className="search-fullpage"
                            placeholder="Поиск заказчика"
                        /> */}

                        {nameOptions.length > 0 && (
                            <CreatableSelect
                                isClearable
                                options={nameOptions}
                                className="p-1 border border-gray-300 w-[300px] executor-block__name-field"
                                placeholder="Заказчик"
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

                        {/* {nameOptions.length > 0 && (
                            <Select
                                className={
                                    "p-1 border border-gray-300 min-w-[120px] max-w-[200px]"
                                }
                                title={"Заказчик"}
                                items={nameOptions}
                                onChange={(evt) => {
                                    setSelectedName(evt.target.value);
                                }}
                            />
                        )} */}

                        {statusOptions.length > 0 && (
                            <select
                                className={
                                    "p-1 border border-gray-300 w-[150px] h-[48px]"
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
                                {COLUMNS.map(({ label, key, is_sortable }) => (
                                    <th
                                        className="text-base px-4 py-2 min-w-[180px] max-w-[230px] thead__item"
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
                            {filteredContragents.length > 0 &&
                                filteredContragents.map((item) => (
                                    <ContragentItem
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

export default Contragents;
