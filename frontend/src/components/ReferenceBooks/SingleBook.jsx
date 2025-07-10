import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";

// import Select from "../Select";
import Popup from "../Popup/Popup";
import ReferenceItem from "./ReferenceItem";
import ReferenceItemExtended from "./ReferenceItemExtended";
import ReferenceItemExtendedContacts from "./ReferenceItemExtendedContacts";
import ReferenceItemNew from "./ReferenceItemNew";

import { IMaskInput } from "react-imask";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import COLUMNS from "../../data/reference_book_columns.json";
import TITLES from "../../data/reference_book_titles.json";

const SingleBook = () => {
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
    const [listLength, setListLength] = useState(0);
    const [popupState, setPopupState] = useState(false);
    const [positions, setPositions] = useState([]);

    const personContacts =
        bookId == "creditor" ? "contacts" : "responsible_persons";

    const [selectedCounterpartyName, setSelectedCounterpartyName] =
        useState("");

    const [newElem, setnewElem] = useState({
        contragent_id: "",
        full_name: "",
        position: "",
        email: "",
        phone: "",
    });

    const PhoneMask = "+{7} (000) 000 00 00";

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

    // Обработка существующих полей контактов подрядчиков
    const handleContactInputChange = (e, name, item, contactId) => {
        const value = name === "phone" ? e : e.target.value;

        setBooksItems((prevBooksItems) =>
            prevBooksItems.map((book) =>
                book.id === item.id
                    ? {
                          ...book,
                          contacts: book.contacts.map((contact) =>
                              contact.id === contactId
                                  ? { ...contact, [name]: value }
                                  : contact
                          ),
                      }
                    : book
            )
        );
    };

    // Изменение контакта подрядчика
    const editContactElem = (id, contactId) => {
        const contractor = booksItems.find((item) => item.id === id);

        const contractorContact = contractor.contacts?.find(
            (contact) => contact.id === contactId
        );

        query = toast.loading("Обновление", {
            containerId: "singleBook",
            position: "top-center",
        });

        postData(
            "PATCH",
            `${URL}/${id}/contacts/${contactId}`,
            contractorContact
        ).then((response) => {
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
                    containerId: "singleBook",
                });
            }
        });
    };

    // Удаление контакта подрядчика
    const deleteContactElem = (id, contactId) => {
        query = toast.loading("Удаление", {
            containerId: "singleBook",
            position: "top-center",
        });

        postData("DELETE", `${URL}/${id}/contacts/${contactId}`, {}).then(
            (response) => {
                if (response?.ok) {
                    toast.update(query, {
                        render: "Контакт удален",
                        type: "success",
                        containerId: "singleBook",
                        isLoading: false,
                        autoClose: 1200,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position: "top-center",
                    });

                    setBooksItems((booksItems) =>
                        booksItems.map((item) => {
                            if (item.id === id) {
                                return {
                                    ...item,
                                    contacts: item.contacts?.filter(
                                        (contact) => contact.id !== contactId
                                    ),
                                };
                            }
                            return item;
                        })
                    );
                } else {
                    toast.dismiss(query);
                    toast.error("Ошибка удалении контакта", {
                        isLoading: false,
                        autoClose: 1500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position: "top-center",
                        containerId: "singleBook",
                    });
                }
            }
        );
    };

    // Обработка полей попапа нового контакта подрядчика
    const handleNewContactElemInputChange = (e, name) => {
        const value = name === "phone" ? e : e.target.value;

        setnewElem((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Обработка полей новой записи в справочнике
    const handleNewElementInputChange = (e, name) => {
        let value;

        if (
            name === "is_regular" ||
            name === "show_cost" ||
            name === "is_project_report_responsible"
        ) {
            value = e.target.value === "true";
        } else {
            value = e.target.value;
        }

        setFormFields({ ...formFields, [name]: value });
    };

    // Обработка существующих полей справочника
    const handleInputChange = (e, name, id) => {
        let value;

        if (name === "phone") {
            value = e;
        } else if (
            name === "is_regular" ||
            name === "show_cost" ||
            name === "is_project_report_responsible"
        ) {
            value = e.target.value === "true";
        } else {
            value = e.target.value;
        }

        setBooksItems((prevBooksItems) =>
            prevBooksItems.map((item) =>
                item.id === id ? { ...item, [name]: value } : item
            )
        );
    };

    const closePopup = (evt) => {
        if (evt.currentTarget.classList.contains("popup")) {
            setPopupState(false);
            setnewElem({
                contragent_id: "",
                full_name: "",
                position: "",
                email: "",
                phone: "",
            });
        }
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

        query = toast.loading("Обновление", {
            containerId: "singleBook",
            position: "top-center",
        });

        postData("POST", URL, formFields)
            .then((response) => {
                if (response?.ok) {
                    setFormFields((prev) => ({
                        ...prev,
                        name: "",
                        counterparty_name: "",
                        full_name: "",
                    }));
                    setBooksItems((booksItems) => [...booksItems, response]);
                    toast.update(query, {
                        render: "Запись добавлена",
                        type: "success",
                        containerId: "singleBook",
                        isLoading: false,
                        autoClose: 1200,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position: "top-center",
                    });
                }
            })
            .catch(() => {
                toast.dismiss(query);
                toast.error("Ошибка добавления записи", {
                    isLoading: false,
                    autoClose: 1500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                    containerId: "singleBook",
                });
            });
    };

    // Добавить новый контакт подрядчику
    const addNewContact = (data) => {
        postData("POST", `${URL}/${data.contragent_id}`, data).then(
            (response) => {
                if (response?.ok) {
                    setBooksItems((booksItems) =>
                        booksItems.map((item) =>
                            item.id === data.contragent_id
                                ? {
                                      ...item,
                                      contacts: [
                                          ...(item.contacts || []),
                                          response,
                                      ],
                                  }
                                : item
                        )
                    );
                    toast("Контакт добавлен", {
                        type: "success",
                        containerId: "singleBook",
                        autoClose: 1200,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position: "top-center",
                    });
                    setPopupState(false);
                }
            }
        );
    };

    // Изменение записи
    const editElement = (id) => {
        const data = booksItems.find((book) => book.id === id);
        delete data?.projects_count;
        delete data?.updated_at;

        if (bookId !== "working-hours") {
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
        }

        query = toast.loading("Обновление", {
            containerId: "singleBook",
            position: "top-center",
        });

        postData("PATCH", `${URL}/${data.id}`, data)
            .then((response) => {
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
                        containerId: "singleBook",
                    });
                }
            })
            .catch(() => {
                toast.dismiss(query);
                toast.error("Ошибка обновления записи", {
                    isLoading: false,
                    autoClose: 1500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                    containerId: "singleBook",
                });
            });
    };

    // Изменение записи
    const editContragentAndCreditorContact = (data) => {
        query = toast.loading("Обновление", {
            containerId: "singleBook",
            position: "top-center",
        });

        postData(
            "PATCH",
            `${import.meta.env.VITE_API_URL}${bookId}-responsible-persons/${
                data.id
            }`,
            data
        )
            .then((response) => {
                if (response?.ok) {
                    toast.update(query, {
                        render: "Контакт обновлен",
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
                    toast.error("Ошибка обновления контакта", {
                        isLoading: false,
                        autoClose: 1500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position: "top-center",
                        containerId: "singleBook",
                    });
                }
            })
            .catch(() => {
                toast.dismiss(query);
                toast.error("Ошибка обновления контакта", {
                    isLoading: false,
                    autoClose: 1500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                    containerId: "singleBook",
                });
            });
    };

    // Удаление записи
    const deleteContact = (id) => {
        query = toast.loading("Удаление", {
            containerId: "singleBook",
            position: "top-center",
        });

        postData(
            "DELETE",
            `${
                import.meta.env.VITE_API_URL
            }${bookId}-responsible-persons/${id}`,
            {}
        )
            .then((response) => {
                if (response?.ok) {
                    getBooks();

                    toast.update(query, {
                        render: "Контакт удалена",
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
                    toast.error("Ошибка удаления контакта", {
                        isLoading: false,
                        autoClose: 1500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position: "top-center",
                        containerId: "singleBook",
                    });
                }
            })
            .catch(() => {
                toast.dismiss(query);
                toast.error("Ошибка удаления контакта", {
                    isLoading: false,
                    autoClose: 1500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                    containerId: "singleBook",
                });
            });
    };

    // Удаление записи
    const deleteElement = (id) => {
        query = toast.loading("Удаление", {
            containerId: "singleBook",
            position: "top-center",
        });

        postData("DELETE", `${URL}/${id}`, {})
            .then((response) => {
                if (response?.ok) {
                    setBooksItems((booksItems) =>
                        booksItems.filter((item) => item.id !== id)
                    );
                    toast.update(query, {
                        render: "Запись удалена",
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
                    toast.error("Ошибка удаления записи", {
                        isLoading: false,
                        autoClose: 1500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position: "top-center",
                        containerId: "singleBook",
                    });
                }
            })
            .catch(() => {
                toast.dismiss(query);
                toast.error("Ошибка удаления записи", {
                    isLoading: false,
                    autoClose: 1500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                    containerId: "singleBook",
                });
            });
    };

    // Получение списка записей
    const getBooks = () => {
        setIsLoading(true);

        getData(URL, { Accept: "application/json" })
            .then((response) => {
                if (response.status == 200) {
                    setBooksItems(response.data.data);

                    setListLength(
                        bookId !== "creditor" && bookId !== "contragent"
                            ? response.data.data?.length
                            : response.data.data.reduce((sum, creditor) => {
                                  const projectsContacts =
                                      creditor.projects.reduce(
                                          (projectSum, project) => {
                                              return (
                                                  projectSum +
                                                  project[personContacts].length
                                              );
                                          },
                                          0
                                      );
                                  return sum + projectsContacts;
                              }, 0)
                    );
                }
            })
            .finally(() => setIsLoading(false));
    };

    // Получение должностей
    const getPositions = () => {
        getData(`${import.meta.env.VITE_API_URL}positions`, {
            Accept: "application/json",
        }).then((response) => {
            if (response.status == 200) {
                setPositions(response.data.data);
            }
        });
    };

    useEffect(() => {
        getBooks();

        if (bookId === "management-report-types") {
            getPositions();
        }
    }, []);

    return (
        <main className="page">
            <div className="container py-8">
                <ToastContainer containerId="singleBook" />

                <div className="flex justify-between items-center gap-6 mb-8">
                    <h1 className="text-3xl font-medium">
                        {TITLES[bookId]} ({listLength})
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
                                {COLUMNS[bookId].map(
                                    ({ label, key, index }) => (
                                        <th
                                            className="text-base px-4 py-2 min-w-[180px]"
                                            rowSpan="2"
                                            key={key || index}
                                        >
                                            {label}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {mode === "edit" &&
                                bookId != "creditor" &&
                                bookId != "contragent" &&
                                bookId != "suppliers-with-reports" &&
                                bookId != "working-hours" && (
                                    <ReferenceItemNew
                                        handleNewElementInputChange={
                                            handleNewElementInputChange
                                        }
                                        columns={columns}
                                        formFields={formFields}
                                        bookId={bookId}
                                        positions={positions}
                                        addNewElement={addNewElement}
                                    />
                                )}

                            {isLoading ? (
                                <tr>
                                    <td className="text-base px-4 py-2">
                                        Загрузка...
                                    </td>
                                </tr>
                            ) : (
                                filteredProjects?.length > 0 &&
                                filteredProjects.map((item) => {
                                    if (
                                        bookId === "creditor" ||
                                        bookId === "contragent"
                                    ) {
                                        return (
                                            <ReferenceItemExtended
                                                key={item.id}
                                                data={item}
                                                mode={mode}
                                                bookId={bookId}
                                                editContragentAndCreditorContact={
                                                    editContragentAndCreditorContact
                                                }
                                                deleteContact={deleteContact}
                                            />
                                        );
                                    }

                                    if (bookId === "suppliers-with-reports") {
                                        return (
                                            <ReferenceItemExtendedContacts
                                                key={item.id}
                                                data={item}
                                                mode={mode}
                                                handleContactInputChange={
                                                    handleContactInputChange
                                                }
                                                deleteContactElem={
                                                    deleteContactElem
                                                }
                                                editContactElem={
                                                    editContactElem
                                                }
                                                setPopupState={setPopupState}
                                                setnewElem={setnewElem}
                                            />
                                        );
                                    }

                                    return (
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
                                            positions={positions}
                                        />
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {popupState &&
                    mode === "edit" &&
                    bookId === "suppliers-with-reports" && (
                        <Popup onClick={closePopup} title="Добавить контакт">
                            <div className="min-w-[300px]">
                                <div className="action-form__body grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        className="w-full text-base border border-gray-300 p-1"
                                        value={newElem.full_name}
                                        placeholder="ФИО"
                                        onChange={(e) =>
                                            handleNewContactElemInputChange(
                                                e,
                                                "full_name"
                                            )
                                        }
                                    />

                                    <input
                                        type="text"
                                        className="w-full text-base border border-gray-300 p-1"
                                        value={newElem.position}
                                        placeholder="Должность"
                                        onChange={(e) =>
                                            handleNewContactElemInputChange(
                                                e,
                                                "position"
                                            )
                                        }
                                    />

                                    <IMaskInput
                                        mask={PhoneMask}
                                        className="w-full text-base border border-gray-300 p-1"
                                        name="phone"
                                        type="tel"
                                        inputMode="tel"
                                        onAccept={(value) =>
                                            handleNewContactElemInputChange(
                                                value || "",
                                                "phone"
                                            )
                                        }
                                        value={newElem.phone}
                                        placeholder="+7 999 999 99 99"
                                    />

                                    <input
                                        type="text"
                                        className="w-full text-base border border-gray-300 p-1"
                                        value={newElem.email}
                                        placeholder="Email"
                                        onChange={(e) =>
                                            handleNewContactElemInputChange(
                                                e,
                                                "email"
                                            )
                                        }
                                    />
                                </div>

                                <div className="action-form__footer mt-5 flex items-center gap-6 justify-between">
                                    <button
                                        type="button"
                                        className="rounded-lg py-2 px-5 bg-black text-white flex-[1_1_50%]"
                                        onClick={() => addNewContact(newElem)}
                                    >
                                        Добавить
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPopupState(false)}
                                        className="border rounded-lg py-2 px-5 flex-[1_1_50%]"
                                    >
                                        Отменить
                                    </button>
                                </div>
                            </div>
                        </Popup>
                    )}
            </div>
        </main>
    );
};

export default SingleBook;
