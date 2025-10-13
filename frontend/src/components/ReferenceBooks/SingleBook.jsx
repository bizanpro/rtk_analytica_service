import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";

import Popup from "../Popup/Popup";
import ReferenceItem from "./ReferenceItem";
import ReferenceItemExtended from "./ReferenceItemExtended";
import ReferenceItemExtendedContacts from "./ReferenceItemExtendedContacts";
import ReferenceItemNew from "./ReferenceItemNew";
import ReferenceItemWorkingHours from "./ReferenceItemWorkingHours";

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
    const [refBooksItems, setRefBooksItems] = useState([]);

    const [mode, setMode] = useState("read");

    const [formFields, setFormFields] = useState({});

    const [isLoading, setIsLoading] = useState(true);

    const [listLength, setListLength] = useState(0);

    const [popupState, setPopupState] = useState(false);
    const [rolesAction, setRolesAction] = useState({ action: "", roleId: "" });

    const [positions, setPositions] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);
    const [currentYear, setCurrentYear] = useState("");

    const [newElem, setnewElem] = useState({
        contragent_id: "",
        full_name: "",
        position: "",
        email: "",
        phone: "",
    });

    const PhoneMask = "+{7} (000) 000 00 00";

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
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
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
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                });
            } else {
                toast.dismiss(query);
                toast.error("Ошибка обновления записи", {
                    isLoading: false,
                    autoClose: 1500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                    containerId: "singleBook",
                });
            }
        });
    };

    // Удаление контакта подрядчика
    const deleteContactElem = (id, contactId) => {
        query = toast.loading("Удаление", {
            containerId: "singleBook",
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
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
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
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
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
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
        } else if (name === "hours") {
            value = +e.target.value;
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

    // Закрытие попапа
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

            if (bookId == "roles") {
                setRolesAction({ action: "", roleId: "" });
                getBooks();
            }
        }
    };

    // Изименение генерации отчетов
    const toggleRoleResponce = (action) => {
        query = toast.loading("Обновление", {
            containerId: "singleBook",
            position: "top-center",
        });

        action.is_project_report_responsible = rolesAction.action === "true";

        postData(
            "POST",
            `${import.meta.env.VITE_API_URL}roles/${
                rolesAction.roleId
            }/project-reports/toggle`,
            action
        )
            .then((response) => {
                if (response?.ok) {
                    setRolesAction({ action: "", roleId: "" });
                    getBooks();

                    toast.update(query, {
                        render: response.message || "Успех",
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
                    toast.error(response.message || "Ошибка операции", {
                        isLoading: false,
                        autoClose: 1500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position: "top-center",
                        containerId: "singleBook",
                    });
                }
            })
            .catch((error) => {
                toast.dismiss(query);
                toast.error(error.message || "Ошибка операции", {
                    isLoading: false,
                    autoClose: 1500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                    containerId: "singleBook",
                });
            });
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

        if (bookId === "departments") {
            if (formFields.include_in_payroll !== "") {
                formFields.include_in_payroll = JSON.parse(
                    formFields?.include_in_payroll
                );
            }
        }

        query = toast.loading("Обновление", {
            containerId: "singleBook",
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        postData("POST", URL, formFields)
            .then((response) => {
                if (response?.ok) {
                    toast.update(query, {
                        render: "Запись добавлена",
                        type: "success",
                        containerId: "singleBook",
                        isLoading: false,
                        autoClose: 1200,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    });

                    setFormFields((prev) => ({
                        ...prev,
                        name: "",
                        counterparty_name: "",
                        full_name: "",
                    }));
                    getBooks();
                }
            })
            .catch((error) => {
                toast.dismiss(query);
                toast.error(error.message || "Ошибка добавления записи", {
                    isLoading: false,
                    autoClose: 1500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
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
                    setRefBooksItems((booksItems) =>
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

        if (bookId === "management-report-types") {
            if (data.position_id) {
                data.position_id = +data?.position_id;
            }

            delete data?.count;
            delete data?.position;
        }

        if (bookId === "departments") {
            if (data.include_in_payroll !== "") {
                data.include_in_payroll = JSON.parse(data?.include_in_payroll);
            }
        }

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
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
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
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    });
                    getBooks();
                } else {
                    toast.dismiss(query);
                    toast.error("Ошибка обновления записи", {
                        isLoading: false,
                        autoClose: 1500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                        containerId: "singleBook",
                    });
                }
            })
            .catch((error) => {
                toast.dismiss(query);
                toast.error(error.message || "Ошибка обновления записи", {
                    isLoading: false,
                    autoClose: 1500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                    containerId: "singleBook",
                });
            });
    };

    const saveAllList = () => {
        query = toast.loading("Сохранение", {
            containerId: "singleBook",
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        postData("PATCH", URL, { year: currentYear, hours: booksItems })
            .then((response) => {
                if (response?.ok) {
                    toast.update(query, {
                        render: response.message || "Успешно сохранено",
                        type: "success",
                        containerId: "singleBook",
                        isLoading: false,
                        autoClose: 1200,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    });
                } else {
                    toast.dismiss(query);
                    toast.error("Ошибка сохранения", {
                        isLoading: false,
                        autoClose: 1500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                        containerId: "singleBook",
                    });
                }
            })
            .catch((error) => {
                toast.dismiss(query);
                toast.error(error.message || "Ошибка сохранения", {
                    isLoading: false,
                    autoClose: 1500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                    containerId: "singleBook",
                });
            });
    };

    // Изменение записи
    const editContragentAndCreditorContact = (data) => {
        query = toast.loading("Обновление", {
            containerId: "singleBook",
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        postData(
            "PATCH",
            `${import.meta.env.VITE_API_URL}responsible-persons/${bookId}/${
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
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    });
                } else {
                    toast.dismiss(query);
                    toast.error("Ошибка обновления контакта", {
                        isLoading: false,
                        autoClose: 1500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                        containerId: "singleBook",
                    });
                }
            })
            .catch((error) => {
                toast.dismiss(query);
                toast.error(error.message || "Ошибка обновления контакта", {
                    isLoading: false,
                    autoClose: 1500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                    containerId: "singleBook",
                });
            });
    };

    // Удаление записи
    const deleteContact = (id) => {
        query = toast.loading("Удаление", {
            containerId: "singleBook",
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        let url;

        if (bookId == "creditor" || bookId == "contragent") {
            url = `${
                import.meta.env.VITE_API_URL
            }responsible-persons/${bookId}/contact/${id}`;
        } else {
            url = `${
                import.meta.env.VITE_API_URL
            }${bookId}-responsible-persons/${id}`;
        }

        postData("DELETE", url, {})
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
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    });
                } else {
                    toast.dismiss(query);
                    toast.error("Ошибка удаления контакта", {
                        isLoading: false,
                        autoClose: 1500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                        containerId: "singleBook",
                    });
                }
            })
            .catch((error) => {
                toast.dismiss(query);
                toast.error(error.message || "Ошибка удаления контакта", {
                    isLoading: false,
                    autoClose: 1500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                    containerId: "singleBook",
                });
            });
    };

    // Удаление записи
    const deleteElement = (id) => {
        query = toast.loading("Удаление", {
            containerId: "singleBook",
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        postData("DELETE", `${URL}/${id}`, {})
            .then((response) => {
                if (response?.ok) {
                    setBooksItems((booksItems) =>
                        booksItems.filter((item) => item.id !== id)
                    );
                    setRefBooksItems((booksItems) =>
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
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    });
                } else {
                    toast.dismiss(query);
                    toast.error("Ошибка удаления записи", {
                        isLoading: false,
                        autoClose: 1500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                        containerId: "singleBook",
                    });
                }
            })
            .catch((error) => {
                toast.dismiss(query);
                toast.error(error.message || "Ошибка удаления записи", {
                    isLoading: false,
                    autoClose: 1500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                    containerId: "singleBook",
                });
            });
    };

    // Получение должностей
    const getPositions = () => {
        getData(`${import.meta.env.VITE_API_URL}positions`, {
            Accept: "application/json",
        }).then((response) => {
            if (response.status == 200) {
                if (response.data.data?.length > 0) {
                    setPositions(
                        response.data.data.filter(
                            (item) => item.type === "one_to_one"
                        )
                    );
                }
            }
        });
    };

    // Получение должностей
    const getAvailableYears = () => {
        getData(`${import.meta.env.VITE_API_URL}${bookId}/available-years`, {
            Accept: "application/json",
        }).then((response) => {
            if (response.status == 200) {
                setAvailableYears(response.data.years);
                setCurrentYear(
                    response.data.years[response.data.years.length - 1] || ""
                );
            }
        });
    };

    // Получение списка записей
    const getBooks = () => {
        setIsLoading(true);

        const url =
            bookId == "working-hours" ? `${URL}?year=${currentYear}` : URL;

        getData(url, {
            Accept: "application/json",
        })
            .then((response) => {
                if (response.status == 200) {
                    setBooksItems(response.data.data);
                    setRefBooksItems(response.data.data);

                    setListLength(
                        bookId !== "creditor" && bookId !== "contragent"
                            ? response.data.data?.length
                            : response.data.data.reduce((sum, creditor) => {
                                  const projectsContacts =
                                      creditor.projects.reduce(
                                          (projectSum, project) => {
                                              return (
                                                  projectSum +
                                                  project.contacts?.length
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

    useEffect(() => {
        if (bookId !== "working-hours") {
            getBooks();
        }

        if (bookId === "management-report-types") {
            getPositions();
        }

        if (bookId === "working-hours") {
            getAvailableYears();
        }
    }, []);

    useEffect(() => {
        if (bookId === "working-hours" && currentYear != "") {
            getBooks();
        }
    }, [currentYear]);

    useEffect(() => {
        if (mode == "read") {
            setBooksItems(refBooksItems);
        }
    }, [mode]);

    return (
        <main className="page">
            <div className="container py-8">
                <ToastContainer containerId="singleBook" />

                <div className="flex justify-between items-center gap-6 mb-8">
                    <h1 className="text-3xl font-medium">
                        {TITLES[bookId]} ({listLength})
                    </h1>

                    <div
                        className={`flex ${
                            bookId === "working-hours"
                                ? "justify-between"
                                : "justify-end"
                        } items-center gap-6 flex-grow`}
                    >
                        {bookId === "working-hours" && (
                            <select
                                className="p-1 border border-gray-300 min-w-[120px] max-w-[200px]"
                                value={currentYear}
                                onChange={(evt) =>
                                    setCurrentYear(evt.target.value)
                                }
                            >
                                {availableYears.length > 0 &&
                                    availableYears.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                            </select>
                        )}

                        <div className="flex items-center gap-6">
                            {mode === "edit" && bookId === "working-hours" && (
                                <button
                                    onClick={() => {
                                        saveAllList();
                                    }}
                                    className="delete-button save-icon"
                                    title="Сохранить рабочие часы"
                                ></button>
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
                                bookId != "working-hours" &&
                                bookId !== "report-types" && (
                                    <ReferenceItemNew
                                        handleNewElementInputChange={
                                            handleNewElementInputChange
                                        }
                                        columns={columns}
                                        formFields={formFields}
                                        booksItems={booksItems}
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
                                booksItems?.length > 0 &&
                                booksItems.map((item) => {
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

                                    if (bookId === "working-hours") {
                                        return (
                                            <ReferenceItemWorkingHours
                                                key={item.id}
                                                data={item}
                                                columns={columns}
                                                mode={mode}
                                                bookId={bookId}
                                                handleInputChange={
                                                    handleInputChange
                                                }
                                            />
                                        );
                                    }

                                    return (
                                        <ReferenceItem
                                            key={item.id}
                                            data={item}
                                            booksItems={booksItems}
                                            columns={columns}
                                            mode={mode}
                                            bookId={bookId}
                                            handleInputChange={
                                                handleInputChange
                                            }
                                            deleteElement={deleteElement}
                                            editElement={editElement}
                                            setRolesAction={setRolesAction}
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

                {rolesAction.action != "" &&
                    mode === "edit" &&
                    bookId === "roles" && (
                        <Popup
                            onClick={closePopup}
                            title={`${
                                rolesAction.action === "true"
                                    ? "Включение генерации отчетов"
                                    : "Отключение генерации отчетов"
                            }`}
                        >
                            <div className="min-w-[300px] max-w-[450px]">
                                <div className="action-form__body grid grid-cols-1 gap-3">
                                    <p>
                                        {rolesAction.action === "true"
                                            ? "Отчеты сотрудников с данной ролью начнут генерироваться, начиная с текущего месяца. Следует ли сгенерировать отчеты сотрудников для прошлого периода?"
                                            : "Отчеты сотрудников с данной ролью перестанут генерироваться начиная с текущего месяца. Что следует сделать с ранее созданными отчетами?"}
                                    </p>

                                    <div className="flex flex-col gap-4 mt-4">
                                        {rolesAction.action === "true" ? (
                                            <>
                                                <button
                                                    type="button"
                                                    className="rounded-lg py-3 px-5 border"
                                                    title="Да"
                                                    onClick={() =>
                                                        toggleRoleResponce({
                                                            action: "enable",
                                                            backfill: true,
                                                        })
                                                    }
                                                >
                                                    Да
                                                </button>

                                                <button
                                                    type="button"
                                                    className="rounded-lg py-3 px-5 border"
                                                    title="Нет"
                                                    onClick={() =>
                                                        toggleRoleResponce({
                                                            action: "enable",
                                                            backfill: false,
                                                        })
                                                    }
                                                >
                                                    Нет
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    className="rounded-lg py-3 px-5 border"
                                                    title="Безвозвратно удалить"
                                                    onClick={() =>
                                                        toggleRoleResponce({
                                                            action: "disable",
                                                            policy: "delete",
                                                        })
                                                    }
                                                >
                                                    Безвозвратно удалить
                                                </button>

                                                <button
                                                    type="button"
                                                    className="rounded-lg py-3 px-5 border"
                                                    title="Скрыть из списка"
                                                    onClick={() =>
                                                        toggleRoleResponce({
                                                            action: "disable",
                                                            policy: "hide",
                                                        })
                                                    }
                                                >
                                                    Скрыть из списка
                                                </button>

                                                <button
                                                    type="button"
                                                    className="rounded-lg py-3 px-5 border"
                                                    title="Оставить в списке"
                                                    onClick={() =>
                                                        toggleRoleResponce({
                                                            action: "disable",
                                                            policy: "keep",
                                                        })
                                                    }
                                                >
                                                    Оставить в списке
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    )}
            </div>
        </main>
    );
};

export default SingleBook;
