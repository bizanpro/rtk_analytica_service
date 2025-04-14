import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import getData from "../../utils/getData";
import postData from "../../utils/postData";
// import Select from "../Select";
import ReferenceItem from "./ReferenceItem";
import ReferenceItemExtended from "./ReferenceItemExtended";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SingleBook = () => {
    const COLUMNS = {
        industries: [
            { label: "Наименование", key: "name" },
            { label: "Кол-во элементов", key: "projects_count" },
            { label: "Последнее изменение", key: "updated_at" },
            { label: "Автор измнения", key: "author" },
        ],
        "report-types": [
            { label: "Сокращённое наименование", key: "name" },
            { label: "Полное наименование", key: "full_name" },
            { label: "Кол-во проектов", key: "projects_count" },
            { label: "Последнее изменение", key: "updated_at" },
            { label: "Автор измнения", key: "author" },
        ],
        roles: [
            { label: "Наименование", key: "name" },
            { label: "Кол-во ролей в отчётах", key: "reports_count" },
            { label: "Последнее изменение", key: "updated_at" },
            { label: "Автор измнения", key: "author" },
        ],
        banks: [
            { label: "Сокращённое наименование", key: "name" },
            { label: "Полное наименование", key: "full_name" },
            { label: "Кол-во проектов", key: "projects_count" },
            { label: "Последнее изменение", key: "updated_at" },
            { label: "Автор измнения", key: "author" },
        ],
        contragent: [
            { label: "Наименование контрагента", key: "contragent" },
            { label: "Проект", key: "project_name" },
            { label: "ФИО / должность", key: "responsible_persons" },
        ],
        creditor: [
            { label: "Банк", key: "" },
            { label: "Контакт", key: "" },
            { label: "Проект", key: "" },
        ],
        "working-hours": [
            { label: "Месяц", key: "month_name" },
            { label: "Часы", key: "hours" },
        ],
    };

    const TITLES = {
        industries: "Отрасли проектов",
        "report-types": "Типы услуг / отчетов",
        roles: "Роли в проектах",
        banks: "Кредиторы",
        contragent: "Контакты заказчика",
        creditor: "Контакты кредитора",
        "working-hours": "Рабочие часы",
    };

    const { bookId } = useParams();

    const columns = bookId ? COLUMNS[bookId] : COLUMNS;

    const URL =
        bookId === "creditor" || bookId === "contragent"
            ? `${import.meta.env.VITE_API_URL}responsible-persons/${bookId}`
            : `${import.meta.env.VITE_API_URL}${bookId ? bookId : "books"}`;

    const [booksItems, setBooksItems] = useState([]);
    const [mode, setMode] = useState("read");
    const [formFields, setFormFields] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const [selectedCounterpartyName, setSelectedCounterpartyName] =
        useState("");

    const filteredProjects = useMemo(() => {
        const result = booksItems?.filter((book) => {
            return selectedCounterpartyName &&
                selectedCounterpartyName !== "default"
                ? book.role === selectedCounterpartyName
                : true;
            //     &&
            // (selectedBank && selectedBank !== "default"
            //     ? Array.isArray(book.credit_manager_bank_name)
            //         ? book.credit_manager_bank_name.includes(selectedBank)
            //         : book.credit_manager_bank_name === selectedBank
            //     : true)
        });
        return result;
    }, [booksItems, selectedCounterpartyName]);

    // const sectorOptions = useMemo(() => {
    //     if (bookId != "contacts") return;
    //     const allSectors = booksItems.flatMap((item) => item.counterparty_name);
    //     return Array.from(new Set(allSectors));
    // }, [booksItems]);

    let query;

    const handleNewElementInputChange = (e, name) => {
        setFormFields({ ...formFields, [name]: e.target.value });
    };

    const handleInputChange = (e, name, id) => {
        setBooksItems((prevBooksItems) =>
            prevBooksItems.map((item) =>
                item.id === id ? { ...item, [name]: e.target.value } : item
            )
        );
    };

    // Добавление записи
    const addNewElement = () => {
        if (
            !formFields.name ||
            ((bookId === "report-types" || bookId === "banks") &&
                !formFields.full_name)
        ) {
            alert(
                bookId === "report-types" || bookId === "banks"
                    ? "'Полное наименование' должно быть заполнено."
                    : "'Наименование' должно быть заполнено."
            );
            return;
        }

        postData("POST", URL, formFields).then((response) => {
            if (response) {
                setFormFields((prev) => ({
                    ...prev,
                    name: "",
                    counterparty_name: "",
                    full_name: "",
                }));
                setBooksItems((booksItems) => [...booksItems, response]);
            }
        });
    };

    // Изменение записи
    const editElement = (id) => {
        const data = booksItems.find((book) => book.id === id);
        delete data?.projects_count;
        delete data?.updated_at;

        if (
            !data.name ||
            ((bookId === "report-types" || bookId === "banks") &&
                !data.full_name)
        ) {
            alert(
                bookId === "report-types" || bookId === "banks"
                    ? "Полное и сокращенное наименования должны быть заполнены."
                    : "'Наименование' должно быть заполнено."
            );
            return;
        }

        query = toast.loading("Обновление", {
            containerId: "singleBook",
            position: "top-center",
        });

        postData("PATCH", URL, data).then((response) => {
            if (response?.ok) {
                toast.update(query, {
                    render: "Запись обновлена",
                    type: "success",
                    containerId: "singleBook",
                    isLoading: false,
                    autoClose: 1200,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                });
            } else {
                toast.dismiss(query);
                toast.error("Ошибка обновления записи", {
                    isLoading: false,
                    autoClose: 1500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                });
            }
        });
    };

    // Удаление записи
    const deleteElement = (id) => {
        postData("DELETE", `${URL}/${id}`, {}).then((response) => {
            if (response) {
                setBooksItems((booksItems) =>
                    booksItems.filter((item) => item.id !== id)
                );
            }
        });
    };

    // Получение списка записей
    const getBooks = () => {
        getData(URL, { Accept: "application/json" })
            .then((response) => {
                if (response.status == 200) {
                    setBooksItems(response.data.data);
                }
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        getBooks();
    }, []);

    return (
        <main className="page">
            <div className="container py-8">
                <ToastContainer containerId="singleBook" />

                <div className="flex justify-between items-center gap-6 mb-8">
                    <h1 className="text-3xl font-medium">
                        {TITLES[bookId]} ({booksItems?.length})
                    </h1>

                    <div className="flex items-center gap-6">
                        {/* {bookId === "contacts" && (
                            <>
                                <Select
                                    className={
                                        "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                    }
                                    title={"Контрагент"}
                                    items={sectorOptions}
                                    onChange={(evt) => {
                                        setSelectedCounterpartyName(
                                            evt.target.value
                                        );
                                    }}
                                />

                                <Select
                                    className={
                                        "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                    }
                                    title={"Банк"}
                                    items={bankOptions}
                                    onChange={(evt) =>
                                        setSelectedBank(evt.target.value)
                                    }
                                />
                            </>
                        )} */}

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
                </div>

                <div className="overflow-x-auto w-full pb-5">
                    <table className="table-auto w-full border-collapse border-gray-300 text-sm">
                        <thead className="text-gray-400 text-left">
                            <tr className="border-b border-gray-300">
                                {COLUMNS[bookId].map(({ label, key }) => (
                                    <th
                                        className="text-base px-4 py-2 min-w-[180px]"
                                        rowSpan="2"
                                        key={key}
                                    >
                                        {label}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td className="text-base px-4 py-2">
                                        Загрузка...
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {mode === "edit" &&
                                        bookId != "creditor" &&
                                        bookId != "contragent" && (
                                            <tr className="border-gray-300 text-base border-b text-left">
                                                {columns.map(({ key }) => (
                                                    <td
                                                        key={key}
                                                        className="px-4 py-7 min-w-[180px] max-w-[200px]"
                                                    >
                                                        {key === "name" ||
                                                        key ===
                                                            "counterparty_name" ||
                                                        key === "full_name" ? (
                                                            <div
                                                                key={key}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <input
                                                                    type="text"
                                                                    className="w-full"
                                                                    placeholder="Новый элемент"
                                                                    name={key}
                                                                    value={
                                                                        formFields[
                                                                            key
                                                                        ] || ""
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleNewElementInputChange(
                                                                            e,
                                                                            key
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        ) : (
                                                            "—"
                                                        )}
                                                    </td>
                                                ))}
                                                <td className="px-4 py-7 min-w-[50px] text-center">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <button
                                                            type="button"
                                                            className="save-icon"
                                                            style={{
                                                                opacity:
                                                                    formFields
                                                                        .name
                                                                        ?.length >
                                                                    1
                                                                        ? 1
                                                                        : 0,
                                                            }}
                                                            onClick={
                                                                addNewElement
                                                            }
                                                        ></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}

                                    {filteredProjects?.length > 0 &&
                                        bookId !== "creditor" &&
                                        filteredProjects.map((item) => (
                                            <ReferenceItem
                                                key={item.id}
                                                data={item}
                                                columns={columns}
                                                mode={mode}
                                                bookId={bookId}
                                                handleInputChange={
                                                    handleInputChange
                                                }
                                                deleteElement={deleteElement}
                                                editElement={editElement}
                                            />
                                        ))}

                                    {filteredProjects?.length > 0 &&
                                        bookId == "creditor" &&
                                        filteredProjects.map((item) => (
                                            <ReferenceItemExtended
                                                key={item.id}
                                                data={item}
                                                columns={columns}
                                                mode={mode}
                                                bookId={bookId}
                                                handleInputChange={
                                                    handleInputChange
                                                }
                                                deleteElement={deleteElement}
                                                editElement={editElement}
                                            />
                                        ))}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default SingleBook;
