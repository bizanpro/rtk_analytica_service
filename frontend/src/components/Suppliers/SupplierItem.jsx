import { useNavigate } from "react-router-dom";
import handleStatus from "../../utils/handleStatus";

const SupplierItem = ({ props, columns }) => {
    const navigate = useNavigate();

    const handleRowClick = () => {
        navigate(`/suppliers/${props.id}`, { state: { mode: "read" } });
    };

    return (
        <tr
            className="border-b border-gray-300 hover:bg-gray-50 transition text-base text-left cursor-pointer"
            onClick={handleRowClick}
        >
            {columns.map(({ key }) => {
                const value = props[key];

                if (Array.isArray(value) && value !== null) {
                    if (value?.length > 0) {
                        return (
                            <td
                                className="border-b border-gray-300 py-2.5 min-w-[180px] max-w-[200px]"
                                key={key}
                            >
                                <table className="w-full">
                                    <tbody>
                                        {value?.map((item, index) => (
                                            <tr key={`${key}_${index}`}>
                                                <td
                                                    className={`px-4 ${
                                                        index !==
                                                        value?.length - 1
                                                            ? "pb-1"
                                                            : "pt-1"
                                                    }`}
                                                >
                                                    {key === "roles" ? (
                                                        <div className="border border-gray-300 py-1 px-3 w-fit rounded">
                                                            {item?.toString()}
                                                        </div>
                                                    ) : (
                                                        item?.toString()
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </td>
                        );
                    } else {
                        return (
                            <td
                                className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px]"
                                key={key}
                            >
                                —
                            </td>
                        );
                    }
                } else if (typeof value === "object" && value !== null) {
                    if (key === "role") {
                        return (
                            <td
                                className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px]"
                                key={key}
                            >
                                {Array.isArray(value) && value.length > 0 ? (
                                    value.map((item, index) => (
                                        <div
                                            key={`${key}_${index}`}
                                            className="border border-gray-200 px-2 rounded-md w-max mb-1"
                                        >
                                            {item?.name || "—"}
                                        </div>
                                    ))
                                ) : (
                                    <div className="border border-gray-200 px-2 rounded-md w-max">
                                        {value?.name || "—"}
                                    </div>
                                )}
                            </td>
                        );
                    } else {
                        return Object.entries(value).map(
                            ([subKey, subValue]) => (
                                <td
                                    className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px]"
                                    key={subKey}
                                >
                                    {subValue?.toString()}
                                </td>
                            )
                        );
                    }
                } else {
                    if (key === "status") {
                        return (
                            <td
                                className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px]"
                                key={key}
                            >
                                {handleStatus(value?.toString()) || "—"}
                            </td>
                        );
                    } else {
                        return (
                            <td
                                className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px]"
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

export default SupplierItem;
