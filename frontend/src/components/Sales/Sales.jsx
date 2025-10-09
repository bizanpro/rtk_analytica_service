import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";
import buildQueryParams from "../../utils/buildQueryParams";

import SalesItem from "./SalesItem";
import Popup from "../Popup/Popup";
// import Select from "../Select";

import CustomDatePicker from "../CustomDatePicker/CustomDatePicker";

import MultiSelectWithSearch from "../MultiSelect/MultiSelectWithSearch";
import FilterButton from "../FilterButton";
import OverlayTransparent from "../Overlay/OverlayTransparent";

const Sales = () => {
    const URL = `${import.meta.env.VITE_API_URL}sales-funnel-projects`;
    const navigate = useNavigate();

    const [mode, setMode] = useState("edit");

    const [isLoading, setIsLoading] = useState(true);
    const [popupState, setPopupState] = useState(false);

    const [list, setList] = useState([]);

    const [requestDateQuery, setRequestDateQuery] = useState(""); // Дата запроса

    const [newProjectName, setNewProjectName] = useState("");
    const [openFilter, setOpenFilter] = useState("");

    // Заполняем селектор проектов
    const nameOptions = useMemo(() => {
        const allNames = list
            .map((item) => item.name)
            .filter((name) => name !== null);

        return Array.from(new Set(allNames));
    }, [list]);

    // Заполняем селектор заказчиков
    const contragentOptions = useMemo(() => {
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

    // // Заполняем селектор типов услуг
    const serviceOptions = useMemo(() => {
        const allServices = list
            .flatMap((item) => item.services)
            ?.map((service) => service?.name);

        return Array.from(new Set(allServices));
    }, [list]);

    // Заполняем селектор статусов
    const statusOptions = useMemo(() => {
        const allStatuses = list
            .map((item) => item.last_service_last_stage)
            .filter(
                (last_service_last_stage) => last_service_last_stage !== null
            );
        return Array.from(new Set(allStatuses));
    }, [list]);

    // Заполняем селектор источников
    const sourceOptions = useMemo(() => {
        const allSources = list
            .flatMap((item) => item.request_source)
            .map((request_source) => request_source.name);
        return Array.from(new Set(allSources));
    }, [list]);

    const COLUMNS = [
        {
            label: "Проект",
            key: "name",
            filter: "selectedNames",
            options: nameOptions,
        },
        {
            label: "Заказчик",
            key: "contragent",
            filter: "selectedContagents",
            options: contragentOptions,
        },
        {
            label: "Банк",
            key: "creditors",
            filter: "selectedBanks",
            options: bankOptions,
        },
        {
            label: "Тип услуг",
            key: "services",
            filter: "selectedServices",
            options: serviceOptions,
        },
        {
            label: "Стоим. млн руб.",
            key: "costs",
        },
        {
            label: "Дата запроса",
            key: "request_date",
            date: "range",
            date_from: requestDateQuery,
            date_to: requestDateQuery,
        },
        {
            label: "Источник",
            key: "request_source",
            filter: "selectedSources",
            options: sourceOptions,
        },
        {
            label: "Дата статуса",
            key: "status_date",
            // filter: "selectedBanks",
            // options: bankOptions,
        },
        {
            label: "Статус",
            key: "last_service_last_stage",
            filter: "selectedStatuses",
            options: statusOptions,
        },
    ];

    // Получение реестра
    const getList = () => {
        setIsLoading(true);

        getData(`${URL}?${buildQueryParams(requestDateQuery)}`, {
            Accept: "application/json",
        })
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
    }, [requestDateQuery]);

    const [filters, setFilters] = useState({
        selectedNames: [],
        selectedContagents: [],
        selectedBanks: [],
        selectedServices: [],
        selectedSources: [],
        selectedStatuses: [],
    });

    const filteredProjects = useMemo(() => {
        return list.filter((project) => {
            return (
                (filters.selectedNames.length === 0 ||
                    filters.selectedNames.includes(project.name)) &&
                (filters.selectedContagents.length === 0 ||
                    filters.selectedContagents.includes(
                        project.contragent.program_name
                    )) &&
                (filters.selectedBanks.length === 0 ||
                    project.creditors?.some((c) =>
                        filters.selectedBanks.includes(c.name)
                    )) &&
                (filters.selectedServices.length === 0 ||
                    project.services?.some((c) =>
                        filters.selectedServices.includes(c.name)
                    )) &&
                (filters.selectedSources.length === 0 ||
                    filters.selectedSources.includes(
                        project.request_source.name
                    )) &&
                (filters.selectedStatuses.length === 0 ||
                    filters.selectedStatuses.includes(
                        project.last_service_last_stage
                    ))
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
                                    ({
                                        label,
                                        key,
                                        filter,
                                        date,
                                        date_from,
                                        date_to,
                                        options,
                                    }) => {
                                        return (
                                            <th
                                                className="min-w-[125px]"
                                                rowSpan="2"
                                                key={key}
                                            >
                                                <div className="registry-table__thead-item">
                                                    {(() => {
                                                        if (filter) {
                                                            return (
                                                                <>
                                                                    <div className="registry-table__thead-label">
                                                                        {label}
                                                                    </div>

                                                                    {filters[
                                                                        filter
                                                                    ].length >
                                                                        0 && (
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
                                                                            (
                                                                                val
                                                                            ) =>
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
                                                            );
                                                        } else if (date) {
                                                            return (
                                                                <>
                                                                    <div
                                                                        className="registry-table__thead-label"
                                                                        style={
                                                                            date_from.request_date_from
                                                                                ? {
                                                                                      overflow:
                                                                                          "visible",
                                                                                  }
                                                                                : {}
                                                                        }
                                                                    >
                                                                        {date_from.request_date_from ? (
                                                                            <div className="registry-table__thead-label-date">
                                                                                <span>
                                                                                    {date_from.request_date_from[0]
                                                                                        .split(
                                                                                            "-"
                                                                                        )
                                                                                        .reverse()
                                                                                        .join(
                                                                                            "."
                                                                                        )}
                                                                                </span>

                                                                                <div className="hint__message">
                                                                                    {`${date_from.request_date_from[0]
                                                                                        .split(
                                                                                            "-"
                                                                                        )
                                                                                        .reverse()
                                                                                        .join(
                                                                                            "."
                                                                                        )} - ${date_to.request_date_to[0]
                                                                                        .split(
                                                                                            "-"
                                                                                        )
                                                                                        .reverse()
                                                                                        .join(
                                                                                            "."
                                                                                        )}`}
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            label
                                                                        )}
                                                                    </div>

                                                                    {requestDateQuery !=
                                                                        "" && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setRequestDateQuery(
                                                                                    ""
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

                                                                    {openFilter ===
                                                                        key && (
                                                                        <CustomDatePicker
                                                                            closePicker={
                                                                                setOpenFilter
                                                                            }
                                                                            onChange={(
                                                                                updated
                                                                            ) => {
                                                                                console.log(
                                                                                    updated
                                                                                );

                                                                                if (
                                                                                    key ===
                                                                                    "request_date"
                                                                                ) {
                                                                                    setRequestDateQuery(
                                                                                        updated
                                                                                    );
                                                                                }
                                                                            }}
                                                                        />
                                                                    )}
                                                                </>
                                                            );
                                                        }

                                                        return (
                                                            <div className="registry-table__thead-label">
                                                                {label}
                                                            </div>
                                                        );
                                                    })()}
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
