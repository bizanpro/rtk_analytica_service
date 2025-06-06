import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

const ReferenceItemExtended = ({ data, bookId }) => {
    const navigate = useNavigate();

    const handleRowClick = () => {
        navigate(`/reference-books/${data.creditor_id}`);
    };

    const personContacts =
        bookId == "creditor" ? "contacts" : "responsible_persons";

    const targetRefs = useRef([]);
    const projectsRefs = useRef([]);
    const phoneRefs = useRef([]);
    const lastChangeRefs = useRef([]);
    const authorRefs = useRef([]);

    useEffect(() => {
        data.projects.forEach((_, index) => {
            const targetHeight =
                targetRefs.current[index]?.getBoundingClientRect().height;

            if (targetHeight) {
                [projectsRefs, phoneRefs, lastChangeRefs, authorRefs].forEach(
                    (refs) => {
                        const el = refs.current[index];
                        if (el) {
                            el.style.height = `${targetHeight}px`;
                        }
                    }
                );
            }
        });
    }, []);

    return (
        <tr
            className="border-b border-gray-300 hover:bg-gray-50 transition text-base text-left cursor-pointer"
            {...(!bookId && { onClick: handleRowClick })}
        >
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
                                            {project[personContacts].map(
                                                (contact, contactIndex) => (
                                                    <tr
                                                        key={contactIndex}
                                                        className="w-full"
                                                    >
                                                        <td className="w-full">
                                                            <div className="text-xl">
                                                                {
                                                                    contact.full_name
                                                                }
                                                            </div>

                                                            <div>
                                                                {
                                                                    contact.position
                                                                }
                                                            </div>
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
                                            {project[personContacts].map(
                                                (contact, contactIndex) => (
                                                    <tr
                                                        key={contactIndex}
                                                        className="w-full"
                                                    >
                                                        <td className="w-full">
                                                            <div className="text-xl">
                                                                {contact.phone}
                                                            </div>

                                                            <div>
                                                                {contact.email}
                                                            </div>
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
                                    {" "}
                                    {data.author || "-"}
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
