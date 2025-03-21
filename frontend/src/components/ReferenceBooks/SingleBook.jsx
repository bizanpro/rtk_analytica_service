import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import getData from "../../utils/getData";
import postData from "../../utils/postData";
// import Select from "../Select";
import ReferenceItem from "./ReferenceItem";
import ReferenceItemExtended from "./ReferenceItemExtended";

const SingleBook = () => {
    const COLUMNS = {
        industries: [
            { label: "Наименование", key: "name" },
            { label: "Кол-во элементов", key: "projects_count" },
            { label: "Последнее изменение", key: "updated_at" },
            { label: "Автор измнения", key: "author" },
        ],
        types: [
            { label: "Сокращённое наименование", key: "short_name" },
            { label: "Полное наименование", key: "name" },
            { label: "Кол-во проектов", key: "reports_count" },
            { label: "Последнее изменение", key: "last_changes" },
            { label: "Автор измнения", key: "edit_author" },
        ],
        roles: [
            { label: "Наименование", key: "name" },
            { label: "Кол-во ролей в отчётах", key: "roles_count" },
            { label: "Последнее изменение", key: "last_changes" },
            { label: "Автор измнения", key: "edit_author" },
        ],
        banks: [
            { label: "Сокращённое наименование", key: "name" },
            { label: "Полное наименование", key: "full_name" },
            { label: "Кол-во проектов", key: "projects_count" },
            { label: "Последнее изменение", key: "updated_at" },
            { label: "Автор измнения", key: "author" },
        ],
        "responsible-persons": [
            { label: "Наименование контрагента", key: "contragent" },
            { label: "Проект", key: "project_name" },
            { label: "ФИО / должность", key: "responsible_persons" },
        ],
        "creditor-responsible-persons": [
            { label: "Банк", key: "" },
            { label: "Контакт", key: "" },
            { label: "Проект", key: "" },
        ],
    };

    const TITLES = {
        industries: "Отрасли проектов",
        types: "Типы услуг / отчетов",
        roles: "Роли в проектах",
        banks: "Кредиторы",
        "responsible-persons": "Контакты заказчика",
        "creditor-responsible-persons": "Контакты кредитора",
    };

    const { bookId } = useParams();

    const columns = bookId ? COLUMNS[bookId] : COLUMNS;

    const URL = `${import.meta.env.VITE_API_URL}${bookId ? bookId : "books"}`;

    const [booksItems, setBooksItems] = useState([]);
    const [mode, setMode] = useState("edit");
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

    const addNewElement = () => {
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

    const editElement = (id) => {
        const data = booksItems.find((book) => book.id === id);
        delete data?.projects_count;
        delete data?.updated_at;

        postData("PATCH", URL, data).then((response) => {
            if (response) {
                alert("Запись обновлена");
            }
        });
    };

    const deleteElement = (id) => {
        postData("DELETE", `${URL}/${id}`, {}).then((response) => {
            if (response) {
                setBooksItems((booksItems) =>
                    booksItems.filter((item) => item.id !== id)
                );
            }
        });
    };

    const getBooks = () => {
        getData(URL, { Accept: "application/json" })
            .then((response) => {
                setBooksItems(response.data.data);
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        getBooks();
    }, []);

    return (
        <main className="page">
            <div className="container py-8">
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
                            {isLoading ? (
                                <tr>
                                    <td className="text-base px-4 py-2">
                                        Загрузка...
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {mode === "edit" && (
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
                                                                onChange={(e) =>
                                                                    handleNewElementInputChange(
                                                                        e,
                                                                        key
                                                                    )
                                                                }
                                                            />
                                                            <span className="edit-icon"></span>

                                                            {key === "name" && (
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
                                                            )}
                                                        </div>
                                                    ) : (
                                                        "—"
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    )}

                                    {filteredProjects?.length > 0 &&
                                        bookId !==
                                            "creditor-responsible-persons" &&
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
                                        bookId ==
                                            "creditor-responsible-persons" &&
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
