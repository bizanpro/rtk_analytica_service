import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getData from "../../utils/getData";
import ReferenceItem from "./ReferenceItem";

const SingleBook = () => {
    const COLUMNS = {
        sectors: [
            { label: "Наименование", key: "name" },
            { label: "Кол-во элементов", key: "elements_count" },
            { label: "Последнее изменение", key: "last_changes" },
            { label: "Автор измнения", key: "edit_author" },
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

    const { bookId } = useParams();

    const URL = import.meta.env.DEV
        ? `/data/${bookId ? bookId : "books"}.json`
        : "/data/books.json";
    // : `${import.meta.env.VITE_API_URL}projects`;

    const [booksItems, setBooksItems] = useState([]);
    const [mode, setMode] = useState("edit");

    useEffect(() => {
        getData(URL, { Accept: "application/json" }).then((response) => {
            setBooksItems(response.data);
        });
        // .finally(() => setIsLoading(false));
    }, []);

    return (
        <main className="page">
            <div className="container py-8">
                <div className="flex justify-between items-center gap-6 mb-8">
                    <h1 className="text-3xl font-medium">
                        Реестр справочников ({booksItems.length})
                    </h1>

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
                            <label htmlFor="edit_mode">Редактирование</label>
                        </div>
                    </nav>
                </div>

                <div className="overflow-x-auto w-full pb-5">
                    <table className="table-auto w-full border-collapse border-b border-gray-300 text-sm">
                        <thead className="text-gray-400 text-left">
                            <tr>
                                {COLUMNS[bookId].map(({ label, key }) => (
                                    <th
                                        className="border-b border-gray-300 text-base px-4 py-2 min-w-[180px] max-w-[200px]"
                                        rowSpan="2"
                                        key={key}
                                    >
                                        {label}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {booksItems.length > 0 &&
                                booksItems.map((item) => (
                                    <ReferenceItem
                                        key={item.id}
                                        data={item}
                                        columns={COLUMNS}
                                        mode={mode}
                                        bookId={bookId}
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
