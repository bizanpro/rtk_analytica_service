import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";
import buildQueryParams from "../../utils/buildQueryParams";

import SalesItem from "./SalesItem";
import Popup from "../Popup/Popup";
// import Select from "../Select";

import DatePicker from "react-datepicker";

import MultiSelectWithSearch from "../MultiSelect/MultiSelectWithSearch";
import FilterButton from "../FilterButton";
import OverlayTransparent from "../Overlay/OverlayTransparent";

const formatDate = (date) => {
    return date.toISOString().split("T")[0];
};

const Sales = () => {
    const URL = `${import.meta.env.VITE_API_URL}sales-funnel-projects`;
    const navigate = useNavigate();

    const [mode, setMode] = useState("edit");

    const [isLoading, setIsLoading] = useState(true);
    const [popupState, setPopupState] = useState(false);

    const [list, setList] = useState([]);

    const [newProjectName, setNewProjectName] = useState("");
    const [openFilter, setOpenFilter] = useState("");

    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [selectedBank, setSelectedBank] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    const [dateRange, setDateRange] = useState([null, null]);

    // Заполняем селектор заказчиков
    const customerOptions = useMemo(() => {
        const allSectors = list
            .map((item) => item?.contragent?.program_name)
            .filter((contragent) => contragent?.program_name !== null);

        return Array.from(new Set(allSectors));
    }, [list]);

    // Заполняем селектор банков
    const bankOptions = useMemo(() => {
        const allBanks = list.flatMap((item) =>
            item.creditors?.map((bank) => bank?.name)
        );
        return Array.from(new Set(allBanks));
    }, [list]);

    // // Заполняем селектор статусов
    const statusOptions = useMemo(() => {
        const allPM = list
            .map((item) => item.last_service_last_stage)
            .filter(
                (last_service_last_stage) => last_service_last_stage !== null
            );
        return Array.from(new Set(allPM));
    }, [list]);

    const COLUMNS = [
        { label: "Проект", key: "name" },
        { label: "Заказчик", key: "contragent" },
        { label: "Банк", key: "creditors" },
        { label: "Тип услуг", key: "services" },
        {
            label: "Стоим. млн руб.",
            key: "costs",
        },
        { label: "Дата запроса", key: "request_date" },
        { label: "Источник", key: "request_source" },
        { label: "Дата статуса", key: "status_date" },
        { label: "Статус", key: "last_service_last_stage" },
    ];

    // const filteredProjects = useMemo(() => {
    //     const result = list.filter((project) => {
    //         return (
    //             (selectedCustomer && selectedCustomer !== "default"
    //                 ? project?.contragent?.program_name === selectedCustomer
    //                 : true) &&
    //             (selectedBank && selectedBank !== "default"
    //                 ? Array.isArray(project.creditors)
    //                     ? project.creditors?.some(
    //                           (bank) => bank?.name === selectedBank
    //                       )
    //                     : false
    //                 : true) &&
    //             (selectedStatus && selectedStatus !== "default"
    //                 ? project.last_service_last_stage === selectedStatus
    //                 : true)
    //         );
    //     });
    //     return result;
    // }, [list, selectedCustomer, selectedBank, selectedStatus, dateRange]);

    // Получение реестра
    const getList = (query = "") => {
        setIsLoading(true);

        getData(`${URL}?${query}`, { Accept: "application/json" })
            .then((response) => {
                setList(response.data);
            })
            .finally(() => setIsLoading(false));
    };

    const handleProjectsNameChange = (e) => {
        setNewProjectName(e.target.value);
    };

    const openPopup = () => {
        setPopupState(true);
    };

    const closePopup = (evt) => {
        if (evt.currentTarget.classList.contains("popup")) setPopupState(false);
    };

    // Создание проекта
    const createProject = () => {
        postData("POST", URL, { name: newProjectName }).then((response) => {
            if (response) {
                navigate(`/sales/${response.id}`, {
                    state: { mode: "edit" },
                });
            }
        });
    };

    // Удаление проекта
    const deleteProject = (projectId) => {
        postData("DELETE", `${URL}/${projectId}`, {}).then((response) => {
            if (response.ok) {
                getList();
            }
        });
    };

    useEffect(() => {
        getList();
    }, []);

    const [filters, setFilters] = useState({
        selectedNames: [],
        selectedStatuses: [],
        selectedContagents: [],
        selectedSectors: [],
        selectedBanks: [],
        selectedManagers: [],
    });

    const filteredProjects = useMemo(() => {
        return list.filter((project) => {
            return (
                (filters.selectedSectors.length === 0 ||
                    filters.selectedSectors.includes(
                        project.industries?.main?.name
                    )) &&
                (filters.selectedBanks.length === 0 ||
                    project.creditors?.some((c) =>
                        filters.selectedBanks.includes(c.name)
                    )) &&
                (filters.selectedManagers.length === 0 ||
                    filters.selectedManagers.includes(project.manager)) &&
                (filters.selectedNames.length === 0 ||
                    filters.selectedNames.includes(project.name)) &&
                (filters.selectedStatuses.length === 0 ||
                    filters.selectedStatuses.includes(
                        handleStatus(project.status)
                    )) &&
                (filters.selectedContagents.length === 0 ||
                    filters.selectedContagents.includes(project.contragent))
            );
        });
    }, [list, filters]);

    return (
        <main className="page projects">
            <div className="container registry__container">
                <section className="registry__header flex justify-between items-center">
                    <h1 className="title">
                        Реестр проектов в воронке продаж
                        {filteredProjects.length > 0 && (
                            <span>{filteredProjects.length}</span>
                        )}
                    </h1>

                    <div className="flex items-center gap-6">
                        {mode === "edit" && (
                            <button
                                type="button"
                                className="button-active"
                                onClick={openPopup}
                            >
                                <span>Создать проект</span>
                                <div className="button-active__icon">
                                    <svg
                                        width="12"
                                        height="13"
                                        viewBox="0 0 12 13"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M6.75 5.75h3.75v1.5H6.75V11h-1.5V7.25H1.5v-1.5h3.75V2h1.5v3.75z"
                                            fill="#fff"
                                        />
                                    </svg>
                                </div>
                            </button>
                        )}
                    </div>

                    {/* <div className="flex items-center gap-6">
                        {customerOptions.length > 0 && (
                            <Select
                                className={
                                    "p-1 border border-gray-300 w-[150px]"
                                }
                                title={"Заказчик"}
                                items={customerOptions}
                                onChange={(evt) => {
                                    setSelectedCustomer(evt.target.value);
                                }}
                            />
                        )}

                        {bankOptions.length > 0 && (
                            <Select
                                className={
                                    "p-1 border border-gray-300 w-[150px]"
                                }
                                title={"Банк"}
                                items={bankOptions}
                                onChange={(evt) =>
                                    setSelectedBank(evt.target.value)
                                }
                            />
                        )}

                        {statusOptions.length > 0 && (
                            <Select
                                className={
                                    "p-1 border border-gray-300 w-[150px]"
                                }
                                title={"Статус"}
                                items={statusOptions}
                                onChange={(evt) =>
                                    setSelectedStatus(evt.target.value)
                                }
                            />
                        )}

                        <DatePicker
                            className="p-1 border border-gray-300 h-[27.5px] w-[195px]"
                            placeholderText="Период запросов"
                            startDate={dateRange[0]}
                            endDate={dateRange[1]}
                            onChange={(update) => {
                                const [start, end] = update || [];

                                if (!start && !end) {
                                    setDateRange([null, null]);
                                    getList();
                                    return;
                                }

                                setDateRange(update);

                                if (start && end) {
                                    const filters = {
                                        request_date_from: [formatDate(start)],
                                        request_date_to: [formatDate(end)],
                                    };
                                    const query = buildQueryParams(filters);
                                    getList(query);
                                }
                            }}
                            dateFormat="dd.MM.yyyy"
                            selectsRange={true}
                            isClearable={true}
                        />
                    </div> */}
                </section>

                <section className="registry__table-section w-full">
                    {openFilter !== "" && (
                        <OverlayTransparent
                            state={true}
                            toggleMenu={() => setOpenFilter("")}
                        />
                    )}

                    <table className="registry-table table-auto w-full border-collapse">
                        <thead className="registry-table__thead">
                            <tr>
                                {COLUMNS.map(
                                    ({ label, key, filter, options }) => {
                                        return (
                                            <th
                                                className="min-w-[125px]"
                                                rowSpan="2"
                                                key={key}
                                            >
                                                <div className="registry-table__thead-item">
                                                    {filter ? (
                                                        <>
                                                            <div className="registry-table__thead-label">
                                                                {label}
                                                            </div>

                                                            {filters[filter]
                                                                .length > 0 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setFilters(
                                                                            (
                                                                                prev
                                                                            ) => ({
                                                                                ...prev,
                                                                                [filter]:
                                                                                    [],
                                                                            })
                                                                        );
                                                                    }}
                                                                >
                                                                    <svg
                                                                        width="16"
                                                                        height="16"
                                                                        viewBox="0 0 16 16"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path
                                                                            d="M9.06 8l3.713 3.712-1.06 1.06L8 9.06l-3.712 3.713-1.061-1.06L6.939 8 3.227 4.287l1.06-1.06L8 6.939l3.712-3.712 1.061 1.06L9.061 8z"
                                                                            fill="#000"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            )}

                                                            {options.length >
                                                                0 &&
                                                                options.some(
                                                                    (val) =>
                                                                        val !==
                                                                        undefined
                                                                ) && (
                                                                    <FilterButton
                                                                        label={
                                                                            label
                                                                        }
                                                                        key={
                                                                            key
                                                                        }
                                                                        filterKey={
                                                                            key
                                                                        }
                                                                        openFilter={
                                                                            openFilter
                                                                        }
                                                                        setOpenFilter={
                                                                            setOpenFilter
                                                                        }
                                                                    />
                                                                )}

                                                            {openFilter ===
                                                                key && (
                                                                <MultiSelectWithSearch
                                                                    options={
                                                                        options.length >
                                                                        0
                                                                            ? options.map(
                                                                                  (
                                                                                      name
                                                                                  ) => ({
                                                                                      value: name,
                                                                                      label: name,
                                                                                  })
                                                                              )
                                                                            : []
                                                                    }
                                                                    selectedValues={
                                                                        filters[
                                                                            filter
                                                                        ]
                                                                    }
                                                                    onChange={(
                                                                        updated
                                                                    ) =>
                                                                        setFilters(
                                                                            (
                                                                                prev
                                                                            ) => ({
                                                                                ...prev,
                                                                                ...updated,
                                                                            })
                                                                        )
                                                                    }
                                                                    fieldName={
                                                                        filter
                                                                    }
                                                                    close={
                                                                        setOpenFilter
                                                                    }
                                                                />
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="registry-table__thead-label">
                                                            {label}
                                                        </div>
                                                    )}
                                                </div>
                                            </th>
                                        );
                                    }
                                )}
                            </tr>
                        </thead>

                        <tbody className="registry-table__tbody">
                            {isLoading ? (
                                <tr>
                                    <td className="text-base px-4 py-2">
                                        Загрузка...
                                    </td>
                                </tr>
                            ) : (
                                filteredProjects.length > 0 &&
                                filteredProjects.map((item) => (
                                    <SalesItem
                                        key={item.id}
                                        props={item}
                                        columns={COLUMNS}
                                        mode={mode}
                                        deleteProject={deleteProject}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </section>

                {popupState && (
                    <Popup
                        onClick={closePopup}
                        title="Создать проект в воронке"
                    >
                        <div className="action-form__body">
                            <label
                                htmlFor="project_name"
                                className="form-label"
                            >
                                Название проекта <span>*</span>
                            </label>
                            <input
                                type="text"
                                name="project_name"
                                id="project_name"
                                className="form-field w-full"
                                value={newProjectName}
                                onChange={(e) => handleProjectsNameChange(e)}
                            />
                        </div>

                        <div className="action-form__footer">
                            <div className="max-w-[280px]">
                                <button
                                    type="button"
                                    onClick={() => setPopupState(false)}
                                    className="cancel-button flex-[1_0_auto]"
                                >
                                    Отменить
                                </button>

                                <button
                                    type="button"
                                    className="action-button flex-[1_0_auto]"
                                    onClick={createProject}
                                    disabled={newProjectName.length < 2}
                                >
                                    Создать проект
                                </button>
                            </div>
                        </div>
                    </Popup>
                )}
            </div>
        </main>
    );
};

export default Sales;
