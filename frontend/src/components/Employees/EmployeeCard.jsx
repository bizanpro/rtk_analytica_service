import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getData from "../../utils/getData";
import postData from "../../utils/postData";

import { IMaskInput } from "react-imask";
import { ToastContainer, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import Select from "react-select";

import EmployeeWorkloadItem from "./EmployeeWorkloadItem";
import EmployeePersonalWorkloadItem from "./EmployeePersonalWorkloadItem";

import "react-toastify/dist/ReactToastify.css";

const EmployeeCard = () => {
    const { employeeId } = useParams();
    const [employeeData, setEmployeeData] = useState({});
    const [workload, setworkload] = useState({});
    const [personalWorkload, setPersonalWorkload] = useState({});
    const [mode, setMode] = useState("read");
    const [errors, setErrors] = useState({});
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("1");

    const PhoneMask = "+{7} (000) 000 00 00";

    let query;

    const options = [
        { value: "0", label: "ФТА" },
        { value: "1", label: "ФТМ" },
        { value: "2", label: "ФМ" },
        { value: "3", label: "ИЗ" },
    ];

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSave = () => {
        const newErrors = {
            phone_number: !employeeData.phone_number,
            email: !employeeData.email || !validateEmail(employeeData.email),
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some((err) => err)) return;

        updateEmployee();
    };

    const handleInputChange = (e, name) => {
        const value =
            name === "phone_number"
                ? e
                : name === "is_staff" || name === "is_active"
                ? JSON.parse(e.target.value)
                : e.target.value;

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

    const getYears = () => {
        getData(`${import.meta.env.VITE_API_URL}available-years`).then(
            (response) => {
                if (response.status == 200) {
                    setAvailableYears(response.data);
                    setSelectedYear(response.data[response.data.length - 1]);
                }
            }
        );
    };

    const updateEmployee = () => {
        query = toast.loading("Обновление", {
            containerId: "employee",
            position: "top-center",
        });

        postData(
            "PATCH",
            `${import.meta.env.VITE_API_URL}physical-persons/${employeeId}`,
            employeeData
        ).then((response) => {
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
                toast.error("Ошибка обновления данных", {
                    isLoading: false,
                    autoClose: 1500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                });
            }
        });
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

            await Promise.all([getWorkload(), getYears()]);
        } catch (error) {
            console.error("Ошибка при загрузке сотрудника:", error);
        }
    };

    const personalWorkloadFilter = () => {
        const payload = {
            year: selectedYear,
            month: selectedMonth,
        };

        getData(
            `${
                import.meta.env.VITE_API_URL
            }physical-persons/${employeeId}/personal-workload`,
            { params: payload }
        ).then((response) => {
            if (response.status === 200) {
                setPersonalWorkload(response.data);
            }
        });
    };

    useEffect(() => {
        if (selectedYear && selectedMonth) {
            personalWorkloadFilter();
        }
    }, [selectedYear, selectedMonth]);

    useEffect(() => {
        getEmployee();
    }, []);

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
                                    <select
                                        className="border-2 h-[32px] p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                        value={String(employeeData.is_staff)}
                                        onChange={(e) =>
                                            handleInputChange(e, "is_staff")
                                        }
                                        disabled={mode == "read" ? true : false}
                                    >
                                        <option value="true">штатный</option>
                                        <option value="false">
                                            внештатный
                                        </option>
                                    </select>

                                    <select
                                        className="border-2 h-[32px] p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                        value={String(employeeData.is_active)}
                                        onChange={(e) =>
                                            handleInputChange(e, "is_active")
                                        }
                                        disabled={mode == "read" ? true : false}
                                    >
                                        <option value="true">работает</option>
                                        <option value="false">
                                            не работает
                                        </option>
                                    </select>
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
                            <div className="grid grid-cols-2 gap-5 mb-5">
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray-400">
                                        Квалификация
                                    </span>
                                    <textarea
                                        className="border-2 border-gray-300 p-5 h-[100px]"
                                        style={{ resize: "none" }}
                                        placeholder="Заполните квалификацию"
                                        type="text"
                                        name="qualification"
                                        onChange={(e) =>
                                            handleInputChange(
                                                e,
                                                "qualification"
                                            )
                                        }
                                        value={employeeData.qualification}
                                        disabled={mode == "read" ? true : false}
                                    ></textarea>
                                </div>

                                <div className="flex flex-col gap-2 justify-between">
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
                                                disabled={
                                                    mode == "read"
                                                        ? true
                                                        : false
                                                }
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
                                                disabled={
                                                    mode == "read"
                                                        ? true
                                                        : false
                                                }
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-sm mt-2">
                                                    Некорректный email
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
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="flex flex-col">
                                            <span className="block mb-2 text-gray-400">
                                                Период
                                            </span>
                                            <DatePicker
                                                className="border-2 border-gray-300 p-1 w-full h-[32px]"
                                                selected={new Date()}
                                                startDate={new Date()}
                                                endDate={new Date()}
                                                onChange={new Date()}
                                                dateFormat="dd.MM.yyyy"
                                                selectsRange
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="block mb-2 text-gray-400">
                                                Типы отчётов
                                            </span>
                                            <Select
                                                closeMenuOnSelect={false}
                                                defaultValue={[options[0]]}
                                                isMulti
                                                name="colors"
                                                options={options}
                                                className="basic-multi-select min-w-[170px] h-[32px]"
                                                classNamePrefix="select"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="block mb-2 text-gray-400">
                                            Свод по трудозатратам, часы
                                        </span>
                                        <ul className="grid gap-3">
                                            <li className="flex items-center gap-3">
                                                <div className="flex items-center justify-center text-lg border border-gray-300 h-[50px] w-[50px]">
                                                    {50}%
                                                </div>

                                                <div className="flex-grow">
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-lg">
                                                            ГОК Светловский
                                                        </div>

                                                        <span className="text-gray-400">
                                                            Золотодобыча
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="relative h-[20px] w-full overflow-hidden text-center flex items-center justify-start
                                                px-1"
                                                    >
                                                        <div className="min-w-min whitespace-nowrap">
                                                            50
                                                        </div>

                                                        <div
                                                            className="absolute top-0 left-0 bottom-0 h-full bg-gray-200 transition-all opacity-60 z-[-1]"
                                                            style={{
                                                                width: `${50}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <div className="flex items-center justify-center text-lg border border-gray-300 h-[50px] w-[50px]">
                                                    {85}%
                                                </div>

                                                <div className="flex-grow">
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-lg">
                                                            ГОК Светловский
                                                        </div>

                                                        <span className="text-gray-400">
                                                            Золотодобыча
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="relative h-[20px] w-full overflow-hidden text-center flex items-center justify-start
                                                px-1"
                                                    >
                                                        <div className="min-w-min whitespace-nowrap">
                                                            50
                                                        </div>

                                                        <div
                                                            className="absolute top-0 left-0 bottom-0 h-full bg-gray-200 transition-all opacity-60 z-[-1]"
                                                            style={{
                                                                width: `${85}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <div className="flex items-center justify-center text-lg border border-gray-300 h-[50px] w-[50px]">
                                                    {100}%
                                                </div>

                                                <div className="flex-grow">
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-lg">
                                                            ГОК Светловский
                                                        </div>

                                                        <span className="text-gray-400">
                                                            Золотодобыча
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="relative h-[20px] w-full overflow-hidden text-center flex items-center justify-start
                                                px-1"
                                                    >
                                                        <div className="min-w-min whitespace-nowrap">
                                                            50
                                                        </div>

                                                        <div
                                                            className="absolute top-0 left-0 bottom-0 h-full bg-gray-200 transition-all opacity-60 z-[-1]"
                                                            style={{
                                                                width: `${100}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </li>
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
                                </div>
                                <div className="border-2 border-gray-300 py-5 px-4 min-h-full flex-grow h-full max-h-[500px] overflow-x-hidden overflow-y-auto">
                                    <div className="grid grid-cols-2 items-center gap-3 mb-5">
                                        <select
                                            className="border-2 h-[32px] p-1 border border-gray-300 min-w-[170px] cursor-pointer"
                                            onChange={(e) =>
                                                setSelectedYear(e.target.value)
                                            }
                                            value={selectedYear}
                                        >
                                            {availableYears.length > 0 &&
                                                availableYears.map((item) => (
                                                    <option
                                                        value={item}
                                                        key={item}
                                                    >
                                                        {item}
                                                    </option>
                                                ))}
                                        </select>

                                        <select
                                            className="border-2 h-[32px] p-1 border border-gray-300 min-w-[170px] cursor-pointer"
                                            onChange={(e) =>
                                                setSelectedMonth(e.target.value)
                                            }
                                        >
                                            {[
                                                "Январь",
                                                "Февраль",
                                                "Март",
                                                "Апрель",
                                                "Май",
                                                "Июнь",
                                                "Июль",
                                                "Август",
                                                "Сентябрь",
                                                "Октябрь",
                                                "Ноябрь",
                                                "Декабрь",
                                            ].map((month, index) => (
                                                <option
                                                    value={index + 1}
                                                    key={index}
                                                >
                                                    {month}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <ul className="grid gap-3">
                                        <li className="grid items-center grid-cols-[45%_35%_15%] gap-3 text-gray-400">
                                            <span>Проект</span>
                                            <span>Отчет</span>
                                            <span>% времени</span>
                                        </li>

                                        {personalWorkload.length > 0 && (
                                            <>
                                                {personalWorkload.map(
                                                    (item, index) => (
                                                        <EmployeePersonalWorkloadItem
                                                            key={index}
                                                            employeeId={
                                                                employeeId
                                                            }
                                                            mode={mode}
                                                            props={item}
                                                        />
                                                    )
                                                )}

                                                <li className="grid items-center grid-cols-[1fr_15%] gap-3 mb-2">
                                                    <div className="text-lg">
                                                        Прочие задачи
                                                    </div>

                                                    <div className="flex items-center border-2 border-gray-300 p-1">
                                                        <input
                                                            className="min-w-0"
                                                            type="number"
                                                            placeholder="0"
                                                            max="100"
                                                            min="0"
                                                            defaultValue={0}
                                                        />
                                                        %
                                                    </div>
                                                </li>

                                                <li className="grid items-center border-t-2 border-b-2 border-gray-300 grid-cols-[1fr_15%] gap-3 py-2">
                                                    <div className="text-lg">
                                                        Итого
                                                    </div>

                                                    <div>0%</div>
                                                </li>
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
