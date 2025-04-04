import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ReferenceItemExtended = ({ data, bookId }) => {
    const navigate = useNavigate();

    const handleRowClick = () => {
        navigate(`/reference-books/${data.creditor_id}`);
    };

    const targetRefs = useRef([]);
    const destinationRefs = useRef([]);

    useEffect(() => {
        data.projects.forEach((_, index) => {
            const target = targetRefs.current[index];
            const destination = destinationRefs.current[index];

            console.log(target);
            console.log(destination);

            if (target && destination) {
                const targetHeight = target.getBoundingClientRect().height;
                destination.style.height = `${targetHeight}px`;
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
                                            {project.contacts.map(
                                                (contact, contactIndex) => (
                                                    <tr
                                                        key={contactIndex}
                                                        className="w-full"
                                                    >
                                                        <td className="w-full">
                                                            <div>
                                                                <strong>
                                                                    ФИО{" "}
                                                                </strong>
                                                                {
                                                                    contact.full_name
                                                                }
                                                            </div>
                                                            <div>
                                                                <strong>
                                                                    Должность{" "}
                                                                </strong>
                                                                {
                                                                    contact.position
                                                                }
                                                            </div>
                                                            <div>
                                                                <strong>
                                                                    Телефон{" "}
                                                                </strong>
                                                                {contact.phone}
                                                            </div>
                                                            <div>
                                                                <strong>
                                                                    Email{" "}
                                                                </strong>
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
                        {data.projects.map((project, projIndex) => (
                            <tr
                                className={`${
                                    projIndex === data.projects.length - 1
                                        ? ""
                                        : "border-b border-gray-300"
                                }`}
                                key={projIndex}
                                ref={(el) =>
                                    (destinationRefs.current[projIndex] = el)
                                }
                            >
                                <td className="px-4 min-w-[210px]">
                                    {project.name}
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
