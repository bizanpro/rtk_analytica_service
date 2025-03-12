import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import getData from "../../utils/getData";
import postData from "../../utils/postData";
import Select from "../Select";
import ReferenceItem from "./ReferenceItem";

const SingleBook = () => {
    const COLUMNS = {
        industries: [
            { label: "Наименование", key: "name" },
            { label: "Кол-во элементов", key: "totalCount" },
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
        creditors: [
            { label: "Сокращённое наименование", key: "short_name" },
            { label: "Полное наименование", key: "name" },
            { label: "Кол-во проектов", key: "projects_count" },
            { label: "Последнее изменение", key: "last_changes" },
            { label: "Автор измнения", key: "edit_author" },
        ],
        contacts: [
            { label: "Наименование контрагента", key: "counterparty_name" },
            { label: "Тип контрагента", key: "counterparty_type" },
            { label: "ФИО / должность", key: "counterparty_info" },
            { label: "Кол-во проектов", key: "projects_count" },
            { label: "Контакты", key: "counterparty_contacts" },
            { label: "Последнее изменение", key: "last_changes" },
            { label: "Автор измнения", key: "edit_author" },
        ],
    };

    const TITLES = {
        industries: "Отрасли проектов",
        types: "Типы услуг / отчетов",
        roles: "Роли в проектах",
        creditors: "Кредиторы",
        contacts: "Контакты",
    };

    const { bookId } = useParams();

    const columns = bookId ? COLUMNS[bookId] : COLUMNS;

    const URL = `${import.meta.env.VITE_API_URL}${bookId ? bookId : "books"}`;

    const [booksItems, setBooksItems] = useState([]);
    const [mode, setMode] = useState("edit");
    const [newElementName, setNewElementName] = useState("");

    const [selectedCounterpartyName, setSelectedCounterpartyName] =
        useState("");

    const filteredProjects = useMemo(() => {
        const result = booksItems.filter((book) => {
            return selectedCounterpartyName &&
                selectedCounterpartyName !== "default"
                ? book.counterparty_name === selectedCounterpartyName
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

    const sectorOptions = useMemo(() => {
        if (bookId != "contacts") return;
        const allSectors = booksItems.flatMap((item) => item.counterparty_name);
        return Array.from(new Set(allSectors));
    }, [booksItems]);

    const handleNewElementName = (e) => {
        setNewElementName(e.target.value);
    };

    const addNewElement = () => {
        postData("POST", URL, { name: newElementName }).then((response) => {
            if (response) {
                setBooksItems((booksItems) => [...booksItems, response]);
                setNewElementName("");
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
        getData(URL, { Accept: "application/json" }).then((response) => {
            setBooksItems(response.data);
        });
        // .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        getBooks();
    }, []);

    return (
        <main className="page">
            <div className="container py-8">
                <div className="flex justify-between items-center gap-6 mb-8">
                    <h1 className="text-3xl font-medium">
                        {TITLES[bookId]} ({booksItems.length})
                    </h1>

                    <div className="flex items-center gap-6">
                        {bookId === "contacts" && (
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

                                {/* <Select
                                    className={
                                        "p-1 border border-gray-300 min-w-[120px] cursor-pointer"
                                    }
                                    title={"Банк"}
                                    items={bankOptions}
                                    onChange={(evt) =>
                                        setSelectedBank(evt.target.value)
                                    }
                                /> */}
                            </>
                        )}

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
                    <table className="table-auto w-full border-collapse border-b border-gray-300 text-sm">
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
                            {mode === "edit" && (
                                <tr className="border-b border-gray-300 text-base text-left">
                                    {columns.map(({ key }) => (
                                        <td
                                            key={key}
                                            className="border-b border-gray-300 px-4 py-7 min-w-[180px] max-w-[200px]"
                                        >
                                            {key === "name" ||
                                            key === "counterparty_name" ? (
                                                <div
                                                    key={key}
                                                    className="flex items-center gap-2"
                                                >
                                                    <input
                                                        type="text"
                                                        className="w-full"
                                                        placeholder="Новый элемент"
                                                        value={newElementName}
                                                        onChange={(evt) =>
                                                            handleNewElementName(
                                                                evt
                                                            )
                                                        }
                                                    />
                                                    <span className="edit-icon"></span>

                                                    <button
                                                        type="button"
                                                        className="save-icon"
                                                        style={{
                                                            opacity:
                                                                newElementName.length >
                                                                3
                                                                    ? 1
                                                                    : 0,
                                                        }}
                                                        onClick={addNewElement}
                                                    ></button>
                                                </div>
                                            ) : (
                                                "—"
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            )}

                            {filteredProjects.length > 0 &&
                                filteredProjects.map((item) => (
                                    <ReferenceItem
                                        key={item.id}
                                        data={item}
                                        columns={columns}
                                        mode={mode}
                                        bookId={bookId}
                                        deleteElement={deleteElement}
                                    />
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default SingleBook;
