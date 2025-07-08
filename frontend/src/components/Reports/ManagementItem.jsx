import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

import RateSwitch from "../RateSwitch";

const ManagementItem = ({ columns, props, openManagementReportEditor }) => {
    return (
        <tr
            className="border-b border-gray-300 hover:bg-gray-50 transition text-base text-left cursor-pointer"
            onClick={() => {
                openManagementReportEditor(props, "edit");
            }}
        >
            {columns.map(({ key }) => {
                const value = props[key];

                if (Array.isArray(value) && value !== null) {
                    if (value?.length > 0) {
                        return (
                            <td
                                className="border-b border-gray-300 py-5 min-w-[180px] max-w-[200px] text-lg"
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
                                                    {item?.toString()}
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
                                className="border-b border-gray-300 px-4 py-5 min-w-[180px] max-w-[200px] text-lg"
                                key={key}
                            >
                                —
                            </td>
                        );
                    }
                } else if (typeof value === "object" && value !== null) {
                    if (key === "physical_person") {
                        return (
                            <td
                                className="border-b border-gray-300 px-4 py-5 min-w-[180px] max-w-[200px] text-lg"
                                key={key}
                            >
                                {value?.name?.toString() || "—"}
                            </td>
                        );
                    }
                } else {
                    return (
                        <td
                            className="border-b border-gray-300 px-4 py-5 min-w-[180px] max-w-[200px] text-lg"
                            key={key}
                        >
                            {(() => {
                                if (
                                    (key === "updated_at" ||
                                        key === "created_at") &&
                                    value
                                ) {
                                    return (
                                        format(parseISO(value), "d MMMM yyyy", {
                                            locale: ru,
                                        }) || "—"
                                    );
                                } else if (key === "score") {
                                    return (
                                        <div className="w-[80px]">
                                            {/* <RateSwitch /> */}
                                        </div>
                                    );
                                } else {
                                    return value?.toString() || "—";
                                }
                            })()}
                        </td>
                    );
                }
            })}
            {/* <td>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        openManagementReportEditor(props, "edit");
                    }}
                >
                    Изменить
                </button>
            </td> */}
        </tr>
    );
};

export default ManagementItem;
