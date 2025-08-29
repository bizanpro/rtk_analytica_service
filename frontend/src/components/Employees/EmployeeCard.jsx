import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import getData from "../../utils/getData";
import postData from "../../utils/postData";

import { IMaskInput } from "react-imask";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import DatePicker from "react-datepicker";
import formatToUtcDateOnly from "../../utils/formatToUtcDateOnly";

import { ru } from "date-fns/locale";
import { format } from "date-fns";

import EmployeeWorkloadItem from "./EmployeeWorkloadItem";
import EmployeePersonalWorkloadItem from "./EmployeePersonalWorkloadItem";
import EmployeeWorkloadSummary from "./EmployeeWorkloadSummary";

import "react-toastify/dist/ReactToastify.css";

const customStyles = {
    option: (base, { data, isFocused, isSelected }) => ({
        ...base,
        backgroundColor: isSelected ? "#2684FF" : isFocused ? "#eee" : "white",
        color: data.isFull ? "black" : "red",
    }),
};

const EmployeeCard = () => {
    const { employeeId } = useParams();
    const navigate = useNavigate();

    const [employeeData, setEmployeeData] = useState({});
    const [departments, setDepartments] = useState([]);
    const [workload, setworkload] = useState({});
    const [personalWorkload, setPersonalWorkload] = useState();
    const [workloadSummary, setWorkloadSummary] = useState();
    const [workloadSummaryMaxPercentage, setWorkloadSummaryMaxPercentage] =
        useState(null);

    const [mode, setMode] = useState("read");
    const [errors, setErrors] = useState({});

    const [datesData, setDatesData] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedPersonalYear, setSelectedPersonalYear] = useState(2024);
    const [selectedPersonalMonth, setSelectedPersonalMonth] = useState({});
    const [selectedTypes, setSelecterTypes] = useState([]);
    const [reportTypes, setReportTypes] = useState([]);
    const [positions, setPositions] = useState([]);
    const [workloads, setWorkloads] = useState([]);
    const [availablePersonalMonths, setAvailablePersonalMonths] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const PhoneMask = "+{7} (000) 000 00 00";

    let query;

    // Свод по трудозатратам, массив доступных дат периода
    const allowedDates = useMemo(() => {
        return datesData.flatMap((yearData) =>
            yearData.months.map(
                (month) => new Date(yearData.year, month.number - 1, 1)
            )
        );
    }, [datesData]);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSave = () => {
        const newErrors = {
            phone_number: !employeeData.phone_number,
            email: !employeeData.email || !validateEmail(employeeData.email),
            dismissal_date:
                !employeeData?.is_active && !employeeData.dismissal_date,
        };

        setErrors(newErrors);
        if (Object.values(newErrors).some((err) => err)) return;
        updateEmployee();
    };

    const handleInputChange = (e, name) => {
        let value;

        if (name === "employment_date" || name === "dismissal_date") {
            value = e ? formatToUtcDateOnly(e) : null;
        } else if (name === "phone_number") {
            value = e;
        } else if (name === "is_staff" || name === "is_active") {
            value = JSON.parse(e.target.value);
        } else {
            value = e.target.value;
        }

        setEmployeeData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Текущая загрузка
    const getWorkload = () => {
        getData(
            `${
                import.meta.env.VITE_API_URL
            }physical-persons/${employeeId}/workload`
        ).then((response) => {
            if (response.status == 200) {
                setworkload(response.data.workload);
            }
        });
    };

    // Получаем года для блока Трудозатраты
    const getYears = () => {
        getData(
            `${
                import.meta.env.VITE_API_URL
            }personal-available-years/?physical_person_id=${employeeId}`
        ).then((response) => {
            if (response.status == 200) {
                setDatesData(response.data);
                setAvailableYears(response.data.map((item) => item.year));
                setSelectedPersonalYear(
                    response.data.map((item) => item.year)[
                        response.data.length - 1
                    ]
                );
            }
        });
    };

    const getTypes = () => {
        getData(
            `${import.meta.env.VITE_API_URL}report-types?with-count=true`
        ).then((response) => {
            if (response.status === 200) {
                setReportTypes(response.data.data);
            }
        });
    };

    // Получаем список должностей
    const getPositions = () => {
        getData(`${import.meta.env.VITE_API_URL}positions`).then((response) => {
            if (response.status === 200) {
                setPositions(response.data.data);
            }
        });
    };

    // Получение свода по трудозатратам
    const getWorkloadSummary = () => {
        const payload = {
            dateFrom: format(dateRange[0], "MM-yyyy"),
            dateTo: format(dateRange[1], "MM-yyyy"),
            reports_ids: selectedTypes.join(","),
        };

        getData(
            `${
                import.meta.env.VITE_API_URL
            }physical-persons/${employeeId}/workload-summary`,
            { params: payload }
        ).then((response) => {
            if (response.status === 200) {
                if (response.data.projects.length > 0) {
                    setWorkloadSummary(
                        response.data.projects.sort(
                            (a, b) => b.total_hours - a.total_hours
                        )
                    );
                }

                if (response.data.projects.length > 0) {
                    const maxValue = Math.max(
                        ...response.data.projects.map(
                            (item) => item.load_percentage
                        )
                    );

                    setWorkloadSummaryMaxPercentage(maxValue);
                }
            }
        });
    };

    // Обновление данных сотрудника
    const updateEmployee = () => {
        if (employeeData.position_id != null) {
            query = toast.loading("Обновление", {
                containerId: "employee",
                position: "top-center",
            });

            postData(
                "PATCH",
                `${import.meta.env.VITE_API_URL}physical-persons/${employeeId}`,
                employeeData
            )
                .then((response) => {
                    if (response?.ok) {
                        toast.update(query, {
                            render: "Успешно обновлено!",
                            type: "success",
                            containerId: "employee",
                            isLoading: false,
                            autoClose: 1200,
                            pauseOnFocusLoss: false,
                            pauseOnHover: false,
                            position: "top-center",
                        });
                    } else {
                        toast.error("Ошибка обновления", {
                            isLoading: false,
                            autoClose: 1500,
                            pauseOnFocusLoss: false,
                            pauseOnHover: false,
                            position: "top-center",
                            containerId: "employee",
                        });
                    }
                })
                .catch((error) => {
                    toast.dismiss(query);
                    toast.error(error.message || "Ошибка обновления данных", {
                        containerId: "employee",
                        isLoading: false,
                        autoClose: 1500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position: "top-center",
                    });
                });
        } else {
            toast.error("Необходимо выбрать должность", {
                containerId: "employee",
                isLoading: false,
                autoClose: 1500,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                position: "top-center",
            });
        }
    };

    // Получаем сотрудника
    const getEmployee = async () => {
        try {
            const response = await getData(
                `${import.meta.env.VITE_API_URL}physical-persons/${employeeId}`,
                {
                    Accept: "application/json",
                }
            );
            if (response.status === 200) {
                setEmployeeData(response.data);
            }

            await Promise.all([
                getWorkload(),
                getPositions(),
                getYears(),
                getTypes(),
            ]);
        } catch (error) {
            if (error && error.status === 404) {
                navigate("/not-found", {
                    state: {
                        message: "Сотрудник не найден",
                        errorCode: 404,
                        additionalInfo: "",
                    },
                });
            }
        }
    };

    // Получение трудозатрат
    const personalWorkloadFilter = () => {
        if ("value" in selectedPersonalMonth) {
            const payload = {
                year: selectedPersonalYear,
                month: selectedPersonalMonth.value,
            };

            getData(
                `${
                    import.meta.env.VITE_API_URL
                }physical-persons/${employeeId}/personal-workload`,
                { params: payload }
            ).then((response) => {
                if (response.status === 200) {
                    setPersonalWorkload(response.data);
                    setWorkloads(response.data.workload);
                }
            });
        }
    };

    // Изменение процентов в блоке Трудозатраты
    const updateLoadPercentage = () => {
        const totalPercentage =
            workloads.reduce((sum, item) => sum + item.load_percentage, 0) +
            personalWorkload.other_workload;

        if (totalPercentage === 100) {
            if ("value" in selectedPersonalMonth) {
                query = toast.loading("Обновление", {
                    containerId: "employee",
                    position: "top-center",
                });

                const data = {
                    workloads: workloads,
                    year: +selectedPersonalYear,
                    month: +selectedPersonalMonth.value,
                    other_workload_percentage: personalWorkload.other_workload,
                };

                postData(
                    "PATCH",
                    `${
                        import.meta.env.VITE_API_URL
                    }physical-persons/${employeeId}/personal-workload`,
                    data
                )
                    .then((response) => {
                        if (response?.ok) {
                            personalWorkloadFilter();
                            getWorkloadSummary();
                            toast.update(query, {
                                render: "Успешно обновлено!",
                                type: "success",
                                containerId: "employee",
                                isLoading: false,
                                autoClose: 1200,
                                pauseOnFocusLoss: false,
                                pauseOnHover: false,
                                position: "top-center",
                            });
                        }
                    })
                    .catch((error) => {
                        toast.dismiss(query);
                        toast.error(error.message || "Ошибка при обновлении", {
                            containerId: "employee",
                            isLoading: false,
                            autoClose: 4000,
                            pauseOnFocusLoss: false,
                            pauseOnHover: false,
                            position: "top-center",
                        });
                    });
            }
        } else {
            toast.error("Сумма всех трудозатрат должна равняться 100%", {
                containerId: "employee",
                isLoading: false,
                autoClose: 4000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                position: "top-center",
            });
        }
    };

    // Получение списка подразделений
    const getDepartments = () => {
        getData(`${import.meta.env.VITE_API_URL}departments`).then(
            (response) => {
                if (response.status == 200) {
                    setDepartments(response.data.data);
                }
            }
        );
    };

    useEffect(() => {
        if (selectedPersonalYear && selectedPersonalMonth) {
            personalWorkloadFilter();
        }
    }, [selectedPersonalYear, selectedPersonalMonth]);

    useEffect(() => {
        if (dateRange[0] && dateRange[1]) {
            getWorkloadSummary();
        }
    }, [dateRange, selectedTypes]);

    useEffect(() => {
        if (datesData.length > 0) {
            setAvailablePersonalMonths(
                datesData
                    .find((item) => item.year === +selectedPersonalYear)
                    .months.map((month) => ({
                        value: month.number,
                        label: month.name,
                        isFull: month.is_full_workload,
                    }))
            );
            setSelectedPersonalMonth();
        }
    }, [selectedPersonalYear]);

    useEffect(() => {
        if (availablePersonalMonths.length > 0) {
            setSelectedPersonalMonth(availablePersonalMonths[0]);
        }
    }, [availablePersonalMonths]);

    useEffect(() => {
        getDepartments();
        getEmployee();
    }, []);

    useEffect(() => {
        if (employeeData?.is_active) {
            setEmployeeData((prev) => ({
                ...prev,
                dismissal_date: null,
            }));
        }
    }, [employeeData?.is_active]);

    useEffect(() => {
        if (!employeeData?.is_staff) {
            setEmployeeData((prev) => ({
                ...prev,
                dismissal_date: null,
                employment_date: null,
                is_active: true,
            }));
        }
    }, [employeeData?.is_staff]);

    return (
        <main className="page">
            <div className="pt-8 pb-15">
                <div
                    className="container flex flex-col min-h-full"
                    style={{ minHeight: "calc(100vh - 215px)" }}
                >
                    <ToastContainer containerId="employee" />

                    <div className="flex justify-between items-center gap-10">
                        <div className="flex items-center gap-3 justify-between flex-grow">
                            <div className="flex items-center gap-10">
                                <div className="text-3xl font-medium w-full">
                                    {employeeData.name}
                                </div>

                                <div className="flex items-center gap-3">
                                    {departments.length > 0 && (
                                        <select
                                            className="border-2 h-[32px] p-1 border-gray-300 min-w-[130px] cursor-pointer"
                                            value={employeeData.department_id}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    e,
                                                    "department_id"
                                                )
                                            }
                                            disabled={mode == "read"}
                                        >
                                            <option value="">
                                                Подразделение
                                            </option>
                                            {departments.map((item) => (
                                                <option
                                                    value={item.id}
                                                    key={item.id}
                                                >
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}

                                    <select
                                        className="border-2 h-[32px] p-1 border-gray-300 min-w-[120px] cursor-pointer"
                                        value={String(employeeData.is_staff)}
                                        onChange={(e) =>
                                            handleInputChange(e, "is_staff")
                                        }
                                        disabled={mode == "read"}
                                    >
                                        <option value="true">штатный</option>
                                        <option value="false">
                                            внештатный
                                        </option>
                                    </select>

                                    {employeeData.is_staff && (
                                        <select
                                            className="border-2 h-[32px] p-1 border-gray-300 min-w-[120px] cursor-pointer"
                                            value={String(
                                                employeeData.is_active
                                            )}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    e,
                                                    "is_active"
                                                )
                                            }
                                            disabled={mode == "read"}
                                        >
                                            <option value="true">
                                                работает
                                            </option>
                                            <option value="false">
                                                не работает
                                            </option>
                                        </select>
                                    )}
                                </div>
                            </div>

                            {mode === "edit" && (
                                <button
                                    type="button"
                                    className="update-icon"
                                    title="Обновить данные сотрудника"
                                    onClick={() => {
                                        handleSave();
                                    }}
                                ></button>
                            )}
                        </div>

                        <nav className="switch">
                            <div>
                                <input
                                    type="radio"
                                    name="mode"
                                    id="read_mode"
                                    onChange={() => {
                                        setMode("read");
                                    }}
                                    checked={mode === "read" ? true : false}
                                />
                                <label htmlFor="read_mode">Чтение</label>
                            </div>

                            <div>
                                <input
                                    type="radio"
                                    name="mode"
                                    id="edit_mode"
                                    onChange={() => setMode("edit")}
                                    checked={mode === "edit" ? true : false}
                                />
                                <label htmlFor="edit_mode">
                                    Редактирование
                                </label>
                            </div>
                        </nav>
                    </div>

                    <div className="grid grid-cols-3 mt-15 gap-10 flex-grow">
                        <div className="flex flex-col">
                            <div className="grid gap-5 mb-5">
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray-400">
                                        Должность
                                    </span>
                                    <select
                                        className="border-2 border-gray-300 p-1 h-[32px]"
                                        name="position_id"
                                        onChange={(e) =>
                                            handleInputChange(e, "position_id")
                                        }
                                        value={employeeData.position_id}
                                        disabled={mode == "read"}
                                    >
                                        <option value="">
                                            Выбрать должность
                                        </option>
                                        {positions.length > 0 &&
                                            positions.map((position) => (
                                                <option
                                                    key={position.id}
                                                    value={position.id}
                                                >
                                                    {position.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-4 justify-between">
                                    <div className="flex flex-col gap-2 justify-between">
                                        <span className="text-gray-400">
                                            Телефон
                                        </span>
                                        <div className="border-2 border-gray-300 p-1 h-[32px]">
                                            <IMaskInput
                                                mask={PhoneMask}
                                                className="w-full"
                                                name="phone"
                                                type="tel"
                                                inputMode="tel"
                                                onAccept={(value) =>
                                                    handleInputChange(
                                                        value || "",
                                                        "phone_number"
                                                    )
                                                }
                                                value={
                                                    employeeData.phone_number
                                                }
                                                placeholder="+7 999 999 99 99"
                                                disabled={mode == "read"}
                                            />

                                            {errors.phone_number && (
                                                <p className="text-red-500 text-sm mt-2">
                                                    Заполните телефон
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 justify-between">
                                        <span className="text-gray-400">
                                            Email
                                        </span>
                                        <div className="border-2 border-gray-300 p-1 h-[32px]">
                                            <input
                                                className="w-full"
                                                type="email"
                                                placeholder="mail@mail.ru"
                                                value={employeeData.email}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e,
                                                        "email"
                                                    )
                                                }
                                                disabled={mode == "read"}
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-sm mt-2">
                                                    Некорректный email
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 items-start gap-3">
                                        <div className="flex flex-col">
                                            <span className="block mb-2 text-gray-400">
                                                Дата приема
                                            </span>
                                            <DatePicker
                                                className={`border-2 border-gray-300 p-1 w-full h-[32px] transition ${
                                                    !employeeData.is_staff
                                                        ? "bg-gray-100"
                                                        : ""
                                                }`}
                                                selected={
                                                    employeeData.employment_date
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e,
                                                        "employment_date"
                                                    )
                                                }
                                                dateFormat="dd.MM.yyyy"
                                                disabled={
                                                    mode === "read" ||
                                                    !employeeData.is_staff
                                                }
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="block mb-2 text-gray-400">
                                                Дата увольнения
                                            </span>
                                            <DatePicker
                                                className={`border-2 border-gray-300 p-1 w-full h-[32px] transition ${
                                                    employeeData?.is_active ||
                                                    !employeeData.is_staff
                                                        ? "bg-gray-100"
                                                        : ""
                                                }`}
                                                selected={
                                                    employeeData.dismissal_date
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e,
                                                        "dismissal_date"
                                                    )
                                                }
                                                dateFormat="dd.MM.yyyy"
                                                disabled={
                                                    mode === "read" ||
                                                    employeeData?.is_active ||
                                                    !employeeData.is_staff
                                                }
                                            />

                                            {errors.dismissal_date && (
                                                <p className="text-red-500 text-sm mt-2">
                                                    Укажите дату увольнения
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 flex-grow">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">
                                        Текущая загрузка ({workload.length})
                                    </span>
                                </div>
                                <div className="border-2 border-gray-300 py-5 px-4 min-h-full flex-grow h-full max-h-[500px] overflow-x-hidden overflow-y-auto">
                                    <ul className="grid gap-5">
                                        {workload.length > 0 &&
                                            workload.map((item, index) => (
                                                <EmployeeWorkloadItem
                                                    key={index}
                                                    {...item}
                                                />
                                            ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex flex-col gap-2 flex-grow">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">
                                        Свод по трудозатратам
                                    </span>
                                </div>
                                <div className="border-2 border-gray-300 py-5 px-4 min-h-full flex-grow h-full max-h-[500px] overflow-x-hidden overflow-y-auto">
                                    <div className="grid grid-cols-1 items-start gap-4 mb-8">
                                        <div className="grid grid-cols-2 items-center gap-3">
                                            <div className="flex flex-col">
                                                <span className="block mb-2 text-gray-400">
                                                    Период
                                                </span>

                                                <DatePicker
                                                    className="border-2 border-gray-300 p-1 w-full h-[32px]"
                                                    selectsRange
                                                    startDate={startDate}
                                                    endDate={endDate}
                                                    onChange={(update) =>
                                                        setDateRange(update)
                                                    }
                                                    dateFormat="MM-yyyy"
                                                    placeholderText="мм.гггг - мм.гггг"
                                                    showMonthYearPicker
                                                    includeDates={allowedDates}
                                                    locale={ru}
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <span className="block mb-2 text-gray-400">
                                                    Типы отчётов
                                                </span>
                                                <Select
                                                    closeMenuOnSelect={false}
                                                    isMulti
                                                    name="colors"
                                                    options={reportTypes.map(
                                                        (type) => ({
                                                            value: type.id,
                                                            label: type.name,
                                                        })
                                                    )}
                                                    className="basic-multi-select min-w-[170px] min-h-[32px]"
                                                    classNamePrefix="select"
                                                    placeholder="Выбрать тип отчёта"
                                                    onChange={(
                                                        selectedOptions
                                                    ) => {
                                                        setSelecterTypes(
                                                            selectedOptions.map(
                                                                (option) =>
                                                                    option.value
                                                            )
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="block mb-2 text-gray-400">
                                            Свод по трудозатратам, часы
                                        </span>
                                        <ul className="grid gap-3">
                                            {workloadSummary?.length > 0 &&
                                                workloadSummary?.map((item) => (
                                                    <EmployeeWorkloadSummary
                                                        workloadSummaryMaxPercentage={
                                                            workloadSummaryMaxPercentage
                                                        }
                                                        key={item.uuid}
                                                        {...item}
                                                    />
                                                ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex flex-col gap-2 flex-grow">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">
                                        Трудозатраты
                                    </span>
                                    <span className="flex items-center justify-center border border-gray-300 text-gray-400 p-1 rounded-[50%] w-[18px] h-[18px]">
                                        ?
                                    </span>

                                    {mode == "edit" && (
                                        <button
                                            type="button"
                                            className="save-icon w-[20px] h-[20px]"
                                            onClick={() =>
                                                updateLoadPercentage()
                                            }
                                            title="Обновить запись"
                                        ></button>
                                    )}
                                </div>
                                <div className="border-2 border-gray-300 py-5 px-4 min-h-full flex-grow h-full max-h-[500px] overflow-x-hidden overflow-y-auto">
                                    <div className="grid grid-cols-2 items-center gap-3 mb-5">
                                        <div className="flex flex-col">
                                            <span className="block mb-2 text-gray-400">
                                                Год
                                            </span>
                                            <select
                                                className="border-2 h-[32px] p-1 border-gray-300 min-w-[170px] cursor-pointer"
                                                onChange={(e) =>
                                                    setSelectedPersonalYear(
                                                        e.target.value
                                                    )
                                                }
                                                value={selectedPersonalYear}
                                            >
                                                {availableYears.length > 0 &&
                                                    availableYears.map(
                                                        (item) => (
                                                            <option
                                                                value={item}
                                                                key={item}
                                                            >
                                                                {item}
                                                            </option>
                                                        )
                                                    )}
                                            </select>
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="block mb-2 text-gray-400">
                                                Месяц
                                            </span>
                                            <Select
                                                options={
                                                    availablePersonalMonths
                                                }
                                                styles={customStyles}
                                                placeholder="Выберите месяц"
                                                value={selectedPersonalMonth}
                                                onChange={(e) =>
                                                    setSelectedPersonalMonth(e)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <ul className="grid gap-3">
                                        <li className="grid items-center grid-cols-[45%_35%_15%] gap-3 text-gray-400">
                                            <span>Проект</span>
                                            <span>Отчет</span>
                                            <span>% времени</span>
                                        </li>

                                        {personalWorkload?.workload?.length >
                                            0 &&
                                            personalWorkload?.workload?.every(
                                                (item) => item !== null
                                            ) && (
                                                <>
                                                    {personalWorkload?.workload?.map(
                                                        (item) => (
                                                            <EmployeePersonalWorkloadItem
                                                                key={item?.id}
                                                                mode={mode}
                                                                props={item}
                                                                setWorkloads={
                                                                    setWorkloads
                                                                }
                                                            />
                                                        )
                                                    )}

                                                    {personalWorkload.other_workload !==
                                                        null && (
                                                        <li className="grid items-center grid-cols-[1fr_35%_15%] gap-3 mb-2">
                                                            <div className="text-lg">
                                                                Прочие задачи
                                                            </div>

                                                            <div></div>

                                                            <div className="flex items-center border-2 border-gray-300 p-1">
                                                                <input
                                                                    className="min-w-0"
                                                                    type="number"
                                                                    placeholder="0"
                                                                    max="100"
                                                                    min="0"
                                                                    value={
                                                                        personalWorkload.other_workload
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        const value =
                                                                            parseInt(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                10
                                                                            );
                                                                        if (
                                                                            value >=
                                                                                0 &&
                                                                            value <=
                                                                                100
                                                                        ) {
                                                                            setPersonalWorkload(
                                                                                (
                                                                                    prev
                                                                                ) => ({
                                                                                    ...prev,
                                                                                    ["other_workload"]:
                                                                                        value,
                                                                                })
                                                                            );
                                                                        }
                                                                    }}
                                                                    disabled={
                                                                        mode ==
                                                                        "read"
                                                                    }
                                                                />
                                                                %
                                                            </div>
                                                        </li>
                                                    )}

                                                    {/* {vacationWorkload !==
                                                        null && (
                                                        <li className="grid items-center grid-cols-[1fr_35%_15%] gap-3 mb-2">
                                                            <div className="text-lg">
                                                                Отпуск
                                                            </div>

                                                            <div></div>

                                                            <div className="flex items-center border-2 border-gray-300 p-1">
                                                                <input
                                                                    className="min-w-0"
                                                                    type="number"
                                                                    placeholder="0"
                                                                    max="100"
                                                                    min="0"
                                                                    value={
                                                                        vacationWorkload
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        const value =
                                                                            parseInt(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                10
                                                                            );
                                                                        if (
                                                                            value >=
                                                                                0 &&
                                                                            value <=
                                                                                100
                                                                        ) {
                                                                            setPersonalWorkload(
                                                                                (
                                                                                    prev
                                                                                ) => ({
                                                                                    ...prev,
                                                                                    vacation_workload:
                                                                                        value,
                                                                                })
                                                                            );
                                                                        }
                                                                    }}
                                                                    disabled={
                                                                        mode ==
                                                                        "read"
                                                                    }
                                                                />
                                                                %
                                                            </div>
                                                        </li>
                                                    )} */}

                                                    {personalWorkload?.total_workload !==
                                                        null && (
                                                        <li className="grid items-center border-t-2 border-b-2 border-gray-300 grid-cols-[1fr_15%] gap-3 py-2">
                                                            <div className="text-lg">
                                                                Итого
                                                            </div>

                                                            <div>
                                                                {
                                                                    personalWorkload?.total_workload
                                                                }
                                                                %
                                                            </div>
                                                        </li>
                                                    )}
                                                </>
                                            )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default EmployeeCard;
