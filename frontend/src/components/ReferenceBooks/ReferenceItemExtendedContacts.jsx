import { useState } from "react";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

const ReferenceItemExtendedContacts = ({
    data,
    mode = "read",
    deleteElement,
    handleInputChange,
    addNewContact,
}) => {
    const [addNewElem, setAddNewElem] = useState(false);
    const [newElem, setnewElem] = useState({
        contragent_id: data.id,
        full_name: "",
        position: "",
        email: "",
        phone: "",
    });

    const handleNewElemInputChange = (e, name) => {
        setnewElem((prev) => ({ ...prev, [name]: e.target.value }));
    };

    return (
        <>
            {data.contacts?.map((contact, index) => (
                <tr
                    key={contact.id}
                    className="border-b border-gray-300 text-base text-left"
                >
                    {index === 0 && (
                        <td
                            rowSpan={data.contacts.length}
                            className="px-4 py-5 min-w-[180px] max-w-[200px] align-top"
                        >
                            <div className="min-h-full flex items-center gap-2">
                                <span className="text-xl">
                                    {data.name?.toString() || "—"}
                                </span>
                                {mode === "edit" && (
                                    <button
                                        type="button"
                                        className="add-button flex items-center"
                                        title="Добавить контакт"
                                        onClick={() => setAddNewElem(true)}
                                    >
                                        <span></span>
                                    </button>
                                )}
                            </div>
                        </td>
                    )}

                    <td className="px-4 py-5 min-w-[180px] max-w-[200px]">
                        <div className="flex flex-col gap-1">
                            <div>
                                <input
                                    type="text"
                                    className={`w-full text-xl p-1 border transition ${
                                        mode === "read"
                                            ? "border-transparent"
                                            : "border-gray-300"
                                    }`}
                                    value={contact.full_name?.toString() || "—"}
                                    onChange={(e) =>
                                        handleInputChange(
                                            e,
                                            "full_name",
                                            data.id
                                        )
                                    }
                                    disabled={mode === "read" ? true : false}
                                />
                            </div>
                            <span className="text">
                                <input
                                    type="text"
                                    className={`w-full p-1 border transition ${
                                        mode === "read"
                                            ? "border-transparent"
                                            : "border-gray-300"
                                    }`}
                                    value={contact.position?.toString() || "—"}
                                    onChange={(e) =>
                                        handleInputChange(
                                            e,
                                            "position",
                                            data.id
                                        )
                                    }
                                    disabled={mode === "read" ? true : false}
                                />
                            </span>
                        </div>
                    </td>

                    <td className="px-4 py-5 min-w-[180px] max-w-[200px]">
                        <div className="flex flex-col gap-1">
                            <div>
                                <input
                                    type="text"
                                    className={`w-full text-xl p-1 border transition ${
                                        mode === "read"
                                            ? "border-transparent"
                                            : "border-gray-300"
                                    }`}
                                    value={contact.phone?.toString() || "—"}
                                    onChange={(e) =>
                                        handleInputChange(e, "phone", data.id)
                                    }
                                    disabled={mode === "read" ? true : false}
                                />
                            </div>
                            <span>
                                <input
                                    type="text"
                                    className={`w-full p-1 border transition ${
                                        mode === "read"
                                            ? "border-transparent"
                                            : "border-gray-300"
                                    }`}
                                    value={contact.email?.toString() || "—"}
                                    onChange={(e) =>
                                        handleInputChange(e, "email", data.id)
                                    }
                                    disabled={mode === "read" ? true : false}
                                />
                            </span>
                        </div>
                    </td>

                    <td className="px-4 py-5 min-w-[180px] max-w-[200px] text-xl">
                        {contact.updated_at
                            ? format(
                                  parseISO(contact.updated_at),
                                  "d MMMM yyyy, HH:mm",
                                  { locale: ru }
                              )
                            : "—"}
                    </td>

                    <td className="px-4 py-5 min-w-[180px] max-w-[200px] text-xl">
                        {contact.author?.toString() || "—"}
                    </td>

                    <td className="px-4 py-5 min-w-[50px] text-center">
                        {mode === "edit" && (
                            <button
                                onClick={() => deleteElement(data.id)}
                                className="delete-button delete-icon"
                                title="Удалить элемент"
                            ></button>
                        )}
                    </td>
                </tr>
            ))}

            {addNewElem && mode === "edit" && (
                <>
                    <td className="px-4 py-5 min-w-[180px] max-w-[200px] align-top"></td>

                    <td className="px-4 py-5 min-w-[180px] max-w-[200px]">
                        <div className="flex flex-col gap-1">
                            <input
                                type="text"
                                className="w-full text-base border border-gray-300 p-1"
                                value={newElem.full_name}
                                placeholder="ФИО"
                                onChange={(e) =>
                                    handleNewElemInputChange(e, "full_name")
                                }
                            />

                            <input
                                type="text"
                                className="w-full text-base border border-gray-300 p-1"
                                value={newElem.position}
                                placeholder="Должность"
                                onChange={(e) =>
                                    handleNewElemInputChange(e, "position")
                                }
                            />
                        </div>
                    </td>

                    <td className="px-4 py-5 min-w-[180px] max-w-[200px]">
                        <div className="flex flex-col gap-1">
                            <input
                                type="text"
                                className="w-full text-base border border-gray-300 p-1"
                                value={newElem.phone}
                                placeholder="Телефон"
                                onChange={(e) =>
                                    handleNewElemInputChange(e, "phone")
                                }
                            />

                            <input
                                type="text"
                                className="w-full text-base border border-gray-300 p-1"
                                value={newElem.email}
                                placeholder="Email"
                                onChange={(e) =>
                                    handleNewElemInputChange(e, "email")
                                }
                            />
                        </div>
                    </td>

                    <td className="px-4 py-5 min-w-[180px] max-w-[200px] text-xl">
                        —
                    </td>

                    <td className="px-4 py-5 min-w-[180px] max-w-[200px] text-xl">
                        —
                    </td>

                    <td className="px-4 py-5 min-w-[50px] text-center">
                        <div className="flex items-center gap-3">
                            <button
                                title="Добавить контакт"
                                onClick={() => {
                                    addNewContact(newElem);
                                }}
                            >
                                <span className="save-icon"></span>
                            </button>

                            <button
                                onClick={() => setAddNewElem(false)}
                                className="delete-button delete-icon"
                                title="Удалить элемент"
                            ></button>
                        </div>
                    </td>
                </>
            )}
        </>
    );
};

export default ReferenceItemExtendedContacts;
