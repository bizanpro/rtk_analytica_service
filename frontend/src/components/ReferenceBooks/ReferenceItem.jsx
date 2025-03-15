import { useNavigate } from "react-router-dom";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

const ReferenceItem = ({
    data,
    columns,
    mode = "read",
    bookId,
    deleteElement,
}) => {
    const navigate = useNavigate();

    const handleRowClick = () => {
        navigate(`/reference-books/${data.id}`);
    };

    return (
        <tr
            className="border-b border-gray-300 hover:bg-gray-50 transition text-base text-left cursor-pointer"
            {...(!bookId && { onClick: handleRowClick })}
        >
            {columns.map(({ key }) => {
                const value = data[key];

                if (Array.isArray(value) && value.length > 0) {
                    return (
                        <td
                            className="py-7 min-w-[180px] max-w-[200px]"
                            key={key}
                        >
                            <table className="w-full">
                                <tbody className="flex flex-col gap-3">
                                    {Array.isArray(value) ? (
                                        value.map((item, index) => (
                                            <tr key={`${key}_${index}`}>
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
                                                                                    readOnly
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
                                        ))
                                    ) : (
                                        <tr>
                                            <td className="px-4">—</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </td>
                    );
                } else {
                    return (
                        <td
                            className="px-4 py-7 min-w-[180px] max-w-[200px]"
                            key={key}
                        >
                            {(key === "name" ||
                                key === "full_name" ||
                                key === "phone") &&
                            mode === "edit" ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        className="w-full"
                                        value={value?.toString() || "—"}
                                        readOnly
                                    />
                                    <span className="edit-icon"></span>
                                </div>
                            ) : key === "updated_at" && value ? (
                                format(parseISO(value), "d MMMM yyyy, HH:mm", {
                                    locale: ru,
                                }) || "—"
                            ) : (
                                value?.toString() || "—"
                            )}
                        </td>
                    );
                }
            })}

            {mode === "edit" && (
                <td className="px-4 py-7 min-w-[50px] text-center">
                    <button
                        onClick={() => {
                            if (data.projects_count) {
                                if (data.projects_count < 1) {
                                    deleteElement(data.id);
                                }
                            } else {
                                deleteElement(data.id);
                            }
                        }}
                        className="delete-button"
                        title="Удалить элемент"
                        disabled={data.projects_count > 0}
                    >
                        <span className="delete-icon"></span>
                    </button>
                </td>
            )}
        </tr>
    );
};

export default ReferenceItem;
