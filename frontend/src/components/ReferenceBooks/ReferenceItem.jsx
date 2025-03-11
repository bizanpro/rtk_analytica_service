import { useNavigate } from "react-router-dom";

const ReferenceItem = ({ data, columns, mode = "read", bookId }) => {
    const navigate = useNavigate();

    columns = bookId ? columns[bookId] : columns;

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

                if (Array.isArray(value) && value.length > 1) {
                    return (
                        <td
                            className="border-b border-gray-300 py-7 min-w-[180px] max-w-[200px]"
                            key={key}
                        >
                            <table className="w-full">
                                <tbody>
                                    {Array.isArray(value) ? (
                                        value.map((item, index) => (
                                            <tr key={`${key}_${index}`}>
                                                <td
                                                    className={`px-4 ${
                                                        index !==
                                                        value.length - 1
                                                            ? "pb-1"
                                                            : "pt-1"
                                                    }`}
                                                >
                                                    {key === "name" &&
                                                    mode === "edit" ? (
                                                        <input
                                                            type="text"
                                                            className="w-full"
                                                            defaultValue={
                                                                item?.toString() ||
                                                                "—"
                                                            }
                                                        />
                                                    ) : typeof item ===
                                                          "object" &&
                                                      item !== null ? (
                                                        <div className="flex flex-col gap-1">
                                                            {Object.entries(
                                                                item
                                                            ).map(
                                                                ([
                                                                    field,
                                                                    val,
                                                                ]) => (
                                                                    <div
                                                                        key={
                                                                            field
                                                                        }
                                                                    >
                                                                        <span className="font-medium">
                                                                            {
                                                                                field
                                                                            }
                                                                            :
                                                                        </span>{" "}
                                                                        {val?.toString() ||
                                                                            "—"}
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    ) : (
                                                        item?.toString() || "—"
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
                            className="border-b border-gray-300 px-4 py-7 min-w-[180px] max-w-[200px]"
                            key={key}
                        >
                            {key === "name" && mode === "edit" ? (
                                <>
                                    <input
                                        type="text"
                                        className="w-full"
                                        defaultValue={value?.toString() || "—"}
                                    />
                                    <svg
                                        width="30"
                                        height="30"
                                        viewBox="0 0 128 128"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M91.4 63.5L64.5 36.6 1 100.1V127h26.9l63.5-63.5zM9 119v-15.6l55.5-55.5 15.6 15.6L24.6 119H9zM55 119h44v8H55zM109 119h8v8h-8zM71.6 29.6l26.9 26.9L116.8 38 90 11.2 71.6 29.6zm26.8 15.5L82.9 29.6l7.1-7.1L105.5 38l-7.1 7.1z" />
                                    </svg>
                                </>
                            ) : (
                                value?.toString() || "—"
                            )}
                        </td>
                    );
                }
            })}

            {mode === "edit" && (
                <td className="border-b border-gray-300 px-4 py-7 min-w-[50px] text-center">
                    <button
                        // onClick={() => removeBlock(data.id, data, method)}
                        className="delete-button"
                        title="Удалить элемент"
                    >
                        <svg
                            height="24"
                            width="24"
                            viewBox="0 0 48 48"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M41 48H7V7h34v41zM9 46h30V9H9v37z" />
                            <path d="M35 9H13V1h22v8zM15 7h18V3H15v4zM16 41a1 1 0 01-1-1V15a1 1 0 112 0v25a1 1 0 01-1 1zM24 41a1 1 0 01-1-1V15a1 1 0 112 0v25a1 1 0 01-1 1zM32 41a1 1 0 01-1-1V15a1 1 0 112 0v25a1 1 0 01-1 1z" />
                            <path d="M0 7h48v2H0z" />
                        </svg>
                    </button>
                </td>
            )}
        </tr>
    );
};

export default ReferenceItem;
