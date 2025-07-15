const ReportItem = ({
    columns,
    props,
    openReportEditor,
    // openSubReportEditor,
}) => {
    return (
        <tr
            className="border-b border-gray-300 hover:bg-gray-50 transition text-base text-left cursor-pointer"
            onClick={() => {
                openReportEditor(props);
            }}
        >
            {columns.map(({ key }) => {
                const value = props[key];

                if (Array.isArray(value) && value !== null) {
                    if (value?.length > 0) {
                        return (
                            <td
                                className="border-b border-gray-300 py-2.5 min-w-[180px] max-w-[200px] text-lg"
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
                                                    {key ===
                                                        "project_managers" ||
                                                    key === "creditors"
                                                        ? item.name
                                                        : item?.toString()}
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
                                className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px] text-lg"
                                key={key}
                            >
                                —
                            </td>
                        );
                    }
                } else if (typeof value === "object" && value !== null) {
                    if (key === "project") {
                        return (
                            <td
                                className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px] text-lg"
                                key={key}
                            >
                                {value?.name?.toString() || "—"}
                                <br />
                                <span className="text-gray-400 text-sm">
                                    {value?.industry?.name}
                                </span>
                            </td>
                        );
                    } else if (key === "contragent") {
                        return (
                            <td
                                className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px] text-lg"
                                key={key}
                            >
                                {value?.name?.toString() || "—"}
                            </td>
                        );
                    } else {
                        return Object.entries(value).map(
                            ([subKey, subValue]) => (
                                <td
                                    className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px] text-lg"
                                    key={subKey}
                                >
                                    {subValue?.toString() || "—"}
                                </td>
                            )
                        );
                    }
                } else {
                    if (key === "report_period_code") {
                        return (
                            <td
                                className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px] text-lg"
                                key={key}
                            >
                                {value?.toString() || "—"}
                                <br />
                                <span className="text-base">
                                    {props?.report_period?.toString()}
                                </span>
                            </td>
                        );
                    } else if (key === "project_budget") {
                        return (
                            <td
                                className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px] text-2xl"
                                key={key}
                            >
                                {value?.toString() || "—"}

                                <div className="text-base">млрд руб.</div>
                            </td>
                        );
                    } else if (key === "report_status") {
                        return (
                            <td
                                className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px]"
                                key={key}
                            >
                                <div
                                    className={`rounded px-3 py-1 text-center
                                            ${
                                                value === "Завершен"
                                                    ? "bg-green-400"
                                                    : "bg-gray-200"
                                            }
                                        `}
                                >
                                    {value?.toString() || "—"}
                                </div>
                            </td>
                        );
                    } else if (key === "days") {
                        return (
                            <td
                                className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px] text-2xl"
                                key={key}
                            >
                                {value?.toString() || "—"}

                                <div className="text-base">
                                    {props?.execution_period}
                                </div>
                            </td>
                        );
                    } else if (key === "implementation_period") {
                        return (
                            <td
                                className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px] text-2xl"
                                key={key}
                            >
                                <div className="flex items-end gap-1">
                                    <div className="flex items-end gap-1">
                                        {value?.toString() || "—"}{" "}
                                        <span className="text-base">мес.</span>
                                    </div>

                                    {props?.completion_percentage && (
                                        <div className="text-gray-300 border-gray-300 py-1 px-1 text-center border rounded-md text-sm">
                                            {Math.round(
                                                props?.completion_percentage
                                            )}
                                            %
                                        </div>
                                    )}
                                </div>

                                <div className="text-base">
                                    до {props?.implementation_period_string}
                                </div>
                            </td>
                        );
                    } else {
                        return (
                            <td
                                className="border-b border-gray-300 px-4 py-2.5 min-w-[180px] max-w-[200px] text-lg"
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

export default ReportItem;
