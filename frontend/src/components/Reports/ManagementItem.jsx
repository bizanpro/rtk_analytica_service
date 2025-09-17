import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

import ManagementItemRateSwitch from "./ManagementItemRateSwitch";

const ManagementItem = ({
    columns,
    props,
    selectedRateReport,
    selectedReport,
    openManagementReportEditor,
    openRateReportEditor,
    managementReportEditorHandler,
}) => {
    return (
        <tr
            className={`border-b border-gray-300 hover:bg-gray-50 transition text-base text-left cursor-pointer 
            ${
                props?.status?.toLowerCase() == "не начат"
                    ? "opacity-[40%]"
                    : ""
            } `}
            onClick={() => {
                !props.is_management
                    ? openRateReportEditor(props)
                    : openManagementReportEditor(props);
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
                            className={`border-b border-gray-300 px-4 py-5 min-w-[180px] max-w-[200px] text-lg ${
                                key === "status" &&
                                value?.toLowerCase() == "утверждён"
                                    ? "text-green-400"
                                    : ""
                            }`}
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
                                } else if (
                                    key === "score" &&
                                    !props.is_management
                                ) {
                                    return (
                                        <div className="w-[80px]">
                                            <ManagementItemRateSwitch
                                                name={"general_assessment"}
                                                rateHandler={
                                                    managementReportEditorHandler
                                                }
                                                reportRateData={props}
                                            />
                                        </div>
                                    );
                                } else if (
                                    props.is_management &&
                                    key === "name"
                                ) {
                                    return (
                                        <div
                                            className={`${
                                                selectedReport.id == props.id &&
                                                "font-semibold"
                                            }`}
                                        >
                                            {value?.toString() || "—"}
                                        </div>
                                    );
                                } else if (
                                    !props.is_management &&
                                    key === "name"
                                ) {
                                    return (
                                        <div className="flex flex-col gap-2">
                                            <div
                                                className={`${
                                                    selectedRateReport.real_id ==
                                                        props.real_id &&
                                                    "font-semibold"
                                                }`}
                                            >
                                                {value?.toString() || "—"}
                                            </div>

                                            {props.misc?.length > 0 && (
                                                <ul className="flex flex-wrap gap-2">
                                                    {props.misc?.map(
                                                        (item, index) => (
                                                            <li
                                                                className="text-gray-300 border rounded-3xl border-gray-300 py-1.5 px-4 w-fit text-sm"
                                                                key={index}
                                                            >
                                                                {item}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            )}
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
        </tr>
    );
};

export default ManagementItem;
