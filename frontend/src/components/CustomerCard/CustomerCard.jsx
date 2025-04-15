import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getData from "../../utils/getData";
import postData from "../../utils/postData";

import { ToastContainer, toast } from "react-toastify";

import FilledExecutorBlock from "../ExecutorBlock/FilledExecutorBlock";
import ProjectStatisticsBlock from "../ProjectCard/ProjectStatisticsBlock";

import "react-toastify/dist/ReactToastify.css";

const CustomerCard = () => {
    const { employeeId } = useParams();
    const [employeeData, setEmployeeData] = useState({});
    const [workload, setworkload] = useState({});
    const [personalWorkload, setPersonalWorkload] = useState([]);
    const [mode, setMode] = useState("read");
    const [errors, setErrors] = useState({});
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("1");

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
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl font-medium w-full">
                                        {employeeData.name}ООО "СГРК"
                                    </div>

                                    <span className="text-green-500">
                                        активный
                                    </span>
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
                                        Адрес центрального офиса
                                    </span>
                                    <textarea
                                        className="border-2 border-gray-300 p-5 h-[100px]"
                                        style={{ resize: "none" }}
                                        placeholder="Заполните адрес центрального офиса"
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
                                    <span className="text-gray-400">
                                        Сайт компании
                                    </span>
                                    <div className="border-2 border-gray-300 p-1 h-[32px]">
                                        <input
                                            className="w-full"
                                            type="text"
                                            placeholder=""
                                            value={employeeData.email}
                                            onChange={(e) =>
                                                handleInputChange(e, "email")
                                            }
                                            disabled={
                                                mode == "read" ? true : false
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 flex-grow">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">
                                            Ключевые лица Заказчика
                                        </span>
                                    </div>

                                    <div className="border-2 border-gray-300 py-5 px-2 min-h-full flex-grow h-full max-h-[500px] overflow-x-hidden overflow-y-auto">
                                        <ul className="grid gap-5">
                                            <FilledExecutorBlock
                                            // key={customer.id}
                                            // contanct={customer}
                                            />
                                            <FilledExecutorBlock
                                            // key={customer.id}
                                            // contanct={customer}
                                            />
                                            <FilledExecutorBlock
                                            // key={customer.id}
                                            // contanct={customer}
                                            />
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex flex-col gap-2">
                                <span className="text-gray-400">
                                    Краткое описание
                                </span>
                                <textarea
                                    className="border-2 border-gray-300 p-5 min-h-[170px] max-h-[170px]"
                                    style={{ resize: "none" }}
                                    placeholder="Заполните описание"
                                    type="text"
                                    name="description"
                                    disabled={mode == "read" ? true : false}
                                    // value={projectData?.description || ""}
                                    // onChange={(e) =>
                                    //     handleInputChange(e, "description")
                                    // }
                                />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <ProjectStatisticsBlock />

                            <div className="flex flex-col gap-2 flex-grow">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">
                                        История проекта
                                    </span>

                                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                        ?
                                    </span>
                                    {mode == "edit" && (
                                        <button
                                            type="button"
                                            className="add-button"
                                            onClick={() =>
                                                setReportWindowsState(true)
                                            }
                                            disabled={
                                                projectData.contragent_id
                                                    ? false
                                                    : true
                                            }
                                            title={
                                                projectData.contragent_id
                                                    ? "Открыть конструктор отчёта"
                                                    : "Необходимо назначить заказчика"
                                            }
                                        >
                                            <span></span>
                                        </button>
                                    )}
                                </div>

                                <div className="border-2 border-gray-300 py-5 px-4 min-h-full flex-grow max-h-[300px] overflow-x-hidden overflow-y-auto">
                                    {!reportWindowsState ? (
                                        <ul className="grid gap-3">
                                            <li className="grid items-center grid-cols-[25%_18%_25%_18%] gap-3 mb-2 text-gray-400">
                                                <span>Отчет</span>
                                                <span>Статус</span>
                                                <span>Период выполнения</span>
                                                <span>Общая оценка</span>
                                            </li>

                                            {reports.length > 0 &&
                                                reports.map((report, index) => (
                                                    <ProjectReportItem
                                                        key={report.id || index}
                                                        {...report}
                                                        setReportEditorState={
                                                            setReportEditorState
                                                        }
                                                        setReportEditorName={
                                                            setReportEditorName
                                                        }
                                                        deleteReport={
                                                            deleteReport
                                                        }
                                                        openReportEditor={
                                                            openReportEditor
                                                        }
                                                        openSubReportEditor={
                                                            openSubReportEditor
                                                        }
                                                        mode={mode}
                                                    />
                                                ))}
                                        </ul>
                                    ) : (
                                        <ProjectReportWindow
                                            reportWindowsState={
                                                setReportWindowsState
                                            }
                                            sendReport={sendReport}
                                            contracts={contracts}
                                            updateReport={updateReport}
                                            reportId={reportId}
                                            setReportId={setReportId}
                                            mode={mode}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CustomerCard;
