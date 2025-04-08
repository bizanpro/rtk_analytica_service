import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getData from "../../utils/getData";

import { IMaskInput } from "react-imask";
import DatePicker from "react-datepicker";

const EmployeeCard = () => {
    const { employeeId } = useParams();
    const [employeeData, setEmployeeData] = useState({});
    const [mode, setMode] = useState("read");

    const PhoneMask = "+{7}(000) 000 00 00";

    useEffect(() => {
        getData(
            `${import.meta.env.VITE_API_URL}physical-persons/${employeeId}`
        ).then((response) => {
            if (response.status == 200) {
                setEmployeeData(response.data);
            }
        });
        // .finally(() => setIsLoading(false));
    }, []);

    return (
        <main className="page">
            <div className="pt-8 pb-15">
                <div
                    className="container flex flex-col min-h-full"
                    style={{ minHeight: "calc(100vh - 135px)" }}
                >
                    <div className="flex justify-between items-center gap-10">
                        <div className="flex items-center gap-3 justify-between flex-grow">
                            <div className="flex items-center gap-10">
                                <div className="text-3xl font-medium w-full">
                                    {employeeData.name}
                                </div>

                                <div className="flex items-center gap-3">
                                    <select
                                        className="border-2 h-[32px] p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                        name=""
                                        defaultValue={employeeData.is_staff}
                                    >
                                        <option value="true">штатный</option>
                                        <option value="false">
                                            внештатный
                                        </option>
                                    </select>

                                    <select
                                        className="border-2 h-[32px] p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                        name=""
                                        defaultValue={employeeData.is_active}
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
                                    onClick={() => {}}
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
                                        defaultValue={
                                            employeeData.qualification
                                        }
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
                                                value={
                                                    employeeData.phone_number
                                                }
                                                placeholder="+7 999 999 99 99"
                                            />
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
                                            />
                                            {/* {errors.email && (
                                                <p className="text-red-500 text-sm">
                                                    Некорректный email
                                                </p>
                                            )} */}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 flex-grow">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">
                                        Текущая загрузка (10)
                                    </span>
                                </div>
                                <div className="border-2 border-gray-300 py-5 px-4 min-h-full flex-grow h-full max-h-[500px] overflow-x-hidden overflow-y-auto">
                                    <ul className="grid gap-5">
                                        <li className="grid items-stretch grid-cols-4 gap-4">
                                            <div className="flex flex-col justify-between gap-2 min-w-[140px]">
                                                <div className="text-lg">
                                                    ГОК Светловский
                                                </div>

                                                <span className="text-gray-400">
                                                    Золотодобыча
                                                </span>
                                            </div>

                                            <div className="flex flex-col justify-between gap-2">
                                                <div className="text-lg">
                                                    ФТА 1
                                                </div>
                                                <span className="text-xs">
                                                    01.01.2025 - 31.12.2025
                                                </span>
                                            </div>
                                            <div className="flex flex-col justify-between items-center gap-2">
                                                <div className="relative h-[20px] w-full border border-gray-200 overflow-hidden text-center flex items-center justify-center">
                                                    <div className="min-w-min whitespace-nowrap">
                                                        {85}%
                                                    </div>

                                                    <div
                                                        className="absolute top-0 left-0 bottom-0 h-full bg-gray-200 transition-all opacity-60 z-[-1]"
                                                        style={{
                                                            width: `${85}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs">
                                                    01.01.2025 - 31.12.2025
                                                </span>
                                            </div>
                                            <div className="leading-6">
                                                Руководитель проекта
                                            </div>
                                        </li>
                                        <li className="grid items-stretch grid-cols-4 gap-4">
                                            <div className="flex flex-col justify-between gap-2 min-w-[140px]">
                                                <div className="text-lg">
                                                    ГОК Светловский
                                                </div>

                                                <span className="text-gray-400">
                                                    Золотодобыча
                                                </span>
                                            </div>

                                            <div className="flex flex-col justify-between gap-2">
                                                <div className="text-lg">
                                                    ФТА 1
                                                </div>
                                                <span className="text-xs">
                                                    01.01.2025 - 31.12.2025
                                                </span>
                                            </div>
                                            <div className="flex flex-col justify-between items-center gap-2">
                                                <div className="relative h-[20px] w-full border border-gray-200 overflow-hidden text-center flex items-center justify-center">
                                                    <div className="min-w-min whitespace-nowrap">
                                                        {85}%
                                                    </div>

                                                    <div
                                                        className="absolute top-0 left-0 bottom-0 h-full bg-gray-200 transition-all opacity-60 z-[-1]"
                                                        style={{
                                                            width: `${85}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs">
                                                    01.01.2025 - 31.12.2025
                                                </span>
                                            </div>
                                            <div className="leading-6">
                                                Руководитель проекта
                                            </div>
                                        </li>
                                        <li className="grid items-stretch grid-cols-4 gap-4">
                                            <div className="flex flex-col justify-between gap-2 min-w-[140px]">
                                                <div className="text-lg">
                                                    ГОК Светловский
                                                </div>

                                                <span className="text-gray-400">
                                                    Золотодобыча
                                                </span>
                                            </div>

                                            <div className="flex flex-col justify-between gap-2">
                                                <div className="text-lg">
                                                    ФТА 1
                                                </div>
                                                <span className="text-xs">
                                                    01.01.2025 - 31.12.2025
                                                </span>
                                            </div>
                                            <div className="flex flex-col justify-between items-center gap-2">
                                                <div className="relative h-[20px] w-full border border-gray-200 overflow-hidden text-center flex items-center justify-center">
                                                    <div className="min-w-min whitespace-nowrap">
                                                        {85}%
                                                    </div>

                                                    <div
                                                        className="absolute top-0 left-0 bottom-0 h-full bg-gray-200 transition-all opacity-60 z-[-1]"
                                                        style={{
                                                            width: `${85}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs">
                                                    01.01.2025 - 31.12.2025
                                                </span>
                                            </div>
                                            <div className="leading-6">
                                                Руководитель проекта
                                            </div>
                                        </li>
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
                                    <div className="flex mb-10">
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
                                                disabled={
                                                    mode === "read"
                                                        ? true
                                                        : false
                                                }
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
                                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[14px] h-[14px]">
                                        ?
                                    </span>
                                </div>
                                <div className="border-2 border-gray-300 py-5 px-4 min-h-full flex-grow h-full max-h-[500px] overflow-x-hidden overflow-y-auto">
                                    <ul className="grid gap-3">
                                        <li className="grid items-center grid-cols-[25%_18%_25%_18%] gap-3 mb-2 text-gray-400"></li>
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
