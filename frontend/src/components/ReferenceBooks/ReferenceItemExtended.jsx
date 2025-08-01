import { useEffect, useRef, useState } from "react";

import { IMaskInput } from "react-imask";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

const ReferenceItemExtended = ({
    mode,
    data,
    bookId,
    editContragentAndCreditorContact,
    deleteContact,
}) => {
    const PhoneMask = "+{7} (000) 000 00 00";

    const personContacts =
        bookId == "creditor" ? "contacts" : "responsible_persons";

    const [editedContacts, setEditedContacts] = useState(() => {
        return data.projects.map((project) =>
            project[personContacts]?.map((contact) => ({
                full_name: contact.full_name,
                position: contact.position,
                phone: contact.phone,
                email: contact.email,
                id: contact.id,
            }))
        );
    });

    const findObjectById = (targetId) => {
        const flatData = editedContacts.flat();
        return flatData.find((obj) => obj.id === targetId);
    };

    const targetRefs = useRef([]);
    const projectsRefs = useRef([]);
    const phoneRefs = useRef([]);
    const lastChangeRefs = useRef([]);
    const authorRefs = useRef([]);
    const actionsRefs = useRef([]);

    useEffect(() => {
        data.projects.forEach((_, index) => {
            const targetHeight =
                targetRefs.current[index]?.getBoundingClientRect().height;

            if (targetHeight) {
                [
                    projectsRefs,
                    phoneRefs,
                    lastChangeRefs,
                    authorRefs,
                    actionsRefs,
                ].forEach((refs) => {
                    const el = refs.current[index];
                    if (el) {
                        el.style.height = `${targetHeight}px`;
                    }
                });
            }
        });
    }, []);

    return (
        <tr className="border-b border-gray-300 hover:bg-gray-50 transition text-base text-left cursor-pointer">
            <td className="pl-4">{data.name}</td>

            <td className="align-top">
                <table className="w-full">
                    <tbody>
                        {data.projects.map((project, projIndex) => (
                            <tr
                                className={`w-full ${
                                    projIndex === data.projects.length - 1
                                        ? ""
                                        : "border-b border-gray-300"
                                }`}
                                key={projIndex}
                                ref={(el) =>
                                    (targetRefs.current[projIndex] = el)
                                }
                            >
                                <td className="py-3 px-4 min-w-[180px]">
                                    <table className="w-full">
                                        <tbody className="flex flex-col gap-3">
                                            {project[personContacts]?.map(
                                                (contact, contactIndex) => (
                                                    <tr
                                                        key={contactIndex}
                                                        className="w-full"
                                                    >
                                                        <td className="w-full flex flex-col gap-1">
                                                            {mode === "read" ? (
                                                                <div className="text-xl p-1 border border-transparent">
                                                                    {
                                                                        contact.full_name
                                                                    }
                                                                </div>
                                                            ) : (
                                                                <input
                                                                    className="text-xl border border-gray-300 p-1"
                                                                    value={
                                                                        editedContacts[
                                                                            projIndex
                                                                        ][
                                                                            contactIndex
                                                                        ]
                                                                            ?.full_name
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        const newEdited =
                                                                            [
                                                                                ...editedContacts,
                                                                            ];
                                                                        newEdited[
                                                                            projIndex
                                                                        ] = [
                                                                            ...newEdited[
                                                                                projIndex
                                                                            ],
                                                                        ];
                                                                        newEdited[
                                                                            projIndex
                                                                        ][
                                                                            contactIndex
                                                                        ] = {
                                                                            ...newEdited[
                                                                                projIndex
                                                                            ][
                                                                                contactIndex
                                                                            ],
                                                                            full_name:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        };
                                                                        setEditedContacts(
                                                                            newEdited
                                                                        );
                                                                    }}
                                                                />
                                                            )}
                                                            {mode === "read" ? (
                                                                <div className="text-xl p-1 border border-transparent">
                                                                    {
                                                                        contact.position
                                                                    }
                                                                </div>
                                                            ) : (
                                                                <input
                                                                    className="text-xl border border-gray-300 p-1"
                                                                    value={
                                                                        editedContacts[
                                                                            projIndex
                                                                        ][
                                                                            contactIndex
                                                                        ]
                                                                            .position
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        const newEdited =
                                                                            [
                                                                                ...editedContacts,
                                                                            ];
                                                                        newEdited[
                                                                            projIndex
                                                                        ] = [
                                                                            ...newEdited[
                                                                                projIndex
                                                                            ],
                                                                        ];
                                                                        newEdited[
                                                                            projIndex
                                                                        ][
                                                                            contactIndex
                                                                        ] = {
                                                                            ...newEdited[
                                                                                projIndex
                                                                            ][
                                                                                contactIndex
                                                                            ],
                                                                            position:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        };
                                                                        setEditedContacts(
                                                                            newEdited
                                                                        );
                                                                    }}
                                                                />
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </td>

            <td className="align-top">
                <table className="w-full">
                    <tbody>
                        {data.projects.map((_, projIndex) => (
                            <tr
                                className={`w-full ${
                                    projIndex === data.projects.length - 1
                                        ? ""
                                        : "border-b border-gray-300"
                                }`}
                                key={projIndex}
                                ref={(el) =>
                                    (projectsRefs.current[projIndex] = el)
                                }
                            >
                                <td className="py-3 px-4 min-w-[180px]">
                                    {data.projects_count || "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </td>

            <td className="align-top">
                <table className="w-full">
                    <tbody>
                        {data.projects.map((project, projIndex) => (
                            <tr
                                className={`w-full ${
                                    projIndex === data.projects.length - 1
                                        ? ""
                                        : "border-b border-gray-300"
                                }`}
                                key={projIndex}
                                ref={(el) =>
                                    (phoneRefs.current[projIndex] = el)
                                }
                            >
                                <td className="py-3 px-4 min-w-[180px]">
                                    <table className="w-full">
                                        <tbody className="flex flex-col gap-3">
                                            {project[personContacts]?.map(
                                                (contact, contactIndex) => (
                                                    <tr
                                                        key={contactIndex}
                                                        className="w-full"
                                                    >
                                                        <td className="w-full flex flex-col gap-1">
                                                            {mode === "read" ? (
                                                                <div className="text-xl p-1 border border-transparent">
                                                                    {
                                                                        contact.phone
                                                                    }
                                                                </div>
                                                            ) : (
                                                                <IMaskInput
                                                                    mask={
                                                                        PhoneMask
                                                                    }
                                                                    className="text-xl border border-gray-300 p-1"
                                                                    name="phone"
                                                                    type="tel"
                                                                    inputMode="tel"
                                                                    onAccept={(
                                                                        value
                                                                    ) => {
                                                                        const newEdited =
                                                                            [
                                                                                ...editedContacts,
                                                                            ];
                                                                        newEdited[
                                                                            projIndex
                                                                        ] = [
                                                                            ...newEdited[
                                                                                projIndex
                                                                            ],
                                                                        ];
                                                                        newEdited[
                                                                            projIndex
                                                                        ][
                                                                            contactIndex
                                                                        ] = {
                                                                            ...newEdited[
                                                                                projIndex
                                                                            ][
                                                                                contactIndex
                                                                            ],
                                                                            phone: value,
                                                                        };
                                                                        setEditedContacts(
                                                                            newEdited
                                                                        );
                                                                    }}
                                                                    value={
                                                                        editedContacts[
                                                                            projIndex
                                                                        ][
                                                                            contactIndex
                                                                        ].phone
                                                                    }
                                                                />
                                                            )}
                                                            {mode === "read" ? (
                                                                <div className="text-xl p-1 border border-transparent">
                                                                    {
                                                                        contact.email
                                                                    }
                                                                </div>
                                                            ) : (
                                                                <input
                                                                    className="text-xl border border-gray-300 p-1"
                                                                    value={
                                                                        editedContacts[
                                                                            projIndex
                                                                        ][
                                                                            contactIndex
                                                                        ].email
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        const newEdited =
                                                                            [
                                                                                ...editedContacts,
                                                                            ];
                                                                        newEdited[
                                                                            projIndex
                                                                        ] = [
                                                                            ...newEdited[
                                                                                projIndex
                                                                            ],
                                                                        ];
                                                                        newEdited[
                                                                            projIndex
                                                                        ][
                                                                            contactIndex
                                                                        ] = {
                                                                            ...newEdited[
                                                                                projIndex
                                                                            ][
                                                                                contactIndex
                                                                            ],
                                                                            email: e
                                                                                .target
                                                                                .value,
                                                                        };
                                                                        setEditedContacts(
                                                                            newEdited
                                                                        );
                                                                    }}
                                                                />
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </td>

            <td className="align-top">
                <table className="w-full">
                    <tbody>
                        {data.projects.map((_, projIndex) => (
                            <tr
                                className={`w-full ${
                                    projIndex === data.projects.length - 1
                                        ? ""
                                        : "border-b border-gray-300"
                                }`}
                                key={projIndex}
                                ref={(el) =>
                                    (lastChangeRefs.current[projIndex] = el)
                                }
                            >
                                <td className="py-3 px-4 min-w-[180px]">
                                    {format(
                                        parseISO(data.last_updated_at),
                                        "d MMMM yyyy, HH:mm",
                                        {
                                            locale: ru,
                                        }
                                    ) || "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </td>

            <td className="align-top">
                <table className="w-full">
                    <tbody>
                        {data.projects.map((_, projIndex) => (
                            <tr
                                className={`w-full ${
                                    projIndex === data.projects.length - 1
                                        ? ""
                                        : "border-b border-gray-300"
                                }`}
                                key={projIndex}
                                ref={(el) =>
                                    (authorRefs.current[projIndex] = el)
                                }
                            >
                                <td className="py-3 px-4 min-w-[180px]">
                                    {data.author || "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </td>

            <td className="align-top">
                <table className="w-full">
                    <tbody>
                        {data.projects.map((project, projIndex) => (
                            <tr
                                className={`w-full ${
                                    projIndex === data.projects.length - 1
                                        ? ""
                                        : "border-b border-gray-300"
                                }`}
                                key={projIndex}
                                ref={(el) =>
                                    (actionsRefs.current[projIndex] = el)
                                }
                            >
                                <td className="py-3 px-4 min-w-[50px]">
                                    <table className="w-full">
                                        <tbody className="flex flex-col gap-3">
                                            {project[personContacts]?.map(
                                                (contact) => (
                                                    <tr key={contact.id}>
                                                        <td className="py-3 px-4 min-w-[50px] text-center">
                                                            {mode ===
                                                                "edit" && (
                                                                <div className="flex items-center justify-end gap-3">
                                                                    <button
                                                                        onClick={() => {
                                                                            editContragentAndCreditorContact(
                                                                                findObjectById(
                                                                                    contact.id
                                                                                )
                                                                            );
                                                                        }}
                                                                        className="delete-button save-icon"
                                                                        title="Изменить контакт"
                                                                    ></button>
                                                                    <button
                                                                        onClick={() => {
                                                                            deleteContact(
                                                                                contact.id
                                                                            );
                                                                        }}
                                                                        className="delete-button delete-icon"
                                                                        title="Удалить контакт"
                                                                    ></button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </td>
        </tr>
    );
};

export default ReferenceItemExtended;
