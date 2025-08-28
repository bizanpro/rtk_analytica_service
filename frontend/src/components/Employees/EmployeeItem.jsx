import { useNavigate } from "react-router-dom";

const EmployeeItem = ({ data, columns }) => {
    const navigate = useNavigate();

    const handleRowClick = () => {
        navigate(`/employees/${data.id}`);
    };

    return (
        <tr
            className="border-b border-gray-300 hover:bg-gray-50 transition text-base text-left cursor-pointer"
            onClick={handleRowClick}
        >
            {columns.map(({ key }) => {
                let value = data[key];

                if (key === "is_staff") {
                    value = value ? "штатный" : "внештатный";
                } else if (key === "is_active") {
                    value = value ? "работает" : "не работает"
                }

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
                                                                    ]) => (
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
                    if (key === "position") {
                        return (
                            <td
                                className="px-4 py-7 min-w-[180px] max-w-[200px]"
                                key={key}
                            >
                                {value?.name?.toString() || "—"}
                            </td>
                        );
                    } else {
                        return (
                            <td
                                className="px-4 py-7 min-w-[180px] max-w-[200px]"
                                key={key}
                            >
                                {value?.toString() || "—"}
                            </td>
                        );
                    }
                }
            })}
        </tr>
    );
};

export default EmployeeItem;
