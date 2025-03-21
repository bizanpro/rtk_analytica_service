import { useNavigate } from "react-router-dom";

const ReferenceItemExtended = ({
    data,
    mode = "read",
    bookId,
    deleteElement,
    editElement,
    handleInputChange,
}) => {
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
                                    className="py-3 w-[75%]"
                                    style={{
                                        opacity: 0,
                                        pointerEvents: "none",
                                    }}
                                >
                                    <table key={projIndex}>
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

                                <td className="pr-4 min-w-[210px] max-w-[210px]">{project.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </td>
        </tr>
    );
};

export default ReferenceItemExtended;

{
    /* <tr
className="border-b border-gray-300 hover:bg-gray-50 transition text-base text-left cursor-pointer"
{...(!bookId && { onClick: handleRowClick })}
>
<td className="py-7 min-w-[180px] max-w-[200px]">
    {data.name?.toString() || "—"}
</td>

<td>
    <table className="w-full">
        <tbody className="flex flex-col gap-3">
            {data.projects?.length > 0 &&
                data.projects.map(
                    (item) =>
                        item.contacts?.length > 0 &&
                        item.contacts?.map((item, index) => (
                            <td
                                className="py-7 px-4 min-w-[180px] max-w-[200px]"
                                key={`${item.id}_${index}`}
                            >
                                <tr>
                                    <td className="px-4">
                                        {typeof item === "object" &&
                                            item !== null && (
                                                <div className="flex flex-col gap-1">
                                                    {Object.entries(
                                                        item
                                                    ).map(
                                                        ([
                                                            field,
                                                            val,
                                                        ]) =>
                                                            (field ===
                                                                "name" ||
                                                                field ===
                                                                    "full_name" ||
                                                                field ===
                                                                    "phone") &&
                                                            mode ===
                                                                "edit" ? (
                                                                <div
                                                                    key={
                                                                        field
                                                                    }
                                                                    className="flex items-center gap-2"
                                                                >
                                                                    <input
                                                                        type="text"
                                                                        className="w-full"
                                                                        value={
                                                                            val?.toString() ||
                                                                            "—"
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleInputChange(
                                                                                e,
                                                                                field,
                                                                                data.creditor_id
                                                                            )
                                                                        }
                                                                    />
                                                                    <span className="edit-icon"></span>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    className="text-sm"
                                                                    key={
                                                                        field
                                                                    }
                                                                >
                                                                    {val?.toString() ||
                                                                        "—"}
                                                                </div>
                                                            )
                                                    )}
                                                </div>
                                            )}
                                    </td>
                                </tr>
                            </td>
                        ))
                )}
        </tbody>
    </table>
</td>

<td className="py-7">
    <table className="w-full">
        <tbody className="flex flex-col gap-3">
            {data.projects?.map((item, index) => (
                <tr>
                    <td className="px-4 min-w-[180px] max-w-[200px]">
                        {item.name?.toString() || "—"}
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</td>

{mode === "edit" && (
    <td className="flex items-center gap-2 px-4 py-7 min-w-[50px] text-center">
        <button
            onClick={() => {
                editElement(data.creditor_id);
            }}
            className="delete-button"
            title="Изменить элемент"
        >
            <span className="update-icon"></span>
        </button>
        <button
            onClick={() => {
                deleteElement(data.creditor_id);
            }}
            className="delete-button"
            title="Удалить элемент"
        >
            <span className="delete-icon"></span>
        </button>
    </td>
)}
</tr> */
}
