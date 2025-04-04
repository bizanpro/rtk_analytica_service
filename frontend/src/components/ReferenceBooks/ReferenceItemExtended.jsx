import { useNavigate } from "react-router-dom";

const ReferenceItemExtended = ({ data, bookId }) => {
    const navigate = useNavigate();

    const handleRowClick = () => {
        navigate(`/reference-books/${data.creditor_id}`);
    };

    return (
        <tr
            className="border-b border-gray-300 hover:bg-gray-50 transition text-base text-left cursor-pointer"
            {...(!bookId && { onClick: handleRowClick })}
        >
            <td className="pl-4">{data.name}</td>

            <td>
                <table className="w-full">
                    <tbody>
                        {data.projects.map((project, projIndex) => (
                            <tr
                                className="border-b border-gray-300 w-full"
                                key={projIndex}
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

            <td>
                <table className="w-full">
                    <tbody>
                        {data.projects.map((project, projIndex) => (
                            <tr
                                key={projIndex}
                                className="border-b border-gray-300"
                            >
                                <td
                                    className="max-w-0 overflow-hidden"
                                    style={{
                                        opacity: 0,
                                        pointerEvents: "none",
                                    }}
                                >
                                    <table
                                        key={projIndex}
                                    >
                                        <tbody className="flex flex-col gap-3">
                                            {project.contacts.map(
                                                (contact, contactIndex) => (
                                                    <tr key={contactIndex}>
                                                        <div>
                                                            <strong>ФИО</strong>
                                                            {contact.full_name}
                                                        </div>
                                                        <div>
                                                            <strong>
                                                                Должность
                                                            </strong>
                                                            {contact.position}
                                                        </div>
                                                        <div>
                                                            <strong>
                                                                Телефон
                                                            </strong>
                                                            {contact.phone}
                                                        </div>
                                                        <div>
                                                            <strong>
                                                                Email
                                                            </strong>
                                                            {contact.email}
                                                        </div>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </td>

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
