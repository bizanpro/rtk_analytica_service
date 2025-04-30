import { useState } from "react";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

const ReferenceItemExtendedContacts = ({
    data,
    mode = "read",
    deleteElement,
    handleInputChange,
}) => {
    const [addNewElem, setAddNewElem] = useState(false);

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
                            className="px-4 py-7 min-w-[180px] max-w-[200px] align-top"
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

                    <td className="px-4 py-7 min-w-[180px] max-w-[200px]">
                        <div className="flex flex-col">
                            <div>
                                <input
                                    type="text"
                                    className="w-full text-xl"
                                    value={contact.full_name?.toString() || "—"}
                                    onChange={(e) =>
                                        handleInputChange(
                                            e,
                                            "full_name",
                                            data.id
                                        )
                                    }
                                />
                            </div>
                            <span>{contact.position?.toString() || "—"}</span>
                        </div>
                    </td>

                    <td className="px-4 py-7 min-w-[180px] max-w-[200px]">
                        <div className="flex flex-col">
                            <div>
                                <input
                                    type="text"
                                    className="w-full text-xl"
                                    value={contact.phone?.toString() || "—"}
                                    onChange={(e) =>
                                        handleInputChange(e, "phone", data.id)
                                    }
                                />
                            </div>
                            <span>{contact.email?.toString() || "—"}</span>
                        </div>
                    </td>

                    <td className="px-4 py-7 min-w-[180px] max-w-[200px] text-xl">
                        {contact.updated_at
                            ? format(
                                  parseISO(contact.updated_at),
                                  "d MMMM yyyy, HH:mm",
                                  { locale: ru }
                              )
                            : "—"}
                    </td>

                    <td className="px-4 py-7 min-w-[180px] max-w-[200px] text-xl">
                        {contact.author?.toString() || "—"}
                    </td>

                    {mode === "edit" && (
                        <td className="px-4 py-7 min-w-[50px] text-center">
                            <button
                                onClick={() => deleteElement(data.id)}
                                className="delete-button delete-icon"
                                title="Удалить элемент"
                            ></button>
                        </td>
                    )}
                </tr>
            ))}

            {addNewElem && (
                <>
                    <td className="px-4 py-7 min-w-[180px] max-w-[200px] align-top">
                        <div className="min-h-full flex items-center gap-2">
                            <span className="text-xl">
                                {data.name?.toString() || "—"}
                            </span>
                        </div>
                    </td>

                    <td className="px-4 py-7 min-w-[180px] max-w-[200px]">
                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                className="w-full text-base border border-gray-300 p-2"
                                // value={
                                //     contact.full_name?.toString() ||
                                //     "—"
                                // }
                                placeholder="ФИО"
                                onChange={(e) =>
                                    handleInputChange(e, "full_name", data.id)
                                }
                            />

                            <input
                                type="text"
                                className="w-full text-base border border-gray-300 p-2"
                                // value={
                                //     contact.phone?.toString() || "—"
                                // }
                                placeholder="Должность"
                                onChange={(e) =>
                                    handleInputChange(e, "position", data.id)
                                }
                            />
                        </div>
                    </td>

                    <td className="px-4 py-7 min-w-[180px] max-w-[200px]">
                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                className="w-full text-base border border-gray-300 p-2"
                                // value={
                                //     contact.phone?.toString() || "—"
                                // }
                                placeholder="Телефон"
                                onChange={(e) =>
                                    handleInputChange(e, "phone", data.id)
                                }
                            />

                            <input
                                type="text"
                                className="w-full text-base border border-gray-300 p-2"
                                // value={
                                //     contact.phone?.toString() || "—"
                                // }
                                placeholder="Email"
                                onChange={(e) =>
                                    handleInputChange(e, "email", data.id)
                                }
                            />
                        </div>
                    </td>

                    <td className="px-4 py-7 min-w-[180px] max-w-[200px] text-xl">
                        —
                    </td>

                    <td className="px-4 py-7 min-w-[180px] max-w-[200px] text-xl">
                        —
                    </td>

                    {mode === "edit" && (
                        <td className="px-4 py-7 min-w-[50px] text-center">
                            <button
                                onClick={() => setAddNewElem(false)}
                                className="delete-button delete-icon"
                                title="Удалить элемент"
                            ></button>
                        </td>
                    )}
                </>
            )}
        </>
    );
};

export default ReferenceItemExtendedContacts;
